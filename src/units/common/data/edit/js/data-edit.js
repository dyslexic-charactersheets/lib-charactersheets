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

    case 'int':
      return parseInt(value);
    case 'decimal':
      var tailDecimal = !!value.match(/\.$/);
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
  if (isNaN(value)) {
    return 0;
  }
  if (typeof value === 'string' || value instanceof String) {
    value = value.trim();
    if (value == "NaN") {
      return 0;
    }
    if (value.match(/^\+?[0-9]+$/)) {
      value = parseInt(value);
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


// FIELD INTERACTIONS

var menus = {
  currentFieldId: null,
  currentField: null,
  currentValue: null,
};

// field interactions: ACTIONS

function showActionMenu(event) {
  var field = event.target.closest('.field');
  showMenu(event, 'action', field);

  var value = 'template';
  for (var input of field.getElementsByTagName('input')) {
    value = input.value;
    // switch (input.value) {
    //   case 'action':
    //     value = '1';
    //     break;
    //   case 'action2':
    //     value = '2';
    //     break;
    //   case 'action3':
    //     value = '3';
    //     break;
    //   case 'reaction':
    //     value = 'reaction';
    //     break;
    //   case ''
    // }
  }

  document.getElementById('action-menu-1').checked = false;
  document.getElementById('action-menu-2').checked = false;
  document.getElementById('action-menu-3').checked = false;
  document.getElementById('action-menu-reaction').checked = false;
  document.getElementById('action-menu-free').checked = false;
  document.getElementById('action-menu-template').checked = false;
  
  document.getElementById('action-menu-'+value).checked = true;
}

function setActionValue(fieldId, value) {
  for (var field of document.getElementsByName(fieldId)) {

    for (var input of field.getElementsByTagName("input")) {
      input.value = value;
    }
    for (var icon of field.getElementsByClassName('icon')) {
      icon.classList.remove('icon_action');
      icon.classList.remove('icon_action2');
      icon.classList.remove('icon_action3');
      icon.classList.remove('icon_reaction');
      icon.classList.remove('icon_free-action');
      icon.classList.remove('icon_action-template');

      switch (value) {
        case 1: case "1": value = "action"; break;
        case 2: case "2": value = "action2"; break;
        case 3: case "3": value = "action3"; break;
        case "reaction": value = "reaction"; break;
        case "free": value = "free-action"; break;
        case "template": value = "action-template"; break;
      }
      icon.classList.add('icon_'+value);
    }
  }
}

for (var action of ['1', '2', '3', 'reaction', 'free', 'template']) {
  (function (action) {
    document.getElementById('action-menu-'+action).addEventListener('change', function (event) {
      if (menus.currentFieldId !== null) {
        if (menus.currentValue === null || menus.currentValue !== teml) {
          setActionValue(menus.currentFieldId, action);
          dismissMenus();
        }
      }
    });
  })(action);
}

document.getElementById("action-menu").addEventListener('click', function (event) {
  event.stopPropagation();
});

for (var field of document.getElementsByClassName("field--control_action-icon")) {
  for (var icon of field.getElementsByClassName("icon")) {
    icon.addEventListener('click', showActionMenu);
  }
}


// field interactions: PROFICIENCY
function showProficiencyMenu(event) {
  var field = event.target.closest('.field');
  showMenu(event, 'proficiency', field);

  var teml = getProficiencyValue(field.id);
  menus.currentValue = teml;

  document.getElementById('proficiency-menu-untrained').checked = false;
  document.getElementById('proficiency-menu-trained').checked = false;
  document.getElementById('proficiency-menu-expert').checked = false;
  document.getElementById('proficiency-menu-master').checked = false;
  document.getElementById('proficiency-menu-legendary').checked = false;

  var hint = document.getElementById('proficiency-menu__level-hint');
  hint.classList.add('row--fade');
  if (teml !== null && teml !== "" && ['untrained', 'trained', 'expert', 'master', 'legendary'].includes(teml)) {
    var radio = document.getElementById('proficiency-menu-'+teml);
    if (radio !== null) {
      radio.checked = true;
    }

    var bonuses = {
      'untrained': 0,
      'trained': 2,
      'expert': 4,
      'master': 6,
      'legendary': 8
    };
    document.getElementById('proficiency-menu__plus').innerText = bonuses[teml];
    if (teml != 'untrained') {
      hint.classList.remove('row--fade');
    }
  }
  
  // level hint
  var level = '';
  for (var levelInput of document.getElementsByName('level')) {
    level = levelInput.value;
  }
  var output = document.getElementById('proficiency-menu__ref-level');
  output.innerHTML = level;
}

function getProficiencyValue(fieldId) {
  var field = document.getElementById(fieldId);
  for (var rankControl of field.getElementsByClassName('field--control_proficiency__rank')) {
    return rankControl.value;
  }
  return 'untrained';
}

function setProficiencyValue(fieldId, value) {
  for (var field of document.getElementsByName(fieldId)) {
    // update icon
    var icon = field.getElementsByClassName('field--control_proficiency__icon')[0];
    icon.classList.remove('icon_proficiency-untrained');
    icon.classList.remove('icon_proficiency-trained');
    icon.classList.remove('icon_proficiency-expert');
    icon.classList.remove('icon_proficiency-master');
    icon.classList.remove('icon_proficiency-legendary');
    icon.classList.add('icon_proficiency-'+value);

    for (var rankControl of field.getElementsByClassName('field--control_proficiency__rank')) {
      rankControl.value = value;
      redoProficiency();
    }

    for (var bonusControl of field.getElementsByClassName('field--control_proficiency__bonus')) {
      bonusControl.dispatchEvent(new Event('change'));
    }
  }
}

for (var teml of ['untrained', 'trained', 'expert', 'master', 'legendary']) {
  (function (teml) {
    document.getElementById('proficiency-menu-'+teml).addEventListener('change', function (event) {
      if (menus.currentFieldId !== null) {
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
  for (var icon of field.getElementsByClassName("field__frame")) {
    icon.addEventListener('click', showProficiencyMenu);
  }
  // for (var icon of field.getElementsByClassName("field__control--control_icon")) {
  //   icon.addEventListener('click', showProficiencyMenu);
  // }
}


// field interactions: COUNTERS (ie runes)

function showCounterMenu(event, field) {
  showMenu(event, 'counter', field);

  var value = getCounterValue(field.id);
  menus.currentValue = value;

  document.getElementById('counter-menu-0').checked = false;
  document.getElementById('counter-menu-1').checked = false;
  document.getElementById('counter-menu-2').checked = false;
  document.getElementById('counter-menu-3').checked = false;
  
  if (value !== null && value !== "" && ['0', '1', '2', '3'].includes(value)) {
    var radio = document.getElementById('counter-menu-'+value);
    if (radio !== null) {
      radio.checked = true;
    }
  }
}

function getCounterValue(fieldId) {
  var field = document.getElementById(fieldId);
  for (var numberControl of field.getElementsByTagName('input')) {
    return ""+numberControl.value;
  }
  return "";
}

function setCounterValue(fieldId, value) {
  for (var field of document.getElementsByName(fieldId)) {
    // update display
    for (var icon of field.getElementsByClassName('field--control_counter__icon')) {
      icon.classList.remove('icon_counter-0');
      icon.classList.remove('icon_counter-1');
      icon.classList.remove('icon_counter-2');
      icon.classList.remove('icon_counter-3');
      icon.classList.add('icon_counter-'+value);
    }

    for (var numberControl of field.getElementsByClassName('field--control_counter__number')) {
      numberControl.value = value;
      numberControl.dispatchEvent(new Event('change'));
    }
  }
}

for (var number of [0, 1, 2, 3]) {
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
  (function (field) {
    field.addEventListener('click', function (event) {
      showCounterMenu(event, field);
    });
  })(field);
}


// field interactions: ALIGNMENT

function showAlignmentMenu(event) {
  var field = event.target.closest('.field');
  showMenu(event, 'alignment', field);

  var value = getAlignmentValue(field.id);
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
  for (var field of document.getElementsByName(fieldId)) {
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

for (var alignment of ['none', 'lg', 'ln', 'le', 'ng', 'nn', 'ne', 'cg', 'cn', 'ce']) {
  (function (alignment) {
    document.getElementById('alignment-menu-'+alignment).addEventListener('change', function (event) {
      if (menus.currentFieldId !== null) {
        if (alignment == "non") {
          alignment = "";
        }
        setAlignmentValue(menus.currentFieldId, alignment);
        dismissMenus();
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


// Ref Switch

function showRefSwitchMenu(event) {
  var field = event.target.closest('.field');
  showMenu(event, 'ref-switch', field);

  var value = getRefSwitchValue(field.id);
  menus.currentValue = value;

  for (var ref of ['STR', 'DEX']) {
    (function (ref) {
      var elem = document.getElementById('ref-switch-'+ref);
      elem.checked = false;
      elem.removeAttribute('checked');
      // elem.style.display = 'none';
    })(ref);
  }
  if (value !== null && value !== "") {
    var elem = document.getElementById('ref-switch-'+value);
    elem.checked = true;
    elem.setAttribute('checked', true);
  }
}

function getRefSwitchValue(fieldId) {
  var field = document.getElementById(fieldId);
  for (var input of field.getElementsByTagName('input')) {
    return input.value;
  }
}

function setRefSwitchValue(fieldId, ref) {
  var value = getFieldValue(ref);

  // pick field label
  var labelText;
  switch (ref) {
    case 'STR': labelText = "_{STR}"; break;
    case 'DEX': labelText = "_{DEX}"; break;
    case 'CON': labelText = "_{CON}"; break;
    case 'INT': labelText = "_{INT}"; break;
    case 'WIS': labelText = "_{WIS}"; break;
    case 'CHA': labelText = "_{CHA}"; break;
  }

  for (var field of document.getElementsByName(fieldId)) {
    for (var hiddenInput of field.getElementsByClassName('field--control_ref-switch__ref')) {
      hiddenInput.value = ref;
    }

    for (var control of field.getElementsByClassName('field__control')) {
      for (var input of control.getElementsByTagName('input')) {
        input.setAttribute('ref', ref);
        input.value = value;
        input.dispatchEvent(new Event('change'));
      }
    }

    for (var label of field.getElementsByTagName('label')) {
      label.innerText = labelText;
    }
  }
}

for (var ref of ['STR', 'DEX']) {
  (function (ref) {
    document.getElementById('ref-switch-'+ref).addEventListener('change', function (event) {
      if (menus.currentFieldId !== null) {
        setRefSwitchValue(menus.currentFieldId, ref);
        dismissMenus();
      }
    });
    document.getElementById('field-ref-switch-'+ref).addEventListener('click', function (event) {
      var input = document.getElementById('ref-switch-'+ref);
      input.setAttribute('checked', true);
      input.dispatchEvent(new Event('change'));
    });
  })(ref);
}

for (var field of document.getElementsByClassName("field--control_ref-switch")) {
  for (var box of field.getElementsByClassName("field__frame")) {
    box.addEventListener('click', showRefSwitchMenu);
  }
}


// Enum

function showEnumMenu(event) {
  var field = event.target.closest('.field');
  showMenu(event, 'enum', field);

  var value = getEnumValue(field.id);
  menus.currentValue = value;
  
  // click actions
  for (var optionHolder of field.getElementsByClassName('field--control_enum__options')) {
    var optionHtml = optionHolder.innerHTML;
    var enumMenuHolder = document.getElementById('enum-menu__holder');
    enumMenuHolder.innerHTML = optionHtml;
    for (var input of enumMenuHolder.getElementsByTagName("input")) {
      ((input) => {
        // set value
        var checked = input.getAttribute('data-value') == value;
        input.checked = checked;
        // event handler
        var itemSlug = input.getAttribute('value');
        var itemValue = input.getAttribute('data-value');
        input.addEventListener("change", function () {
          setEnumValue(field, itemSlug, itemValue);
          dismissMenus();
        });
        input.closest('label').addEventListener("click", function (event) {
          input.checked = true;
          input.dispatchEvent(new Event("change"));
          event.preventDefault();
        });
      })(input);
    }
  }
}

function getEnumValue(fieldId) {
  var field = document.getElementById(fieldId);
  for (var input of field.getElementsByTagName('input')) {
    return input.value;
  }
}

function setEnumValue(field, slug, value) {
  for (var input of field.getElementsByTagName('input')) {
    input.value = value;
    input.dispatchEvent(new Event("change"));
  }
}

// enum menu click actions
for (var field of document.getElementsByClassName("field--control_enum")) {
  for (var box of field.getElementsByClassName("field__frame")) {
    box.addEventListener('click', showEnumMenu);
  }
}


// field interactions: global

function showMenu(event, menu, field) {
  dismissMenus();

  menus.currentFieldId = field.id;
  menus.currentField = field;
  var rect = field.getBoundingClientRect();
  
  var menu = document.getElementById(menu+'-menu');
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


// Mutating dice icon

for (let icon of document.getElementsByClassName("icon_damage")) {
  let frame = icon.closest('.field__frame');
  if (frame === null || frame === undefined) {
    continue;
  }
  for (var dieControl of frame.getElementsByClassName('field__control--damage-die')) {
    for (var dieInput of dieControl.getElementsByTagName('input')) {
      ((icon, dieInput) => {
        dieInput.addEventListener('change', function (event) {
          var cls = "";
          switch (dieInput.value) {
            case 4:
            case "4":
              cls = "icon_d4";
              break;
            case 6:
            case "6":
              cls = "icon_d6";
              break;
            case 8:
            case "8":
              cls = "icon_d8";
              break;
            case 10:
            case "10":
              cls = "icon_d10";
              break;
            case 12:
            case "12":
              cls = "icon_d12";
              break;
            case 20:
            case "20":
              cls = "icon_d20";
              break;
            default:
              return;
          }
          icon.classList.remove("icon_d4");
          icon.classList.remove("icon_d6");
          icon.classList.remove("icon_d8");
          icon.classList.remove("icon_d10");
          icon.classList.remove("icon_d12");
          icon.classList.remove("icon_d20");
          icon.classList.add(cls);
        });
      })(icon, dieInput);
    }
  }
}


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
