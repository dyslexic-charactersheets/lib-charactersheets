const _ = require('lodash');
require('./log');

module.exports = {
  summarise: function(units) {
    var baseSelects = [];
    var baseOptions = [];
    var slotValues = {};
    var slotGroups = {};

    units.forEach(unit => {
      if (_.has(unit, "in")) {
        // get a shorter unit code
        if (!_.has(unit, "code")) {
          unit.code = unit.id;
          if (unit.code.startsWith(unit.in)) {
            unit.code = unit.id.substr(unit.in.length + 1);
          }
        }
        // log("formdata", `Unit ${unit.in}:${unit.code}`);
        
        var unlocks = [];
        if (_.has(unit, "form") && unit.id != "base") {
          unit.form.forEach(item => {
            var key = Object.keys(item)[0];
            if (key == "select" ) {
              unlocks.push(item[key]);
            }
          });
        }

        // Store that unit in the right slot
        if (!_.has(slotValues, unit.in))
          slotValues[unit.in] = {};

        slotValues[unit.in][unit.code] = {
          id: unit.id,
          code: unit.code,
          group: unit.group,
          name: unit.name,
          selects: unlocks
        };

        if (_.has(unit, "group")) {
          if (!_.has(slotGroups, unit.in))
            slotGroups[unit.in] = {};
          if (!_.has(slotGroups[unit.in], unit.group))
            slotGroups[unit.in][unit.group] = [];
          slotGroups[unit.in][unit.group].push(unit.code);
        }
      }

      // make a note of all the form slots unlocked by this unit
      if (_.has(unit, "form")) {
        unit.form.forEach(item => {
          var key = Object.keys(item)[0];
          if (key == "select") {
            item.base = unit.id == "base";
            baseSelects.push(item);
          } else if (key == "option") {
            item.base = unit.id == "base";
            baseOptions.push(item);
          }
        });
      }
    });

    baseSelects.forEach(sel => {
      sel.values = _.has(slotValues, sel.select) ? Object.values(slotValues[sel.select]) : [];
      sel.groups = _.has(slotGroups, sel.select) ? slotGroups[sel.select] : {};
      // log("formdata", `Slot ${sel.select}: ${sel.values.length} units`);
    });
    
    return {
      selects: baseSelects,
      options: baseOptions,
    };
  }
};
