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
