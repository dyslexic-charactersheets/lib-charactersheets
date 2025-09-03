/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

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
