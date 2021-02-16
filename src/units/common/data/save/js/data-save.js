
function saveDocument() {
  // make the DOM contain all values
  for (var input of document.getElementsByTagName("input")) {
    switch (input.type) {
      case "checkbox":
      case "radio":
        if (input.checked) {
          input.setAttribute('checked', 'checked');
        } else {
          input.removeAttribute('checked');
        }
        break;

      default:
        input.setAttribute('value', input.value);
        break;
    }
  }

  // write current data
  // var data = "/" + "* ### START DATA SECTION ### *" + "/\nvar fieldValues = ";
  // data = data + JSON.stringify(fieldValues);
  // data = data + ";\n/" + "* ### END DATA SECTION ### *" + "/";
  
  // // replace the data section
  // var dataSectionRegex = new RegExp("\\\/" + "\\\* ### START DATA SECTION ### \\\*" + "\\\/[^]*\\\/" + "\\\* ### END DATA SECTION ### \\\*" + "\\\/");
  var source = "<!DOCTYPE html>\n<html lang='en'>\n" + document.documentElement.innerHTML + "</html>";
  // source = source.replace(dataSectionRegex, data);

  // generate the download
  var anchor = document.createElement("a");
  anchor.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(source));
  anchor.setAttribute('download', filename);
  
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}


/*
function pullValues() {
  for (var fieldId of fieldIds) {
    if (fieldParts.hasOwnProperty(fieldId)) {
      var parts = fieldParts[fieldId];
      for (var part of parts) {
        var input = document.getElementById(part.id);
        if (input === null) {
          console.log("[data]          Cannot find input for field part: "+fieldId);
          continue;
        }
        switch (part.type) {
          case "checkbox":
          case "radio":
            fieldValues[part.id] = input.checked;
            break;
          case "text":
            fieldValues[part.id] = input.value;
            break;
        }
      }
    }
  }
}

function pushValues() {
  for (var fieldId of fieldIds) {
    if (fieldParts.hasOwnProperty(fieldId)) {
      var parts = fieldParts[fieldId];
      for (var part of parts) {
        if (fieldValues.hasOwnProperty(part.id)) {
          var input = document.getElementById(part.id);
          switch (part.type) {
            case "checkbox":
            case "radio":
              input.checked = fieldValues[part.id];
              if (fieldValues[part.id]) {
                input.setAttribute('checked', 'checked');
              } else {
                input.removeAttribute('checked');
              }
              break;
            case "text":
              input.value = fieldValues[part.id];
              input.setAttribute('value', fieldValues[part.id]);
              break;
          }
        }
      }
    }
  }
}
*/


window.addEventListener('load', (event) => {
  document.getElementById('button--save-data').onclick = saveDocument;
});
