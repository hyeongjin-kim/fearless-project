import { createServer } from 'http';
import { Server } from 'socket.io';

const MAX_CONNECTIONS = 10;

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
  maxConnections: MAX_CONNECTIONS,
});

let is_started = false;
const player_info = {
    blue_player_1: { socket_id: null, nickname: null },
    blue_player_2: { socket_id: null, nickname: null },
    blue_player_3: { socket_id: null, nickname: null },
    blue_player_4: { socket_id: null, nickname: null },
    blue_player_5: { socket_id: null, nickname: null },
    red_player_1: { socket_id: null, nickname: null },
    red_player_2: { socket_id: null, nickname: null },
    red_player_3: { socket_id: null, nickname: null },
    red_player_4: { socket_id: null, nickname: null },
    red_player_5: { socket_id: null, nickname: null },
};

const getNextPlayer = function() {
  for (const key in player_info) {
    if (player_info[key].socket_id === null) {
      return key;
    }
  }
  return null;
}

const findPlayer = function(socket_id) {
  for (const key in player_info) {
    if (player_info[key].socket_id === socket_id) {
      return key;
    }
  }
  return null;
}


io.on('connection', (socket) => {
  console.log(`a user connected with id ${socket.id}`);

  // 10명 넘게 연결 들어오면 끊어버리기
  const count_connections = Object.keys(io.sockets.sockets).length;
  if (count_connections > 10) {
    socket.disconnect(true);
    console.log(`user disconnected due to connection count limits ${MAX_CONNECTIONS}`);
  }
  
  const player = getNextPlayer();
  player.socket_id = socket.id;
  socket.on('nickname', (nickname) => {
    player.nickname = nickname;
  })

  console.log(`player status: ${player_info}`)

  socket.on('is_started', (msg) => {
    console.log(`received message: ${msg}`);
    is_started = msg;
    console.log(`server side is_started: ${is_started}`);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
