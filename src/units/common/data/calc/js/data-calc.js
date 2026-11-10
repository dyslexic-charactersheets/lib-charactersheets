/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

// Field calculations
var calculations = \{{{ calculations }}};

// Calculation utility functions
function floor(num) {
  var res = Math.floor(num);
  if (isNaN(res)) {
    return 0;
  }
  return res;
}

function ceil(num) {
  var res = Math.ceil(num);
  if (isNaN(res)) {
    return 0;
  }
  return res;
}

function min1(num) {
  return Math.max(num, 1);
}

function min(num, num2) {
  if (num2 === undefined || num2 === null || num2 === "") {
    return num;
  }
  return Math.min(num, num2);
}

function max(num, num2) {
  if (num2 === undefined || num2 === null || num2 === "") {
    return num;
  }
  return Math.max(num, num2);
}

function defaultValue(num, def) {
  if (num === undefined || num === null || num === "") {
    return def;
  }
  return num;
}

function minmax(num, min, max) {
  num = 0+num;
  if (isNaN(num)) {
    return "NaN";
  }
  if (num < min || num > max) {
    throw "Out of bounds";
  }
  return num;
}

function pick(index, values, def) {
  return values.hasOwnProperty(index) ? values[index] : def;
}

function checkgridValue(name) {
  let value = 0;
  let fieldElem = document.getElementByName('id-'+name);
  if (fieldElem !== null) {
    for (let inputs of fieldElem.getElementsByTagName('input')) {
      if (input.type == 'checkbox') {
        if (input.checked) {
          value++;
        }
      }
    }
  }
  return value;
}

function threshold(num, thresholds) {
  var result = '';
  for (var i = 0; i < thresholds.length; i += 2) {
    if (num >= thresholds[i]) {
      result = thresholds[i+1];
    }
  }
  return result;
}

function req(fields, result) {
  if (result === null || isNaN(result) || result === "NaN" || result === "+NaN") {
    return '';
  }
  var has = false;
  for (var field of fields) {
    var value = valueOf(field);
    if (value !== null && value !== "") {
      has = true;
    }
  }
  return has ? result : '';
}

function recalculateField(name) {
  if (calculations.hasOwnProperty(name)) {
    try {
      var newValue = calculations[name](valueOf);
      if (newValue === null || newValue === undefined || isNaN(newValue)) {
        return;
      }
      knownValues[name] = newValue;
      setFieldValue(name, newValue);
    } catch (x) {
      console.log(`Error in field '${name}':`, x);
    }
  }
}


function initCalculations() {
  // find duplicate fields to make sure they change together
  var knownFieldNames = {};
  var duplicateFieldNames = {};
  for (var input of document.getElementsByTagName("input")) {
    var name = input.name;
    if (name !== null && name !== "") {
      if (knownFieldNames.hasOwnProperty(name)) {
        duplicateFieldNames[name] = true;
      }
      knownFieldNames[name] = true;
    }
  }

  for (var name in duplicateFieldNames) {
    (function (name) {
      var inputs = document.querySelectorAll("input[name='"+name+"']");
      for (var input of inputs) {
        input.addEventListener('input', function (evt) {
          try {
            var value = coerceFieldValue(name, evt.target.value, false);
            if (value !== null && !isNaN(value)) {
              for (var otherInput of inputs) {
                otherInput.value = value;
              }
            }
          } catch (x) {
            
          }
        });
      }
    })(name);
  }

  // link up calculations
  for (var name in dependencies) {
    (function (name) {
      function recalcDerivedFields() {
        clearValueCache();
        for (var dep of dependencies[name]) {
          recalculateField(dep);
        }
      }

      for (var input of document.getElementsByName(name)) {
        input.addEventListener('input', recalcDerivedFields);
        input.addEventListener('change', recalcDerivedFields);
      }
    })(name);
  }

  for (var proficiency of ['trained', 'expert', 'master', 'legendary']) {
    for (var input of document.getElementsByName('proficiency-'+proficiency)) {
      input.addEventListener('change', redoProficiency);
    }
  }

  // make all calculation outputs non-editable
  for (var name in calculations) {
    for (var output of document.getElementsByName(name)) {
      output.classList.add('calc-output');
      output.setAttribute('readonly', true);
      output.setAttribute('tabindex', -1);
    }
  }

  // do calculations now!
  clearValueCache();
  for (var name in calculations) {
    recalculateField(name);
  }

  // link all references
  var references = {};
  for (var input of document.querySelectorAll("input[ref]")) {
    var ref = input.getAttribute('ref');
    references[ref] = true;
  }

  for (var name of Object.keys(references)) {
    (function (name) {
      var refInputs = document.querySelectorAll('input[ref="'+name+'"]');
      function recalcReferenceFields() {
        var value = getFieldValue(name);

        if (value !== null) {
          for (var input of refInputs) {
            input.value = value;
            input.dispatchEvent(new Event('change'));
          }
        }
      }

      for (var input of document.getElementsByName(name)) {
        input.addEventListener('input', recalcReferenceFields);
        input.addEventListener('change', recalcReferenceFields);
      }
    })(name);
  }
  
  for (var name of ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']) {
    var input = document.getElementById(name);
    if (input !== null) {
      input.addEventListener('change', redoKeyAbility);
    }
  }
  for (var input of document.getElementsByName('key-ability')) {
    input.addEventListener('change', redoKeyAbility);
  }

  // add double-click for references to link back to main 
  for (var input of document.querySelectorAll("input[ref]")) {
    input.addEventListener('dblclick', function (event) {
      var input = event.target;
      var ref = input.getAttribute('ref');
      if (ref !== null) {
        for (var dest of document.getElementsByName(ref)) {
          dest.scrollIntoView({
            block: 'center',
            inline: 'center'
          });
          var box = dest.closest('.field__box');
          if (box !== null) {
            box.classList.add('buzz');
            setTimeout(function () {
              box.classList.remove('buzz');
            }, 100);
          }
          break;
        }
      }
    });
  }
}


function redoKeyAbility() {
  var keyAbility = getFieldValue('key-ability');
  if (keyAbility === null) {
    return;
  }
  var value = getFieldValue(keyAbility);

  for (var input of document.querySelectorAll("input[ref='=key-ability']")) {
    // update the field label
    var field = input.closest('.field');
    for (var label of field.getElementsByTagName('label')) {
      label.innerText = keyAbility;
    }
    field.classList.remove('field--misc');

    // set the value
    if (value !== null && value !== "") {
      input.value = value;
      input.dispatchEvent(new Event('change'));
    }
  }
}

function getRawFieldValue(name) {
  for (var input of document.getElementsByName(name)) {
    return input.value;
  }
  return '';
}

function redoProficiency() {
  var bonuses = {
    untrained: 0,
    trained: '',
    expert: '',
    master: '',
    legendary: ''
  };
  for (var proficiency of ['untrained', 'trained', 'expert', 'master', 'legendary']) {
    for (var input of document.getElementsByName('proficiency-'+proficiency)) {
      var bonus = coerceFieldValue('proficiency-'+proficiency, input.value, true);
      if (bonus !== null && bonus !== "") {
        if (!isNaN(bonus)) {
          bonuses[proficiency] = bonus;
        }
      }
    }
  }

  for (var field of document.getElementsByClassName('field--control_proficiency')) {
    var proficiency = 'untrained';
    for (var control of field.getElementsByClassName('field__control--control_icon')) {
      for (var input of control.getElementsByTagName('input')) {
        proficiency = input.value;
      }
    }
    for (var control of field.getElementsByClassName('field__control')) {
      if (!control.classList.contains('field__control--control_icon')) {
        for (var input of control.getElementsByTagName('input')) {
          input.value = bonuses[proficiency];
          input.dispatchEvent(new Event('change'));
        }
      }
    }
  }
}


// Hide values

let showValuesToggle = document.getElementById('show-values');
if (showValuesToggle != null) {
  showValuesToggle.addEventListener('change', (evt) => {
    document.body.classList.toggle('body--hide-values', !showValuesToggle.checked);
  });
}



function parseBulkValue(raw) {
  var str = (raw === null || raw === undefined) ? '' : ('' + raw).trim();
  if (str === '') {
    return 0;
  }
  var match = /^(\d*\.?\d*)L$/i.exec(str);
  if (match) {
    var lightAmount = (match[1] === '') ? 1 : parseFloat(match[1]);
    return isNaN(lightAmount) ? 0 : lightAmount * 0.1;
  }
  match = /^(\d*\.?\d+)B$/i.exec(str);
  if (match) {
    var explicitBulk = parseFloat(match[1]);
    return isNaN(explicitBulk) ? 0 : explicitBulk;
  }
  match = /^(\d*\.?\d+)$/.exec(str);
  if (match) {
    var plainBulk = parseFloat(match[1]);
    return isNaN(plainBulk) ? 0 : plainBulk;
  }
  return 0;
}

function parseCurrencyValue(raw) {
  var str = (raw === null || raw === undefined) ? '' : ('' + raw).trim();
  if (str === '') {
    return 0;
  }
  var match = /^(\d*\.?\d+)\s*(pp|gp|sp|cp)$/i.exec(str);
  if (match) {
    var amount = parseFloat(match[1]);
    if (isNaN(amount)) {
      return 0;
    }
    switch (match[2].toLowerCase()) {
      case 'pp': return amount * 10;
      case 'gp': return amount;
      case 'sp': return amount * 0.1;
      case 'cp': return amount * 0.01;
    }
  }
  var plain = parseFloat(str);
  return isNaN(plain) ? 0 : plain;
}

function itemFieldBases(prefix, count) {
  var bases = [];
  for (var i = 1; i <= count; i++) {
    bases.push(prefix + '-' + i);
  }
  return bases;
}

function sumBulkFields(baseNames, suffix) {
  var total = 0;
  baseNames.forEach(function (base) {
    total += parseBulkValue(getRawFieldValue(base + suffix));
  });
  return total;
}

function sumNumberFields(baseNames, suffix) {
  var total = 0;
  baseNames.forEach(function (base) {
    total += parseCurrencyValue(getRawFieldValue(base + suffix));
  });
  return total;
}

function readCompoundBulk(id) {
  var bulkInput = document.getElementById(id + '--bulk');
  var lightInput = document.getElementById(id + '--light');
  var bulk = (bulkInput && bulkInput.value !== '') ? (parseFloat(bulkInput.value) || 0) : 0;
  var light = (lightInput && lightInput.value !== '') ? (parseFloat(lightInput.value) || 0) : 0;
  return bulk + (light * 0.1);
}

function writeCompoundBulk(id, totalBulk) {
  if (totalBulk < 0 || isNaN(totalBulk)) {
    totalBulk = 0;
  }
  var bulk = Math.floor(totalBulk + 1e-9);
  var light = Math.round((totalBulk - bulk) * 10);
  if (light >= 10) {
    bulk += 1;
    light = 0;
  }
  var bulkInput = document.getElementById(id + '--bulk');
  var lightInput = document.getElementById(id + '--light');
  if (bulkInput !== null) {
    bulkInput.value = (bulk === 0) ? '' : bulk;
  }
  if (lightInput !== null) {
    lightInput.value = (light === 0) ? '' : light;
  }
}

function writeNumberField(name, total) {
  var field = document.getElementById(name);
  if (field !== null) {
    total = Math.round(total * 100) / 100;
    field.value = (total === 0) ? '' : total;
  }
}

var inventoryItemBases = itemFieldBases('inventory-item', 8).concat(itemFieldBases('inventory-item-large', 2));
var inventoryBackpackBases = itemFieldBases('inventory-backpack', 16);

function updateInventoryTotals() {
  var backpackBulk = sumBulkFields(inventoryBackpackBases, '-weight')
    + parseBulkValue(getRawFieldValue('inventory-kit-weight')) - 2;
  if (backpackBulk < 0) {
    backpackBulk = 0;
  }
  writeCompoundBulk('weight-backpack-total', backpackBulk);

  var totalBulk = sumBulkFields(inventoryItemBases, '-weight');
  totalBulk += parseBulkValue(getRawFieldValue('armour-bulk'));
  totalBulk += parseBulkValue(getRawFieldValue('shield-bulk'));
  totalBulk += readCompoundBulk('weight-backpack-total');
  writeCompoundBulk('weight-total', totalBulk);

  var totalGold = sumNumberFields(inventoryItemBases, '-value');
  totalGold += sumNumberFields(inventoryBackpackBases, '-value');
  totalGold += parseCurrencyValue(getRawFieldValue('inventory-kit-value'));
  totalGold += (parseFloat(getRawFieldValue('money-platinum')) || 0) * 10;
  totalGold += (parseFloat(getRawFieldValue('money-gold')) || 0);
  totalGold += (parseFloat(getRawFieldValue('money-silver')) || 0) * 0.1;
  totalGold += (parseFloat(getRawFieldValue('money-copper')) || 0) * 0.01;
  writeNumberField('gold-total', totalGold);
}

function setupInventoryTotals() {
  var sourceNames = inventoryItemBases.map(function (b) { return b + '-weight'; })
    .concat(inventoryItemBases.map(function (b) { return b + '-value'; }))
    .concat(inventoryBackpackBases.map(function (b) { return b + '-weight'; }))
    .concat(inventoryBackpackBases.map(function (b) { return b + '-value'; }))
    .concat(['inventory-kit-weight', 'inventory-kit-value', 'armour-bulk', 'shield-bulk',
      'money-platinum', 'money-gold', 'money-silver', 'money-copper']);

  sourceNames.forEach(function (name) {
    for (var input of document.getElementsByName(name)) {
      input.addEventListener('input', updateInventoryTotals);
      input.addEventListener('change', updateInventoryTotals);
    }
  });
  updateInventoryTotals();
}


window.addEventListener('load', (event) => {
  console.log("Initialising calculation");
  initCalculations();
  setupInventoryTotals();
});
