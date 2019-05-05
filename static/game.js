var dice = {
  sides: 6,
  roll: function() {
    var randomNumber = Math.floor(Math.random() * this.sides) + 1;
    return randomNumber;
  }
};

function printNumber(number) {
  var dice_elem = document.getElementById("dice_elem");
  dice_elem.innerHTML = number;
}

var button = document.getElementById("button");

function diceroll() {
  var result = dice.roll();
  return result;
}

function movePlayer(diceNumber) {
  var diceNumber = diceroll();
  printNumber(diceNumber);
  socket.emit("movement", diceNumber);
}

function updatemap(state) {
  var x = document.getElementById("map").rows;
  var playButton = document.getElementById("playButton");
  setLogMessage(state.log);
  var map = state.map;
  var p;

  //Controle do botao de jogar o dado
  if (state.turn == socket.id) {
    playButton.disabled = false;
    playButton.style.backgroundColor = "rgb(1, 186, 179)";
    playButton.innerHTML = "Jogar dado";
  } else {
    playButton.disabled = true;
    playButton.style.backgroundColor = "#597aaf";
    playButton.innerHTML = "Aguarde Seu Turno...";
  }

  for (var i = 0; i < map.length; i++) {
    p = x[map[i].x].cells[map[i].y];
    p.style.backgroundImage = 'url("static/asset/floor.png")';
    for (var j = 0; j < map[i].player.length; j++) {
      if (map[i].player[j] != null) {
        if (map[i].player.length <= 1) {
          if (map[i].player[j].id == 0) {
            p.style.backgroundImage = 'url("static/asset/p1.png")';
          } else {
            p.style.backgroundImage = 'url("static/asset/p2.png")';
          }
        } else {
          p.style.backgroundImage = 'url("static/asset/p2p1.png")';
        }
      }
    }
  }
}

function setLogMessage(message) {
  document.getElementById("log").innerHTML = message;
}

socket.on("state", function(state) {
  updatemap(state);
});
