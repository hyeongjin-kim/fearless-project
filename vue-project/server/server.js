import { createServer } from "http";
import { Server } from "socket.io";
import 'dotenv/config';

const address = process.env.VITE_SERVER_ADDRESS;
const page_port = process.env.VITE_PAGE_PORT;
const socket_port = process.env.VITE_SOCKET_PORT;

const MAX_CONNECTIONS = 10;
const STATE = [
    {phase: "Ready", turn: "Blue", index: 0},
    {phase: "Ban", turn: "Blue", index: 4},
    {phase: "Ban", turn: "Red", index: 0},
    {phase: "Ban", turn: "Blue", index: 3},
    {phase: "Ban", turn: "Red", index: 1},
    {phase: "Ban", turn: "Blue", index: 2},
    {phase: "Ban", turn: "Red", index: 2},
        
    {phase: "Pick", turn: "Blue", index: 4},
    {phase: "Pick", turn: "Red", index: 0},
    {phase: "Pick", turn: "Red", index: 1},
    {phase: "Pick", turn: "Blue", index: 3},
    {phase: "Pick", turn: "Blue", index: 2},
    {phase: "Pick", turn: "Red", index: 2},

    {phase: "Ban", turn: "Red", index: 3},
    {phase: "Ban", turn: "Blue", index: 1},
    {phase: "Ban", turn: "Red", index: 4},
    {phase: "Ban", turn: "Blue", index: 0},

    {phase: "Pick", turn: "Red", index: 3},
    {phase: "Pick", turn: "Blue", index: 1},
    {phase: "Pick", turn: "Blue", index: 0},
    {phase: "Pick", turn: "Red", index: 4},
    {phase: "Done", turn: "None", index: -1},
];

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: `http://${address}:${page_port}`,
        methods: ["GET", "POST"],
    },
    maxConnections: MAX_CONNECTIONS,
});

const player_info = {
    blue_player_1: { socket_id: null, nickname: '' },
    blue_player_2: { socket_id: null, nickname: '' },
    blue_player_3: { socket_id: null, nickname: '' },
    blue_player_4: { socket_id: null, nickname: '' },
    blue_player_5: { socket_id: null, nickname: '' },
    red_player_1: { socket_id: null, nickname: '' },
    red_player_2: { socket_id: null, nickname: '' },
    red_player_3: { socket_id: null, nickname: '' },
    red_player_4: { socket_id: null, nickname: '' },
    red_player_5: { socket_id: null, nickname: '' },
    bench : [],
};

const game_info = {
    state_idx: 0,
    set_idx: 1,
    blue_pick: ["", "", "", "", ""],
    blue_ban: ["", "", "", "", ""],
    blue_global_ban: [],
    red_pick: ["", "", "", "", ""],
    red_ban: ["", "", "", "", ""],
    red_global_ban: [],
}

const getNextPlayer = function () {
    for (const key in player_info) {
        if (player_info[key].socket_id === null) {
            return key;
        }
    }
    return null;
};

const findJoinedPlayer = function (socket_id) {
    console.log(`DEBUG - findJoinedPlayer, socket_id: ${socket_id}`);
    for (const key in player_info) {
        console.log(`DEBUG - findJoinedPlayer, id: ${player_info[key].socket_id}, nickname: ${player_info[key].nickname}`);
        if (player_info[key].socket_id === socket_id) {
            return key;
        }
    }
    return null;
};

const findBenchedPlayer = function(socket_id) {
    console.log(`DEBUG - findBenchPlayer, socket_id: ${socket_id}`);
    for (const { socket_id: id, nickname } of player_info.bench) {
        console.log(`DEBUG - findBenchPlayer, id: ${id}, nickname: ${nickname}`);
        if (id === socket_id) {
            return nickname;
        }
    }
    return null;
}

const Choose = function(champion_name) {
    const {phase, turn, index} = STATE[game_info.state_idx];
    if (phase == "Ban") {
        if (turn == "Blue") {
            game_info.blue_ban[index] = champion_name;
        }
        else if (turn == "Red"){
            game_info.red_ban[index] = champion_name;
        }
    }
    else if (phase == "Pick") {
        if (turn == "Blue") {
            game_info.blue_pick[index] = champion_name;
        }
        else if(turn == "Red") {
            game_info.red_pick[index] = champion_name;
        }
    }
}

io.on("connection", (socket) => {
    console.log(`a user connected with id ${socket.id}`);
    
    // 10명 넘게 연결 들어오면 끊어버리기
    const count_connections = Object.keys(io.sockets.sockets).length;
    if (count_connections > 10) {
        socket.disconnect(true);
        console.log(
            `user disconnected due to connection count limits ${MAX_CONNECTIONS}`
        );
    }
    
    const playerKey = getNextPlayer();
    if (playerKey) {
        player_info[playerKey].socket_id = socket.id;
    }
    
    socket.on("set_nickname", (data) => {
        player_info[playerKey].nickname = data.nickname;
        io.emit("player_info", {
            player_info
        });
    });
    
    socket.on("get_player_info", () => {
        socket.emit("player_info", { player_info });
        console.log("data transferrd")
    });
    
    socket.on("join_bench", () => {
        const key = findJoinedPlayer(socket.id);
        if (key) {
            player_info.bench.push({
                socket_id: player_info[key].socket_id,
                nickname: player_info[key].nickname
            });
            player_info[key].socket_id = null;
            player_info[key].nickname = '';
            io.emit("player_info", {
                player_info
            });
        }
        
    });

    socket.on("move", (move_info) => {
        const key = findJoinedPlayer(socket.id)
        // 1. 블루/레드팀 참가한 상태에서 움직임
        const nickname = findBenchedPlayer(socket.id);
        console.log(nickname)
        if (key) {
            console.log("in place")
            player_info[`${move_info.team}_player_${move_info.index + 1}`].socket_id = socket.id;
            player_info[`${move_info.team}_player_${move_info.index + 1}`].nickname = player_info[key].nickname;
            player_info[key].socket_id = null;
            player_info[key].nickname = '';
        }
        // 2. 벤치에서 움직임
        else if (nickname) {
            console.log("in bench")
            player_info[`${move_info.team}_player_${move_info.index + 1}`].socket_id = socket.id;
            player_info[`${move_info.team}_player_${move_info.index + 1}`].nickname = nickname;
            player_info.bench = player_info.bench.filter(player => player.socket_id !== socket.id);
        }
        else return;
        io.emit("player_info", {
            player_info
        });
    });

    socket.on("game_start", () => {
        console.log("game_start");
        io.emit("game_start");
    })

    socket.on("match_start", () =>{
        console.log("match started");
        io.emit("match_start");
    })

    socket.on("match_reset", ()=>{
        console.log("match reset");
        io.emit("match_reset");
    })

    socket.on("game_reset", ()=>{
        console.log("game reset");
        io.emit("game_reset");
    })

    socket.on("swap", ()=>{
        console.log("swap");
        
        io.emit("swap");
    })

    socket.on("choose", (champion_name) => {
        console.log(`choosed ${champion_name} on status`);
        console.log(`game_info: ${JSON.stringify(game_info)}`);
        Choose(champion_name);
        io.emit("choose", {game_info: game_info});
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
        const key = findJoinedPlayer(socket.id);
        const nickname = findBenchedPlayer(socket.id);
        // 1. 블루/레드팀 참가한 상태
        if (key) {
            player_info[key].socket_id = null;
            player_info[key].nickname = '';
        }
        // 2. 벤치 참가한 상태
        else if(nickname){
            player_info.bench = player_info.bench.filter(player => player.socket_id !== socket.id);
        }
        else return;
        io.emit("player_info", {
            player_info
        });
        socket.disconnect(true);        
    });  
});

server.listen(socket_port, '0.0.0.0', ()=>{
    console.log("server is running!!");
});
