/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

// field interactions: WEAPON TYPE (melee/ranged toggle for flexible attack slots)

var weaponTypeIcons = {
  melee: 'icon_sword',
  unarmed: 'icon_claw',
  ranged: 'icon_bow',
};

function showWeaponTypeMenu(event) {
  var field = event.target.closest('.field');
  showMenu(event, 'weapon-type', field);

  var value = 'melee';
  for (var input of field.getElementsByTagName('input')) {
    value = input.value;
  }

  for (var weaponType in weaponTypeIcons) {
    document.getElementById('weapon-type-menu-' + weaponType).checked = false;
  }

  var radio = document.getElementById('weapon-type-menu-' + value);
  if (radio !== null) {
    radio.checked = true;
  }
}

function applyWeaponTypeToBlock(field, value) {
  var block = field.closest('.g');
  if (block === null) {
    return;
  }
  for (var weaponType in weaponTypeIcons) {
    block.classList.toggle('weapon-flex--' + weaponType, value === weaponType);
  }
}

function setWeaponTypeValue(fieldId, value) {
  for (var field of document.getElementsByName(fieldId)) {
    for (var input of field.getElementsByTagName('input')) {
      input.value = value;
    }
    for (var icon of field.getElementsByClassName('icon')) {
      for (var weaponType in weaponTypeIcons) {
        icon.classList.remove(weaponTypeIcons[weaponType]);
      }
      icon.classList.add(weaponTypeIcons[value] || weaponTypeIcons.melee);
    }
    applyWeaponTypeToBlock(field, value);
  }
}

for (var weaponType of ['melee', 'unarmed', 'ranged']) {
  (function (weaponType) {
    var input = document.getElementById('weapon-type-menu-' + weaponType);
    if (input === null) {
      return;
    }
    input.addEventListener('change', function (event) {
      if (menus.currentFieldId !== null) {
        setWeaponTypeValue(menus.currentFieldId, weaponType);
        dismissMenus();
      }
    });
  })(weaponType);
}

var weaponTypeMenu = document.getElementById('weapon-type-menu');
if (weaponTypeMenu !== null) {
  weaponTypeMenu.addEventListener('click', function (event) {
    event.stopPropagation();
  });
}

for (var field of document.getElementsByClassName('field--control_weapon-type-icon')) {
  for (var icon of field.getElementsByClassName('icon')) {
    icon.addEventListener('click', showWeaponTypeMenu);
  }
}

// set each flexible weapon block's starting melee/ranged class to match
// its stored value once the page has loaded
window.addEventListener('load', function () {
  for (var field of document.getElementsByClassName('field--control_weapon-type-icon')) {
    var value = 'melee';
    for (var input of field.getElementsByTagName('input')) {
      value = input.value;
    }
    applyWeaponTypeToBlock(field, value);
  }
});
