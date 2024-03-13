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
