var filename = "\{{ title }}.html";
/* ### START DATA SECTION ### */
var fieldValues = {};
/* ### END DATA SECTION ### */
var fieldIds = [];
var fieldParts = {};
var formats = \{{{ formats }}};
var calculations = \{{{ calculations }}};
var dependencies = \{{{ dependencies }}};

// find all the fields and their values
function initValues() {
  // find all the fields
  for (var field of document.getElementsByClassName("field")) {
    if (field.id === null || field.id === "") {
      console.log("[data]          Field does not have an ID");
      continue;
    }
    var fieldId = field.id.replace(/^field-/, '');
    // if (fieldIds.includes(fieldId)) {
    //   console.log("[data]          Duplicate field: "+fieldId);
    // }
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

function coerceFieldValue(name, value) {
  var format = 'int';
  if (formats.hasOwnProperty(name)) {
    format = formats[name];
  }

  switch (format) {
    case 'int':
      return parseInt(value);
    case 'string':
      return ""+value;
    default:
      return value;
  }
}

function getFieldValue(name) {
  for (var input of document.getElementsByName(name)) {
    var value = input.value;
    if (value === null || value === "") {
      continue;
    }
    try {
      return coerceFieldValue(name, value);
    } catch (x) {
    }
  }
  return null;
}

function setFieldValue(name, value) {
  value = coerceFieldValue(name, value);
  for (var input of document.getElementsByName(name)) {
    input.value = value;
    input.dispatchEvent(new Event('change'));
  }
}

var knownValues = {};
function clearValueCache() {
  knownValues = {};
}
function valueOf(fname) {
  if (!knownValues.hasOwnProperty(fname)) {
    knownValues[fname] = getFieldValue(fname);
  }
  return knownValues[fname];
};


// Calculation utility functions
function floor(num) {
  return Math.floor(num);
}

function ceil(num) {
  return Math.ceil(num);
}

function defaultValue(num, def) {
  if (num === unset || num === null || num === "") {
    return def;
  }
  return num;
}

function minmax(num, min, max) {
  if (num < min || num > max) {
    throw "Out of bounds";
  }
  return num;
}

function recalculateField(name) {
  if (calculations.hasOwnProperty(name)) {
    try {
      var newValue = calculations[name](valueOf);
      if (isNaN(newValue)) {
        return;
      }
      knownValues[name] = newValue;
      setFieldValue(name, newValue);
    } catch (x) {
    }
  }
}


function initCalculations() {
  for (var name in dependencies) {
    (function (name) {
      function recalcDerivedFields() {
        clearValueCache();
        for (var dep of dependencies[name]) {
          recalculateField(dep);
        }
      }

      for (var input of document.getElementsByName(name)) {
        input.addEventListener('input', recalcDerivedFields);
        input.addEventListener('change', recalcDerivedFields);
      }
    })(name);
  }

  for (var proficiency of ['trained', 'expert', 'master', 'legendary']) {
    for (var input of document.getElementsByName('proficiency-'+proficiency)) {
      input.addEventListener('change', redoProficiency);
    }
  }

  // link all references
  var references = {};
  for (var input of document.querySelectorAll("input[ref]")) {
    var ref = input.getAttribute('ref');
    references[ref] = true;
  }

  for (var name of Object.keys(references)) {
    (function (name) {
      var refInputs = document.querySelectorAll('input[ref="'+name+'"]');
      function recalcReferenceFields() {
        var value = getFieldValue(name);
        if (value !== null) {
          for (var input of refInputs) {
            input.value = value;
            input.dispatchEvent(new Event('change'));
          }
        }
      }

      for (var input of document.getElementsByName(name)) {
        input.addEventListener('input', recalcReferenceFields);
        input.addEventListener('change', recalcReferenceFields);
      }
    })(name);
  }
}

function redoProficiency() {
  var bonuses = {
    untrained: 0
  };
  for (var proficiency of ['trained', 'expert', 'master', 'legendary']) {
    for (var input of document.getElementsByName('proficiency-'+proficiency)) {
      var bonus = coerceFieldValue('proficiency-'+proficiency, input.value);
      if (bonus !== null && bonus !== "") {
        bonuses[proficiency] = bonus;
      }
    }
  }

  for (var field of document.getElementsByClassName('field--control_proficiency')) {
    var proficiency = 'untrained';
    for (var control of field.getElementsByClassName('field__control--control_icon')) {
      for (var input of control.getElementsByTagName('input')) {
        proficiency = input.value;
      }
    }
    for (var control of field.getElementsByClassName('field__control')) {
      if (!control.classList.contains('field__control--control_icon')) {
        for (var input of control.getElementsByTagName('input')) {
          input.value = bonuses[proficiency];
          input.dispatchEvent(new Event('change'));
        }
      }
    }
  }
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

// initValues();
initCalculations();
document.getElementById('button--save-data').onclick = saveDocument;




// field interactions: PROFICIENCY


var menus = {
  currentFieldId: null,
  currentValue: null,
};

function showProficiencyMenu(event) {
  dismissMenus();
  var field = event.target.closest('.field');
  showMenu(event, 'proficiency', field.id);
  updateProficiencyMenu(getProficiencyValue(field.id));
}

function getProficiencyValue(fieldId) {
  var field = document.getElementById(fieldId);
  for (var rankControl of field.getElementsByClassName('field--control_proficiency__rank')) {
    return rankControl.value;
  }
  return 'untrained';
}

function setProficiencyValue(fieldId, value) {
  var field = document.getElementById(fieldId);
  if (field !== null) {
    for (var rankControl of field.getElementsByClassName('field--control_proficiency__rank')) {
      rankControl.value = value;

      var icon = field.getElementsByClassName('field--control_proficiency__icon')[0];
      icon.classList.remove('icon_proficiency-untrained');
      icon.classList.remove('icon_proficiency-trained');
      icon.classList.remove('icon_proficiency-expert');
      icon.classList.remove('icon_proficiency-master');
      icon.classList.remove('icon_proficiency-legendary');
      icon.classList.add('icon_proficiency-'+value);
    }
  }
}

function updateProficiencyMenu(teml) {
  document.getElementById('proficiency-menu-untrained').checked = false;
  document.getElementById('proficiency-menu-trained').checked = false;
  document.getElementById('proficiency-menu-expert').checked = false;
  document.getElementById('proficiency-menu-master').checked = false;
  document.getElementById('proficiency-menu-legendary').checked = false;
  menus.currentValue = teml;
  if (teml !== null && teml !== "" && ['untrained', 'trained', 'expert', 'master', 'legendary'].includes(teml)) {
    var radio = document.getElementById('proficiency-menu-'+teml);
    if (radio !== null) {
      radio.checked = true;
    }
  }
}

for (var teml of ['untrained', 'trained', 'expert', 'master', 'legendary']) {
  (function (teml) {
    document.getElementById('proficiency-menu-'+teml).addEventListener('change', function (event) {
      if (menus.currentieldId !== null) {
        if (menus.currentValue === null || menus.currentValue !== teml) {
          setProficiencyValue(menus.currentFieldId, teml);
          dismissMenus();
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


// field interactions: COUNTERS (ie runes)

function showCounterMenu(event) {
  dismissMenus();
  var field = event.target.closest('.field');
  showMenu(event, 'counter', field.id);
  updateCounterMenu(getCounterValue(field.id));
}

function getCounterValue(fieldId) {
  var field = document.getElementById(fieldId);
  for (var numberControl of field.getElementsByTagName('input')) {
    return ""+numberControl.value;
  }
  return "";
}

function setCounterValue(fieldId, value) {
  var field = document.getElementById(fieldId);
  if (field !== null) {
    for (var numberControl of field.getElementsByClassName('field--control_counter__number')) {
      numberControl.value = value;

      // update display
      var icon = field.getElementsByClassName('field--control_counter__icon')[0];
      icon.classList.remove('icon_counter-0');
      icon.classList.remove('icon_counter-1');
      icon.classList.remove('icon_counter-2');
      icon.classList.remove('icon_counter-3');
      icon.classList.add('icon_counter-'+value);
      }
  }
}

function updateCounterMenu(value) {
  document.getElementById('counter-menu-0').checked = false;
  document.getElementById('counter-menu-1').checked = false;
  document.getElementById('counter-menu-2').checked = false;
  document.getElementById('counter-menu-3').checked = false;
  
  menus.currentValue = value;
  if (value !== null && value !== "" && ['0', '1', '2', '3'].includes(value)) {
    var radio = document.getElementById('counter-menu-'+value);
    if (radio !== null) {
      radio.checked = true;
    }
  }
}

// for (var input of document.getElementById('counter-menu').getElementsByTagName('input')) {
//   input.addEventListener('change', function (event) {
//     if (menus.currentFieldId !== null) {
//       if (menus.currentValue === null || menus.currentValue !== number) {
//         setCounterValue(menus.currentFieldId, number);
//         dismissMenus();
//       }
//     }
//   });
// }

for (var number of [1, 2, 3]) {
  (function (number) {
    document.getElementById('counter-menu-'+number).addEventListener('change', function (event) {
      if (menus.currentFieldId !== null) {
        if (menus.currentValue === null || menus.currentValue !== number) {
          setCounterValue(menus.currentFieldId, number);
          dismissMenus();
        }
      }
    });
  })(number);
}

document.getElementById("counter-menu").addEventListener('click', function (event) {
  event.stopPropagation();
});

for (var field of document.getElementsByClassName("field--control_counter")) {
  for (var icon of field.getElementsByClassName("field__control--control_counter")) {
    icon.addEventListener('click', showCounterMenu);
  }
}


// field interactions: ALIGNMENT

function showAlignmentMenu(event) {
  dismissMenus();
  var field = event.target.closest('.field');
  showMenu(event, 'alignment', field.id);
  updateAlignmentMenu(getAlignmentValue(field.id));
}

function getAlignmentValue(fieldId) {
  var field = document.getElementById(fieldId);
  var value = '';

  var radios = field.getElementsByTagName('input');
  for (var radio of radios) {
    if (radio.checked) {
      value = radio.value;
    }
  }
  return value;
}

function setAlignmentValue(fieldId, value) {
  var field = document.getElementById(fieldId);
  if (field !== null) {
    var radios = field.getElementsByTagName('input');
    for (var radio of radios) {
      radio.checked = (radio.value == value);
    }

    // update display
    var grid = field.getElementsByClassName('field__grid')[0];
    for (var alignment of ['lg', 'ln', 'le', 'ng', 'nn', 'ne', 'cg', 'cn', 'ce']) {
      grid.classList.remove('field__grid--alignment_'+alignment);
    }
    grid.classList.add('field__grid--alignment_'+value);
  }
}

function updateAlignmentMenu(value) {
  menus.currentValue = value;
  for (var alignment of ['none', 'lg', 'ln', 'le', 'ng', 'nn', 'ne', 'cg', 'cn', 'ce']) {
    document.getElementById('alignment-menu-'+alignment).checked = false;
  }
  if (value !== null) {
    if (value == "") {
      value = "none";
    }
    var radio = document.getElementById('alignment-menu-'+value);
    if (radio !== null) {
      radio.checked = true;
    }
  }
}

for (var alignment of ['none', 'lg', 'ln', 'le', 'ng', 'nn', 'ne', 'cg', 'cn', 'ce']) {
  (function (alignment) {
    document.getElementById('alignment-menu-'+alignment).addEventListener('change', function (event) {
      if (menus.currentFieldId !== null) {
        if (menus.currentValue === null || menus.currentValue !== alignment) {
          if (alignment == "non") {
            alignment = "";
          }
          setAlignmentValue(menus.currentFieldId, alignment);
          dismissMenus();
        }
      }
    });
  })(alignment);
}


document.getElementById("alignment-menu").addEventListener('click', function (event) {
  event.stopPropagation();
});

for (var field of document.getElementsByClassName("field--control_alignment")) {
  for (var grid of field.getElementsByClassName("field__frame")) {
    grid.addEventListener('click', showAlignmentMenu);
  }
}



// field interactions: ENUM

function showEnumMenu(event) {
  dismissMenus();
  var field = event.target.closest('.field');
  showMenu(event, 'enum', field.id);
  updateEnumMenu(field.id, getEnumValue(field.id));

  // showMenu();
}

function getEnumValue(fieldId) {
  var field = document.getElementById(fieldId);
  for (var input of field.getElementsByTagName('input')) {
    return input.value;
  }
}

function setEnumValue(fieldId, value) {
  var field = document.getElementById(fieldId);
  for (var input of field.getElementsByTagName('input')) {
    input.value = value;
  }
}

function updateEnumMenu(fieldId, value) {
  var field = document.getElementById(fieldId);
  for (var optionHolder of field.getElementsByClassName('field--control_enum__options')) {
    var optionHtml = optionHolder.innerHTML;
    document.getElementById('enum-menu__holder').innerHTML = optionHtml;
  }
}

// initMenu('enum', [], )

// for (var field of document.getElementsByClassName("field--control_enum")) {
//   for (var option of )
// }

for (var field of document.getElementsByClassName("field--control_enum")) {
  for (var box of field.getElementsByClassName("field__frame")) {
    box.addEventListener('click', showEnumMenu);
  }
}



// field interactions: global


function initMenu(menu, values, setValueCallback) {
  for (var radio of document.getElementById(menu+'-menu').getElementsByTagName('input')) {
    (function (radio) {
      radio.addEventListener('change', function (event) {

      });
    })(radio);
  }
}

function showMenu(event, menu, fieldId) {
  menus.currentFieldId = fieldId;

  var field = document.getElementById(fieldId);
  var rect = field.getBoundingClientRect();
  
  var menu = document.getElementById(menu+'-menu');
  menu.style.top = (rect.bottom + 15)+"px";
  menu.style.left = ((rect.left + rect.right) / 2 - 50)+"px";
  menu.style.display = "block";

  event.stopPropagation();
}

function dismissMenus(event) {
  var proficiencyMenu = document.getElementById("proficiency-menu");
  proficiencyMenu.style.display = "none";
  
  var counterMenu = document.getElementById("counter-menu");
  counterMenu.style.display = "none";

  var alignmentMenu = document.getElementById("alignment-menu");
  alignmentMenu.style.display = "none";

  var enumMenu = document.getElementById("enum-menu");
  enumMenu.style.display = "none";
  
  menus.currentFieldId = null;
  menus.currentValue = null;
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