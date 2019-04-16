function createTable(a, l) {
  var table = document.createElement("table");
  table.setAttribute("id", "map");
  var row = {};
  var cell = {};

  for (var i = 0; i < a; i++) {
    row = table.insertRow(-1);
    for (var j = 0; j < l; j++) {
      cell = row.insertCell();
    }
  }
  document.getElementById("mapTable").appendChild(table);
}

async function updateTable() {
  arrayPositions = [
    { x: 1, y: 1, effect: [0, 2] },
    { x: 1, y: 2, effect: [1, 2] },
    { x: 1, y: 3, effect: [1, 2] },
    { x: 1, y: 4, effect: [1, 2] }
  ];

  var x = document.getElementById("map").rows;

  for (var i = 0; i < arrayPositions.length; i++) {
    var position = x[arrayPositions[i].x].cells[arrayPositions[i].y];
    position.style.background = "#0f9923";
  }
}

createTable(7, 5);
updateTable();
