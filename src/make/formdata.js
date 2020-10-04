const _ = require('lodash');
require('./log');

module.exports = {
  summarise: function(game, units) {
    var baseSelects = [];
    var baseOptions = [];
    var slotValues = {};
    var slotGroups = {};

    var languages = [
      {
        code: 'en',
        name: 'English',
        localname: 'English',
        flag: 'gb'
      },
      {
        code: 'it',
        name: 'Italian',
        localname: 'Italiano',
        flag: 'it'
      }
    ];

    switch (game) {
      case "pathfinder2":
        baseSelects.push({
          select: "heritage/versatile",
          name: "Versatile Heritages",
          max: 1,
          base: false,
          values: [],
        });
        break;
    }

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
        var exclude_from = [];
        if (_.has(unit, "form") && unit.id != "base") {
          unit.form.forEach(item => {
            var key = Object.keys(item)[0];
            switch (key) {
              case "select":
                unlocks.push(item[key]);
                break;

              case "exclude-from":
                exclude_from.push(item[key]);
                break;
            }
          });
        }

        // Store that unit in the right slot
        if (!_.has(slotValues, unit.in))
          slotValues[unit.in] = {};

        let item = {
          id: unit.id,
          code: unit.code,
          group: unit.group,
          name: unit.name,
        };

        if (_.has(unit, "level"))
          item.level = unit.level;
        if (_.has(unit, "order"))
          item.order = unit.order;
        if (unlocks.length > 0)
          item["selects"] = unlocks;
        if (exclude_from.length > 0)
          item["exclude-from"] = exclude_from;

        slotValues[unit.in][unit.code] = item;

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

    // translation data
    // TODO language completion
    
    return {
      selects: baseSelects,
      options: baseOptions,
      languages: languages,
    };
  }
};
