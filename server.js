var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var app = express();
var server = http.Server(app);
var io = socketIO(server);
  
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
    {x: 0, y: 1, effect : [0,1] , player: []},
    {x: 0, y: 2, effect : [1,3] , player: []},
    {x: 0, y: 3, effect : [1,1], player: [] },
    {x: 0, y: 4, effect : [null,null], player: []},
    {x: 0, y: 5, effect : [null,null] ,player: []},
    {x: 1, y: 5, effect : [0,2],player: [] },
    {x: 1, y: 6, effect : [1,1], player: [] },
    {x: 1, y: 7, effect : [null,null] , player: []},
    {x: 0, y: 7, effect : [1,4] , player: []},
    {x: 0, y: 8, effect : [0,5],  player: []},
    {x: 0, y: 9, effect : [0,3], player: []},
    {x: 1, y: 9, effect : [1,1], player: [] },
    {x: 2, y: 9, effect : [null,null], player: [] },
    {x: 2, y: 8, effect : [1,3], player: [] },
    {x: 3, y: 8, effect : [0,2], player: [] },
    {x: 4, y: 8, effect : [1,4], player: [] },
    {x: 4, y: 7, effect : [null,null], player: [] },
    {x: 4, y: 6, effect : [0,5], player: [] },
    {x: 4, y: 5, effect : [1,1], player: [] }
    // { x: 0, y: 1, effect: [0, 2], player: [] },
    // { x: 0, y: 2, effect: [1, 2], player: [] },
    // { x: 0, y: 3, effect: [1, 2], player: [] },
    // { x: 0, y: 4, effect: [1, 2], player: [] },
    // { x: 1, y: 4, effect: [1, 2], player: [] },
    // { x: 1, y: 3, effect: [1, 2], player: [] },
    // { x: 2, y: 2, effect: [1, 2], player: [] },
    // { x: 2, y: 3, effect: [1, 2], player: [] },
    // { x: 2, y: 4, effect: [1, 2], player: [] },
    // { x: 3, y: 4, effect: [1, 2], player: [] },
    // { x: 3, y: 3, effect: [1, 2], player: [] },
    // { x: 3, y: 2, effect: [1, 2], player: [] },
    // { x: 3, y: 1, effect: [1, 2], player: [] },
    // { x: 3, y: 0, effect: [1, 2], player: [] }
  ],
  players: {}
};

io.on("connection", function(socket) {
  socket.on("new player", function(data) {
    var newPlayer = {
      position: 0,
      x: 0,
      y: 0,
      name: data,
      id: socket.id
      //colocar imagem do player
    };
    state.players[socket.id] = newPlayer;
    state.map[0].player.push(newPlayer);
    io.sockets.emit("state", state);
  });

  socket.on("movement", function(diceNumber) {
    var player = state.players[socket.id] || {};

    var lastPosition = player.position;
    player.position += diceNumber;
    player.x = state.map[player.position].x;
    player.y = state.map[player.position].y;

    updateMap(player.position, lastPosition, player);
    io.sockets.emit("state", state);
  });
});

function updateMap(newposition, lastPosition, player) {
  for (var i = 0; i < state.map[lastPosition].player.length; i++) {
    if (state.map[lastPosition].player[i].id == player.id) {
      state.map[lastPosition].player[i] = null;
    }
  }
  state.map[newposition].player.push(player);
}

function convertDiceNumberToPosition(dicenumber, player) {}
