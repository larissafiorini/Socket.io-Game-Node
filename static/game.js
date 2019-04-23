function movePlayer(diceNumber) {
  socket.emit("movement", diceNumber);
}

function updatemap(state) {
  var x = document.getElementById("map").rows;

  var map = state.map;
  var player = state.players;
  console.log(state.map)
  for (var i = 0; i < map.length; i++) {
    var position = x[map[i].x].cells[map[i].y];

    position.style.backgroundColor = "#ba7";
    // for (var j = 0; j < map[i].player.length; i++) {
    //   if (map[i].player[j] != null) {
    //     position.style.backgroundColor = "#4ef4";
    //     position.textContent = map[i].player[j].name;
    //   }
    // }
  }
}

socket.on("state", function(state) {
  //console.log(state);

  updatemap(state);
});
