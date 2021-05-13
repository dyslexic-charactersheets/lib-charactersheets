var filename = "\{{ title }}.html";
/* ### START DATA SECTION ### */
var fieldValues = {};
/* ### END DATA SECTION ### */
var fieldIds = [];
var fieldParts = {};
var calculationFields = {};

// find all the fields and their values
function initValues() {
  // find all the fields
  for (var field of document.getElementsByClassName("field")) {
    if (field.id === null || field.id === "") {
      console.log("[data]          Field does not have an ID");
      continue;
    }
    var fieldId = field.id.replace(/^field-/, '');
    if (fieldIds.includes(fieldId)) {
      console.log("[data]          Duplicate field: "+fieldId);
    }
    fieldIds.push(fieldId);

    // get the field parts
    var parts = [];
    for (var input of field.getElementsByTagName("input")) {
      if (input.id === null) {
        console.log("[data]          Field does not have an ID (in field '"+fieldId+"')");
        continue;
      }
      var inputType = "text";
      switch (input.type) {
        case "checkbox":
        case "radio":
          inputType = input.type;
      }
      parts.push({id: input.id, type: inputType});
    }
    fieldParts[fieldId] = parts;
  }
  fieldIds = [...new Set(fieldIds)];
}

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

function saveDocument() {
  // make the DOM contain all values
  pullValues();
  pushValues();

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

initValues();
document.getElementById('button--save-data').onclick = saveDocument;




// field interactions: PROFICIENCY

var currentProficiencyFieldId = null;
var currentProficiencyFieldValue = null;

function showProficiencyMenu(event) {
  var icon = event.target;
  var field = icon.closest('.field');
  currentProficiencyFieldId = field.id;
  var rankControl = field.getElementsByClassName('field--control_proficiency__rank')[0];

  var rect = icon.getBoundingClientRect();
  
  var menu = document.getElementById("proficiency-menu");
  menu.style.top = (rect.top + 36)+"px";
  menu.style.left = (rect.left - 30)+"px";
  menu.style.display = "block";

  document.getElementById('proficiency-menu-untrained').checked = false;
  document.getElementById('proficiency-menu-trained').checked = false;
  document.getElementById('proficiency-menu-expert').checked = false;
  document.getElementById('proficiency-menu-master').checked = false;
  document.getElementById('proficiency-menu-legendary').checked = false;
  var teml = rankControl.value;
  currentProficiencyFieldValue = teml;
  if (teml !== null && teml !== "" && ['untrained', 'trained', 'expert', 'master', 'legendary'].includes(teml)) {
    var radio = document.getElementById('proficiency-menu-'+teml);
    if (radio !== null) {
      radio.checked = true;
    }
  }
  event.stopPropagation();
}

for (var teml of ['untrained', 'trained', 'expert', 'master', 'legendary']) {
  (function (teml) {
    document.getElementById('proficiency-menu-'+teml).addEventListener('change', function (event) {
      if (currentProficiencyFieldId !== null) {
        if (currentProficiencyFieldValue === null || currentProficiencyFieldValue !== teml) {
          var field = document.getElementById(currentProficiencyFieldId);
          if (field !== null) {
            var rank = field.getElementsByClassName('field--control_proficiency__rank')[0];
            rank.value = teml;

            var icon = field.getElementsByClassName('field--control_proficiency__icon')[0];
            icon.classList.remove('icon_proficiency-untrained');
            icon.classList.remove('icon_proficiency-trained');
            icon.classList.remove('icon_proficiency-expert');
            icon.classList.remove('icon_proficiency-master');
            icon.classList.remove('icon_proficiency-legendary');
            icon.classList.add('icon_proficiency-'+teml);
          }

          var menu = document.getElementById("proficiency-menu");
          menu.style.display = "none";
          currentProficiencyFieldId = null;
        }
      }
    });
  })(teml);
}

document.getElementById("proficiency-menu").addEventListener('click', function (event) {
  event.stopPropagation();
});

for (var field of document.getElementsByClassName("field--control_proficiency")) {
  for (var icon of field.getElementsByClassName("field__control--control_icon")) {
    icon.addEventListener('click', showProficiencyMenu);
  }
}


// field interactions: runes

var currentRuneFieldId = null;
var currentRuneFieldValue = null;

function showRunesMenu(event) {
  var icon = event.target;
  var field = icon.closest('.field');
  currentProficiencyFieldId = field.id;
  var numberControl = field.getElementsByTagName('input')[0];

  var rect = icon.getBoundingClientRect();
  
  var menu = document.getElementById("proficiency-menu");
  menu.style.top = (rect.top + 36)+"px";
  menu.style.left = (rect.left - 30)+"px";
  menu.style.display = "block";
}

for (var number of [1, 2, 3]) {
  (function (number) {

  })(number);
}

//

document.getElementById("runes-menu").addEventListener('click', function (event) {
  event.stopPropagation();
});

for (var field of document.getElementsByClassName("field--control_runes")) {
  for (var icon of field.getElementsByClassName("field__control--control_icon")) {
    icon.addEventListener('click', showRunesMenu);
  }
}


// field interactions: global

function dismissMenus(event) {
  if (currentProficiencyFieldId !== null) {
    var menu = document.getElementById("proficiency-menu");
    menu.style.display = "none";
    currentProficiencyFieldId = null;
  }
}

document.addEventListener('click', dismissMenus);
document.addEventListener('scroll', dismissMenus);


// document.getElementById("proficiency-menu").find('');


// field interactions: roll dice

function rollDice(number, die, bonus) {
  console.log("Roll "+number+"d"+die+"+"+bonus);
}

for (var field of document.getElementsByClassName("field")) {
  for (var icon of field.getElementsByClassName("icon_bonus")) {
    icon.addEventListener('click', function (event) {
      if (icon.classList.includes("icon_bonus")) {
        var input = event.target.closest('.field').getElementsByTagName('input')[0];
        var bonus = input.value;
      
        if (bonus !== null && bonus !== "") {
          bonus = parseInt(bonus);
      
          if (!isNaN(bonus)) {
            rollDice(1, 20, bonus);
          }
        }
      } else if (icon.classList.includes("icon_damage")) {
        // ... damage dice ...
      }
    });
  }


}