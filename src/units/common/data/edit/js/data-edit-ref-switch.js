// Ref Switch

function getFieldLabel(name, useUnderlay = true) {
  for (var field of document.getElementsByName(`field-${name}`)) {
    if (useUnderlay) {
      for (var underlay of field.getElementsByTagName('u')) {
        let underlayText = underlay.innerHTML;
        if (underlayText !== null && underlayText !== "") {
          return underlayText;
        }
      }
    }

    for (var label of field.getElementsByTagName('label')) {
      let labelText = label.innerHTML;
      if (labelText !== null && labelText !== "") {
        return labelText;
      }
    }
  }
  return "";
}

function showRefSwitchMenu(event) {
  var field = event.target.closest('.field');
  var id = field.id;
  var fieldId = id.replace(/^field-/, '');
  showMenu(event, 'ref-switch-'+id, field);

  var value = getRefSwitchValue(field.id);
  menus.currentValue = value;

  var switchOptions = ['STR','DEX'];
  for (let hiddenInput of field.getElementsByClassName('field--control_ref-switch__ref')) {
    if (hiddenInput.dataset.hasOwnProperty('switch')) {
      let sw = hiddenInput.dataset['switch'];
      if (sw !== null && sw != "") {
        switchOptions = sw.split(',');
      }
    }
  }

  for (var opt of switchOptions) {
    var elem = document.getElementById(`ref-switch-${fieldId}-${opt}`);
    if (elem !== null) {
      elem.checked = false;
      elem.removeAttribute('checked');
    }
  }
  if (value !== null && value !== "") {
    var elem = document.getElementById(`ref-switch-${fieldId}-${value}`);
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
  var labelText = getFieldLabel(ref);
  switch (ref) {
    case 'STR': case 'construct/STR': labelText = "_{STR}"; break;
    case 'DEX': case 'construct/DEX': labelText = "_{DEX}"; break;
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
      if (!control.classList.contains('field--inmenu__control')) {
        for (var input of control.getElementsByTagName('input')) {
          input.setAttribute('ref', ref);
          input.value = value;
          input.dispatchEvent(new Event('change'));
        }
      }
    }

    for (var label of field.getElementsByTagName('label')) {
      if (!label.classList.contains('field--inmenu__label')) {
        label.innerText = labelText;
      }
    }
  }
}

for (var field of document.getElementsByClassName("field--control_ref-switch")) {
  // get the list of options for this ref-switch field
  var switchOptions = ['STR','DEX'];
  for (let hiddenInput of field.getElementsByClassName('field--control_ref-switch__ref')) {
    if (hiddenInput.dataset.hasOwnProperty('ref')) {
      let ref = hiddenInput.dataset.ref;
      if (ref !== null && ref != "") {
        switchOptions = ref.split(',');
      }
    }
  }
  
  // add change listener
  for (let opt of field.getElementsByClassName('ref-switch')) {
    ((opt) => {
      let fieldId = field.id.replace(/^field-/, '');
      let optValue = opt.value;
      let optLabel = getFieldLabel(optValue);

      opt.addEventListener('change', function (evt) {
        if (menus.currentFieldId !== null) {
          setRefSwitchValue(menus.currentFieldId, optValue);
          dismissMenus();
        }
      });

      // select a value when somebody clicks on the preview field
      let clickField = document.getElementById(`menu-field-ref-switch-${fieldId}-${optValue}`);
      if (clickField != null) {
        clickField.addEventListener('click', (evt) => {
          opt.click();
        });
        for (let label of clickField.getElementsByTagName('label')) {
          label.innerText = optLabel;
        }
      }
    })(opt);
  }

  // show the menu when we click on the field - but not other sub-fields
  for (var frame of field.getElementsByClassName("field__frame")) {
    if (!frame.classList.contains('field--inmenu__frame')) {
      frame.addEventListener('click', showRefSwitchMenu);
    }
  }
}
