/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

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
