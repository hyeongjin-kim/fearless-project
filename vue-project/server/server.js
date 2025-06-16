import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

const address = process.env.VITE_SERVER_ADDRESS;
const page_port = process.env.VITE_PAGE_PORT;
const socket_port = process.env.VITE_SOCKET_PORT;

const MAX_CONNECTIONS = 10;
const STATE = [
    { phase: "Ready", turn: "Blue", index: 0 },
    { phase: "Ban", turn: "Blue", index: 4 },
    { phase: "Ban", turn: "Red", index: 0 },
    { phase: "Ban", turn: "Blue", index: 3 },
    { phase: "Ban", turn: "Red", index: 1 },
    { phase: "Ban", turn: "Blue", index: 2 },
    { phase: "Ban", turn: "Red", index: 2 },

    { phase: "Pick", turn: "Blue", index: 4 },
    { phase: "Pick", turn: "Red", index: 0 },
    { phase: "Pick", turn: "Red", index: 1 },
    { phase: "Pick", turn: "Blue", index: 3 },
    { phase: "Pick", turn: "Blue", index: 2 },
    { phase: "Pick", turn: "Red", index: 2 },

    { phase: "Ban", turn: "Red", index: 3 },
    { phase: "Ban", turn: "Blue", index: 1 },
    { phase: "Ban", turn: "Red", index: 4 },
    { phase: "Ban", turn: "Blue", index: 0 },

    { phase: "Pick", turn: "Red", index: 3 },
    { phase: "Pick", turn: "Blue", index: 1 },
    { phase: "Pick", turn: "Blue", index: 0 },
    { phase: "Pick", turn: "Red", index: 4 },
    { phase: "Done", turn: "None", index: -1 },
];

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: `http://${address}`,
        methods: ["GET", "POST"],
    },
    maxConnections: MAX_CONNECTIONS,
});

const player_info = {
    blue_player_1: { socket_id: null, nickname: "" },
    blue_player_2: { socket_id: null, nickname: "" },
    blue_player_3: { socket_id: null, nickname: "" },
    blue_player_4: { socket_id: null, nickname: "" },
    blue_player_5: { socket_id: null, nickname: "" },
    red_player_1: { socket_id: null, nickname: "" },
    red_player_2: { socket_id: null, nickname: "" },
    red_player_3: { socket_id: null, nickname: "" },
    red_player_4: { socket_id: null, nickname: "" },
    red_player_5: { socket_id: null, nickname: "" },
    bench: [],
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
};

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
        console.log(
            `DEBUG - findJoinedPlayer, id: ${player_info[key].socket_id}, nickname: ${player_info[key].nickname}`
        );
        if (player_info[key].socket_id === socket_id) {
            return key;
        }
    }
    return null;
};

const findBenchedPlayer = function (socket_id) {
    console.log(`DEBUG - findBenchPlayer, socket_id: ${socket_id}`);
    for (const { socket_id: id, nickname } of player_info.bench) {
        console.log(
            `DEBUG - findBenchPlayer, id: ${id}, nickname: ${nickname}`
        );
        if (id === socket_id) {
            return nickname;
        }
    }
    return null;
};

const choose = function (champion_name) {
    const { phase, turn, index } = STATE[game_info.state_idx];
    if (phase == "Ban") {
        if (turn == "Blue") {
            game_info.blue_ban[index] = champion_name;
        } else if (turn == "Red") {
            game_info.red_ban[index] = champion_name;
        }
    } else if (phase == "Pick") {
        if (turn == "Blue") {
            game_info.blue_pick[index] = champion_name;
        } else if (turn == "Red") {
            game_info.red_pick[index] = champion_name;
        }
    }
};

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
            player_info,
        });
    });

    socket.on("get_player_info", () => {
        socket.emit("player_info", { player_info });
        console.log("data transferrd");
    });

    socket.on("join_bench", () => {
        const key = findJoinedPlayer(socket.id);
        if (key) {
            player_info.bench.push({
                socket_id: player_info[key].socket_id,
                nickname: player_info[key].nickname,
            });
            player_info[key].socket_id = null;
            player_info[key].nickname = "";
            io.emit("player_info", {
                player_info,
            });
        }
    });

    socket.on("move", (move_info) => {
        const key = findJoinedPlayer(socket.id);
        // 1. 블루/레드팀 참가한 상태에서 움직임
        const nickname = findBenchedPlayer(socket.id);
        console.log(nickname);
        if (key) {
            console.log("in place");
            player_info[
                `${move_info.team}_player_${move_info.index + 1}`
            ].socket_id = socket.id;
            player_info[
                `${move_info.team}_player_${move_info.index + 1}`
            ].nickname = player_info[key].nickname;
            player_info[key].socket_id = null;
            player_info[key].nickname = "";
        }
        // 2. 벤치에서 움직임
        else if (nickname) {
            console.log("in bench");
            player_info[
                `${move_info.team}_player_${move_info.index + 1}`
            ].socket_id = socket.id;
            player_info[
                `${move_info.team}_player_${move_info.index + 1}`
            ].nickname = nickname;
            player_info.bench = player_info.bench.filter(
                (player) => player.socket_id !== socket.id
            );
        } else return;
        io.emit("player_info", {
            player_info,
        });
    });

    socket.on("get_game_info", () => {
        console.log("Game info");
        io.emit("get_game_info", { game_info: game_info });
    });

    // 처음부터 시작
    socket.on("Start_Fearless", () => {
        console.log("Start_Fearless");
        io.emit("Start_Fearless");
        io.emit("get_game_info", { game_info: game_info });
    });

    // 해당 게임 시작
    socket.on("game_start", () => {
        console.log(`game ${game_info.set_idx} start`);
        game_info.state_idx++;
        io.emit("get_game_info", { game_info: game_info });
        io.emit("game_start");
    });
    //해당 게임 종료
    socket.on("game_end", () => {
        console.log(`game ${game_info.set_idx} end`);
        game_info.state_idx = 0;
        game_info.set_idx++;

        // deep copy 후 global_ban에 추가
        game_info.blue_global_ban.push([...game_info.blue_pick]);
        game_info.red_global_ban.push([...game_info.red_pick]);

        game_info.blue_ban = ["", "", "", "", ""];
        game_info.red_ban = ["", "", "", "", ""];
        game_info.blue_pick = ["", "", "", "", ""];
        game_info.red_pick = ["", "", "", "", ""];
        io.emit("get_game_info", { game_info: game_info });
        io.emit("game_end");
    });

    // 전체 초기화
    socket.on("match_reset", () => {
        console.log("match reset");
        game_info.state_idx = 0;
        game_info.set_idx = 1;
        game_info.blue_ban = ["", "", "", "", ""];
        game_info.red_ban = ["", "", "", "", ""];
        game_info.blue_pick = ["", "", "", "", ""];
        game_info.red_pick = ["", "", "", "", ""];
        game_info.blue_global_ban = [];
        game_info.red_global_ban = [];
        io.emit("get_game_info", { game_info: game_info });
        io.emit("match_reset");
    });

    // 게임 초기화
    socket.on("game_reset", () => {
        console.log("game reset");
        game_info.state_idx = 0;
        game_info.blue_ban = ["", "", "", "", ""];
        game_info.red_ban = ["", "", "", "", ""];
        game_info.blue_pick = ["", "", "", "", ""];
        game_info.red_pick = ["", "", "", "", ""];
        io.emit("get_game_info", { game_info: game_info });
        io.emit("game_reset");
    });

    // 진영 변경
    socket.on("swap", () => {
        console.log("swap");
        let tempban = game_info.blue_ban.reverse();
        game_info.blue_ban = game_info.red_ban.reverse();
        game_info.red_ban = tempban;

        // 글로벌 밴 deep swap
        let tempglobalben = game_info.blue_global_ban.map((arr) =>
            [...arr].reverse()
        );
        game_info.blue_global_ban = game_info.red_global_ban.map((arr) =>
            [...arr].reverse()
        );
        game_info.red_global_ban = tempglobalben;

        let temppick = game_info.blue_pick.reverse();
        game_info.blue_pick = game_info.red_pick.reverse();
        game_info.red_pick = temppick;

        // blue_player와 red_player 정보 swap
        for (let i = 1; i <= 5; i++) {
            const blueKey = `blue_player_${i}`;
            const redKey = `red_player_${i}`;
            const temp = { ...player_info[blueKey] };
            player_info[blueKey] = { ...player_info[redKey] };
            player_info[redKey] = temp;
        }
        io.emit("player_info", {
            player_info,
        });
        io.emit("get_game_info", { game_info: game_info });
        io.emit("swap");
    });

    // 라인 스왑
    socket.on("line_swap", (line_swap_info) => {
        console.log("line_swap");
        if (line_swap_info.team == "Blue") {
            let swap_temp = game_info.blue_pick[line_swap_info.index[0]];
            game_info.blue_pick[line_swap_info.index[0]] =
                game_info.blue_pick[line_swap_info.index[1]];
            game_info.blue_pick[line_swap_info.index[1]] = swap_temp;
        } else if (line_swap_info.team == "Red") {
            let swap_temp = game_info.red_pick[line_swap_info.index[0]];
            game_info.red_pick[line_swap_info.index[0]] =
                game_info.red_pick[line_swap_info.index[1]];
            game_info.red_pick[line_swap_info.index[1]] = swap_temp;
        }
        io.emit("get_game_info", { game_info: game_info });
    });

    socket.on("choose", (data) => {
        console.log(`choosed ${data.champion_name} on status`);
        console.log(`game_info: ${JSON.stringify(game_info)}`);
        choose(data.champion_name);
        io.emit("get_game_info", { game_info: game_info });
    });

    socket.on("confirm", () => {
        console.log(`confirmed`);
        game_info.state_idx++;
        io.emit("get_game_info", { game_info: game_info });
        io.emit("comfirm");
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        const key = findJoinedPlayer(socket.id);
        const nickname = findBenchedPlayer(socket.id);
        // 1. 블루/레드팀 참가한 상태
        if (key) {
            player_info[key].socket_id = null;
            player_info[key].nickname = "";
        }
        // 2. 벤치 참가한 상태
        else if (nickname) {
            player_info.bench = player_info.bench.filter(
                (player) => player.socket_id !== socket.id
            );
        } else return;
        io.emit("player_info", {
            player_info,
        });
        socket.disconnect(true);
    });
});

server.listen(socket_port, "0.0.0.0", () => {
    console.log("server is running!!");
});
