var filename = "\{{ title }}.html";
/* ### START REQUEST SECTION ### */
var request = \{{{ request }}};
/* ### END REQUEST SECTION ### */
/* ### START DATA SECTION ### */
var fieldValues = {};
/* ### END DATA SECTION ### */
var formats = \{{{ formats }}};
var dependencies = \{{{ dependencies }}};

function getFieldFormat(name) {
  if (formats.hasOwnProperty(name)) {
    return formats[name];
  }
  return 'int';
}

function modifier(num) {
  num = ""+num;
  if (num == "") {
    num = "0";
  }
  if (num.charAt(0) == "-") {
    return num;
  }
  return "+"+num;
}

function coerceFieldValue(name, value, incalc) {
  if (value === '') {
    return '';
  }
  var format = getFieldFormat(name);
  switch (format) {
    case 'checkbox':
    case 'radio':
      return !!value;

    case 'int':
      return parseInt(value);
    case 'decimal':
      var tailDecimal = (typeof value === 'string' || value instanceof String) && !!value.match(/\.$/);
      value = parseFloat(value).toFixed(2);
      if (!incalc) {
        if (value.match(/\./)) {
          value = (""+value).replace(/0*$/, '').replace(/\.$/, '');
        }
        if (tailDecimal) {
          value = value+".";
        }
      }
      return value;
    case 'modifier':
      value = parseInt(value);
      if (incalc) {
        return value;
      } else {
        return modifier(value);
      }
    case 'string':
      return ""+value;
    default:
      return value;
  }
}

function getFieldValue(name, incalc = false) {
  for (var input of document.getElementsByName(name)) {
    try {
      switch(input.type) {
        case 'checkbox':
          return (input.checked) ? 1 : 0;
          
        case 'radio':
          if (input.checked) {
            return input.value;
          } else {
            continue;
          }

        default:
          var value = input.value;
          if (value === null || value === "") {
            continue;
          }
    
          return coerceFieldValue(name, value, incalc);
      }
    } catch (x) {
    }
  }
  return null;
}

function setFieldValue(name, value) {
  value = coerceFieldValue(name, value, false);
  for (var input of document.getElementsByName(name)) {
    input.value = value;
    input.dispatchEvent(new Event('change'));
  }
}

function fixValue(value) {
  if (typeof value === 'string' || value instanceof String) {
    value = value.trim();
    if (value == "NaN") {
      return 0;
    }
    if (value.match(/^\+?[0-9]+$/)) {
      value = parseInt(value);
    }
  } else {
    if (isNaN(value)) {
      return 0;
    }
  }
  return value;
}

var knownValues = {};
function clearValueCache() {
  knownValues = {};
}
function valueOf(fname) {
  if (!knownValues.hasOwnProperty(fname)) {
    knownValues[fname] = getFieldValue(fname, true);
  }
  return fixValue(knownValues[fname]);
};


// FIELD INTERACTION MENUS

var menus = {
  currentFieldId: null,
  currentField: null,
  currentValue: null,
};

function showMenu(event, menuid, field) {
  dismissMenus();

  menus.currentFieldId = field.id;
  menus.currentField = field;
  var rect = field.getBoundingClientRect();
  
  var menu = document.getElementById(menuid+'-menu');
  menu.style.top = (rect.bottom + 15)+"px";
  menu.style.left = ((rect.left + rect.right) / 2 - 50)+"px";
  menu.style.display = "block";

  event.stopPropagation();
}

function dismissMenus(event) {
  for (var menu of document.getElementsByClassName("control-menu")) {
    menu.style.display = "none";
  }
  
  menus.currentFieldId = null;
  menus.currentValue = null;
}

for (var menu of document.getElementsByClassName("control-menu")) {
  menu.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

document.addEventListener('click', dismissMenus);
document.addEventListener('scroll', dismissMenus);





// SET THE TITLE
function updatePageTitle() {
  var characterName = '';
  for (var input of document.getElementsByName('character-name')) {
    if (input.value !== "") {
      characterName = input.value;
    }
  }
  var level = '';
  for (var input of document.getElementsByName('level')) {
    if (input.value !== "") {
      level = parseInt(input.value);
    }
  }

  var title = "\{{ summary }}";
  if (characterName !== "") {
    title = characterName+", "+title;
  }
  if (level !== "") {
    title = title+", Level "+level;
  }

  document.title = title;
  filename = title+".html";
}

for (var input of document.getElementsByName('character-name')) {
  input.addEventListener('change', updatePageTitle);
}
for (var input of document.getElementsByName('level')) {
  input.addEventListener('change', updatePageTitle);
}

updatePageTitle();
