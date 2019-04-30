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
  var p;
  for (var i = 0; i < map.length; i++) {
    p = x[map[i].x].cells[map[i].y];
    p.style.backgroundImage = 'url("static/asset/floor.png")';
    for (var j = 0; j < map[i].player.length; j++) {
      if (map[i].player[j] != null ) {
        if (map[i].player[j].id == 1){
          p.style.backgroundImage = 'url("static/asset/p1.png")';
        }else{
          p.style.backgroundImage = 'url("static/asset/p1.png")';
        }
        
      }
    }
  }
}

socket.on("state",  function(state) {
  console.log(state);

   updatemap(state);
});
