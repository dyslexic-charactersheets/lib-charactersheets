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
