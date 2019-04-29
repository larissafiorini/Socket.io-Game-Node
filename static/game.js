var dice = {
  sides: 6,
  roll: function () {
    var randomNumber = Math.floor(Math.random() * this.sides) + 1;
    return randomNumber;
  }
}

function printNumber(number) {
  var dice_elem = document.getElementById('dice_elem');
  dice_elem.innerHTML = number;
}

var button = document.getElementById('button');

function diceroll() {
  var result = dice.roll();
  return result;
};

function movePlayer(diceNumber) {
  var diceNumber=diceroll();
  printNumber(diceNumber);
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
