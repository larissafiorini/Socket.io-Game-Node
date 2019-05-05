var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var id = 0;
//var jogadorAtual = 0;
var jogoAcabou = false;
var ganhador;

app.set("port", 5000);
app.use("/static", express.static(__dirname + "/static"));

// Routing
app.get("/", function(request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

// Starts the server.
server.listen(5000, function() {
  console.log("Starting server on port 5000");
});

var state = {
  map: [
    { x: 0, y: 0, player: [] },
    { x: 0, y: 1, effect: [0, 1], player: [] },
    { x: 0, y: 2, effect: [1, 3], player: [] },
    { x: 0, y: 3, effect: [1, 1], player: [] },
    { x: 0, y: 4, effect: [null, null], player: [] },
    { x: 0, y: 5, effect: [null, null], player: [] },
    { x: 1, y: 5, effect: [0, 2], player: [] },
    { x: 1, y: 6, effect: [1, 1], player: [] },
    { x: 1, y: 7, effect: [null, null], player: [] },
    { x: 0, y: 7, effect: [1, 4], player: [] },
    { x: 0, y: 8, effect: [0, 5], player: [] },
    { x: 0, y: 9, effect: [0, 3], player: [] },
    { x: 1, y: 9, effect: [1, 1], player: [] },
    { x: 2, y: 9, effect: [null, null], player: [] },
    { x: 2, y: 8, effect: [1, 3], player: [] },
    { x: 3, y: 8, effect: [0, 2], player: [] },
    { x: 4, y: 8, effect: [1, 4], player: [] },
    { x: 4, y: 7, effect: [null, null], player: [] },
    { x: 4, y: 6, effect: [0, 5], player: [] },
    { x: 4, y: 5, effect: [1, 1], player: [] },
    { x: 4, y: 4, effect: [null, null], player: [] },
    { x: 4, y: 3, effect: [null, null], player: [] },
    { x: 3, y: 3, effect: [0, 1], player: [] },
    { x: 2, y: 3, effect: [0, 2], player: [] },
    { x: 2, y: 2, effect: [1, 2], player: [] },
    { x: 2, y: 1, effect: [1, 1], player: [] },
    { x: 3, y: 1, effect: [null, null], player: [] },
    { x: 4, y: 1, effect: [1, 4], player: [] },
    { x: 5, y: 1, effect: [0, 2], player: [] },
    { x: 6, y: 1, effect: [1, 2], player: [] },
    { x: 6, y: 2, effect: [1, 1], player: [] },
    { x: 6, y: 3, effect: [null, null], player: [] },
    { x: 6, y: 4, effect: [0, 1], player: [] },
    { x: 6, y: 5, effect: [0, 2], player: [] },
    { x: 6, y: 6, effect: [1, 2], player: [] },
    { x: 6, y: 7, effect: [null, null], player: [] },
    { x: 6, y: 8, effect: [null, null], player: [] },
    { x: 6, y: 9, effect: [0, 2], player: [] },
    { x: 5, y: 9, player: [] }
  ],
  players: [],
  turn: 0,
  log: null
};

io.on("connection", function(socket) {
  socket.on("new player", function(data) {
    if (state.players.length <= 1) {
      var newPlayer = {
        position: 0,
        x: 0,
        y: 0,
        name: data,
        id: socket.id
      };
      if (!state.turn) {
        state.turn = newPlayer.id;
      }
      state.players[id] = newPlayer;
      state.map[0].player.push(newPlayer);
      io.sockets.emit("state", state);
      id++;
    } else {
      io.sockets.emit("state", state);
    }
  });

  socket.on("movement", function(diceNumber) {
    var player = {};
    state.players.map(p => {
      if (p.id == socket.id) {
        player = p;
      }
    });

    if (player.id == state.turn) {
      if (state.players.indexOf(player) == 0) {
        state.turn = state.players[1].id;
      } else {
        state.turn = state.players[0].id;
      }

      var lastPosition = player.position;
      var position = player.position + diceNumber;
      if (position >= state.map.length - 1) {
        player.position = state.map.length - 1;
        player.x = state.map[player.position].x;
        player.y = state.map[player.position].y;
        updateMap(player.position, lastPosition, player);
        io.sockets.emit("state", state);
      } else {
        player.position = position;
        player.x = state.map[player.position].x;
        player.y = state.map[player.position].y;

        try {
          updateMap(player.position, lastPosition, player);
          io.sockets.emit("state", state);
        } catch (e) {
          print(e);
        } finally {
          setTimeout(function() {
            var effectStrin = "";
            if (player.x != 3 && player.y != 0) {
              if (state.map[player.position].effect[0] != null) {
                lastPosition = player.position;
                if (state.map[player.position].effect[0] == 0) {
                  effectStrin =
                    "[EFEITO] Player " +
                    player.name +
                    " volte " +
                    state.map[player.position].effect[1] +
                    " casas.";
                  player.position -= state.map[player.position].effect[1];
                } else {
                  effectStrin =
                    "[EFEITO] Player " +
                    player.name +
                    " ande mais " +
                    state.map[player.position].effect[1] +
                    " casas.";
                  player.position += state.map[player.position].effect[1];
                }
                player.x = state.map[player.position].x;
                player.y = state.map[player.position].y;
                state.log = effectStrin;
                updateMap(player.position, lastPosition, player);
                io.sockets.emit("state", state);
                state.log = "";
              }
            }
          }, 3000);
        }
      }

      if (player.position == state.map.length - 1) {
        jogoAcabou = true;
        effectStrin = "[JOGO] Player " + player.name + " GANHOU! ";
        state.log = effectStrin;
        ganhador = player.id;
        io.sockets.emit("state", state);
      }
    }
  });
});

// function getJogadorAtual() {
//   return jogadorAtual;
// }

function getGanhador() {
  return ganhador;
}

function getStatusGame() {
  return jogoAcabou;
}

function updateMap(newposition, lastPosition, player) {
  for (var i = 0; i < state.map[lastPosition].player.length; i++) {
    if (
      state.map[lastPosition].player[i] != null &&
      state.map[lastPosition].player[i].id == player.id
    ) {
      state.map[lastPosition].player.splice(i, 1);
    }
  }
  state.map[newposition].player.push(player);
}
