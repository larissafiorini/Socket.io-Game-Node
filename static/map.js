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

createTable(7, 5);
