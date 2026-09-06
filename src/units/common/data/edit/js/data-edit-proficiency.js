/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

// field interactions: PROFICIENCY

function showProficiencyMenu(event) {
  var field = event.target.closest('.field');

  var categoryMarker = field.querySelector('[data-category]');
  if (categoryMarker !== null) {
    showCategoryMenu(event, field, categoryMarker.getAttribute('data-category'));
    return;
  }

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

  if (fieldId === 'field-armour-cat') {
    updateArmourClassProficiency();
  }

  for (var kind in categoryProficiencyFields) {
    var map = categoryProficiencyFields[kind];
    for (var category in map) {
      if (map[category] === fieldId) {
        propagateCategoryProficiency(kind, category);
      }
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

var weaponCatProficiencyFields = {
  'Unarmed': 'field-unarmed-attack-proficiency',
  'Simple': 'field-simple-weapons-proficiency',
  'Martial': 'field-martial-weapons-proficiency',
  'Advanced': 'field-advanced-weapons-proficiency',

  'Custom1': 'field-proficiency-1-value',
  'Custom2': 'field-proficiency-2-value',
};

var armourCatProficiencyFields = {
  'Unarmoured': 'field-unarmoured-proficiency',
  'Light': 'field-light-armour-proficiency',
  'Medium': 'field-medium-armour-proficiency',
  'Heavy': 'field-heavy-armour-proficiency',
};

var categoryProficiencyFields = {
  weapon: weaponCatProficiencyFields,
  armour: armourCatProficiencyFields,
};

function categorySlug(category) {
  return category.toLowerCase();
}

function getCategoryValue(prefixedFieldId) {
  var rawId = prefixedFieldId.replace(/^field-/, '');
  return getRawFieldValue(rawId + '-category');
}

function setCategoryValue(prefixedFieldId, kind, category) {
  var rawId = prefixedFieldId.replace(/^field-/, '');
  for (var input of document.getElementsByName(rawId + '-category')) {
    input.value = category;
  }

  var menuLabel = document.querySelector("#" + kind + "-category-menu-" + categorySlug(category) + " ~ .control-menu__label");
  var nameText = menuLabel !== null ? menuLabel.innerText : category;
  for (var field of document.getElementsByName(prefixedFieldId)) {
    for (var nameSpan of field.getElementsByClassName('field--control_proficiency__category-name')) {
      nameSpan.innerText = nameText;
    }
  }

  for (var bonusInput of document.getElementsByName(rawId + '-bonus')) {
    bonusInput.removeAttribute('data-custom');
  }

  var map = categoryProficiencyFields[kind];
  var sourceFieldId = map ? map[category] : undefined;
  if (sourceFieldId !== undefined && document.getElementById(sourceFieldId) !== null) {
    setProficiencyValue(prefixedFieldId, getProficiencyValue(sourceFieldId));
  }
}

function propagateCategoryProficiency(kind, category) {
  var map = categoryProficiencyFields[kind];
  var sourceFieldId = map[category];
  if (sourceFieldId === undefined || document.getElementById(sourceFieldId) === null) {
    return;
  }
  var rank = getProficiencyValue(sourceFieldId);
  for (var marker of document.querySelectorAll("[data-category='" + kind + "']")) {
    var field = marker.closest('.field');
    if (field === null || field.id === sourceFieldId) {
      continue;
    }
    if (getCategoryValue(field.id) === category) {
      setProficiencyValue(field.id, rank);
    }
  }
}

function showCategoryMenu(event, field, kind) {
  showMenu(event, kind + '-category', field);

  if (kind === 'weapon') {
    updateCustomWeaponCategoryOptions();
  }

  var map = categoryProficiencyFields[kind];
  var current = getCategoryValue(field.id);
  for (var category in map) {
    var slug = categorySlug(category);
    var radio = document.getElementById(kind + '-category-menu-' + slug);
    if (radio !== null) {
      radio.checked = (category === current);
    }
    var icon = document.getElementById(kind + '-category-menu-' + slug + '__icon');
    if (icon !== null) {
      icon.classList.remove('icon_proficiency-untrained', 'icon_proficiency-trained', 'icon_proficiency-expert', 'icon_proficiency-master', 'icon_proficiency-legendary');
      icon.classList.add('icon_proficiency-' + getProficiencyValue(map[category]));
    }
  }
}

for (var kind in categoryProficiencyFields) {
  (function (kind) {
    var map = categoryProficiencyFields[kind];
    for (var category in map) {
      (function (category) {
        var radio = document.getElementById(kind + '-category-menu-' + categorySlug(category));
        if (radio === null) {
          return;
        }
        radio.addEventListener('change', function (event) {
          if (menus.currentFieldId !== null) {
            setCategoryValue(menus.currentFieldId, kind, category);
            dismissMenus();
          }
        });
      })(category);
    }

    var menu = document.getElementById(kind + '-category-menu');
    if (menu !== null) {
      menu.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    }
  })(kind);
}

for (var marker of document.querySelectorAll('[data-category]')) {
  var categoryField = marker.closest('.field');
  if (categoryField === null) {
    continue;
  }
  for (var bonusInput of categoryField.getElementsByClassName('field__control')) {
    if (bonusInput.classList.contains('field__control--control_icon')) {
      continue;
    }
    for (var input of bonusInput.getElementsByTagName('input')) {
      input.addEventListener('input', function (event) {
        event.target.setAttribute('data-custom', 'true');
      });
    }
  }
}

function updateCustomWeaponCategoryOptions() {
  for (var n of [1, 2]) {
    var name = getRawFieldValue('proficiency-' + n + '-name');
    var row = document.getElementById('weapon-category-menu-custom' + n + '__row');
    if (row === null) {
      continue;
    }
    row.style.display = (name !== null && name !== '') ? '' : 'none';
    var label = document.getElementById('weapon-category-menu-custom' + n + '__label');
    if (label !== null) {
      label.innerText = name;
    }
  }
}

for (var n of [1, 2]) {
  for (var input of document.getElementsByName('proficiency-' + n + '-name')) {
    input.addEventListener('input', updateCustomWeaponCategoryOptions);
    input.addEventListener('change', updateCustomWeaponCategoryOptions);
  }
}

function updateArmourClassProficiency() {
  if (document.getElementById('field-ac-proficiency') === null || document.getElementById('field-armour-cat') === null) {
    return;
  }
  var category = getCategoryValue('field-armour-cat');
  if (category === null || category === '') {
    return;
  }
  setProficiencyValue('field-ac-proficiency', getProficiencyValue('field-armour-cat'));
}

function setupArmourClassProficiency() {
  updateArmourClassProficiency();
}

window.addEventListener('load', function () {
  updateCustomWeaponCategoryOptions();
  setupArmourClassProficiency();
  for (var marker of document.querySelectorAll('[data-category]')) {
    var field = marker.closest('.field');
    if (field === null) {
      continue;
    }
    var kind = marker.getAttribute('data-category');
    var category = getCategoryValue(field.id);
    if (category !== null && category !== '') {
      setCategoryValue(field.id, kind, category);
    }
  }
});
