var id = 0;
var table;
var form;
document.addEventListener("DOMContentLoaded", function () {
  form = document.getElementById("form-get-url-generator");
  table = document.getElementById("table-form");
  addLine(null, table);
});

function removeLine(event) {
  event.preventDefault();
  event.stopPropagation();
  var item = event.currentTarget;
  var target_id = item.getAttribute("data-target-id");
  var target = document.querySelector(
    '.parameter-row[data-id="' + target_id + '"]'
  );
  target.remove();
}
/**
<tr id="specimen" class="parameter-row">
  <td><input name="parameterName[]" type="text" placeholder="Nom paramètre"></td>
  <td><input name="parameterValue[]" type="text" placeholder="Valeur paramètre"></td>
  <td>
    <button type="submit" class="removeLine" onclick="removeLine(event)">X</button>
  </td>
</tr>
 */
function addLine(event, clickedItem, valueParameterName, valueParameterValue) {
  id++; // on incrémente l'id pour cibler la ligne lors de la suppression
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  var parameterRow = document.createElement("tr");
  parameterRow.setAttribute("data-id", id);
  parameterRow.classList.add("parameter-row");

  var tdName = document.createElement("td");

  var inputParameterName = document.createElement("input");
  inputParameterName.type = "text";
  inputParameterName.placeholder = "Nom paramètre";
  inputParameterName.name = "parameterName[]";
  if (valueParameterName) inputParameterName.value = valueParameterName;

  tdName.appendChild(inputParameterName);

  var tdValue = document.createElement("td");

  var inputParameterValue = document.createElement("input");
  inputParameterValue.type = "text";
  inputParameterValue.placeholder = "Valeur paramètre";
  inputParameterValue.name = "parameterValue[]";
  if (valueParameterValue) inputParameterValue.value = valueParameterValue;

  tdValue.appendChild(inputParameterValue);

  var tdButton = document.createElement("td");

  var buttonRemoveLine = document.createElement("button");
  buttonRemoveLine.textContent = "X";
  buttonRemoveLine.type = "submit";
  buttonRemoveLine.classList.add("removeLine");
  buttonRemoveLine.setAttribute("data-target-id", id);
  buttonRemoveLine.onclick = function (e) {
    removeLine(e);
    e.preventDefault();
    e.stopPropagation();
  };

  tdButton.appendChild(buttonRemoveLine);

  parameterRow.appendChild(tdName);
  parameterRow.appendChild(tdValue);
  parameterRow.appendChild(tdButton);

  table.appendChild(parameterRow);
}

/*
var timeout;
document.body.onchange(function (e) {
  if (e.target.type == "input") {
    timeout = setTimeout(function () {
      //saveMyData();
    }, 500);
  }
});
*/

function loadMyData(e) {
  e.preventDefault();
  e.stopPropagation();
  resetForm();
  var myData = JSON.parse(localStorage.getItem("history"));
  for (var i = 0; i < myData.length; i++) {
    var one_row = myData[i];
    var parameterName = one_row["parameterName"];
    var parameterValue = one_row["parameterValue"];
    if (parameterName == "baseUrl") {
      document.querySelector("input[name=baseUrl]").value = parameterValue;
      continue;
    }
    addLine(null, null, parameterName, parameterValue);
  }
}

function resetForm() {
  var buttons = document.getElementsByClassName("removeLine");
  for (var i = buttons.length - 1; i >= 0; i--) {
    var one_button = buttons[i];
    var the_event = new Event("click");
    one_button.dispatchEvent(the_event);
  }
}

function saveMyData(e) {
  e.preventDefault();
  e.stopPropagation();
  if (!confirm("Ecraser sauvegarde ?")) {
    return false;
  }
  var formData = new FormData(form);
  var parameterNames = formData.getAll("parameterName[]");
  var parameterValues = formData.getAll("parameterValue[]");
  var output_array = [];
  output_array.push({
    parameterName: "baseUrl",
    parameterValue: formData.get("baseUrl"),
  });
  for (var i = 0; i < parameterNames.length; i++) {
    var oneParameterName = parameterNames[i];
    var oneParameterValue = parameterValues[i];
    output_array.push({
      parameterName: oneParameterName,
      parameterValue: oneParameterValue,
    });
  }
  var output_json = JSON.stringify(output_array);
  localStorage.setItem("history", output_json);
}

function generate(event) {
  event.preventDefault();
  event.stopPropagation();
  var formData = new FormData(form);
  var baseUrl = formData.get("baseUrl");
  var parameterNames = formData.getAll("parameterName[]");
  var parameterValues = formData.getAll("parameterValue[]");
  var output_array = [];
  for (var i = 0; i < parameterNames.length; i++) {
    var oneParameterName = parameterNames[i];
    var oneParameterValue = parameterValues[i];
    output_array.push(
      "" + oneParameterName + "=" + encodeURIComponent(oneParameterValue)
    );
  }
  var output_string = output_array.join("&");
  var output_url = baseUrl + "?" + output_string;
  document.getElementById("outputUrl").value = output_url;
  // for (const [key, value] of formData) {
  //   console.log(`${key}: ${value}\n`);
  // }
}

function open() {
  var url = document.getElementById("outputUrl").value;
  var anchor = document.createElement("a");
  anchor.target = "_blank";
  anchor.href = url;
  anchor.click();
}

function generateAndOpen(event) {
  event.preventDefault();
  event.stopPropagation();
  generate(event);
  open();
}

function select(domElement) {
  domElement.select();
}