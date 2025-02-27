const _ = require('lodash');
require('./log');

module.exports = {
  summarise: function(game, units) {
    var baseSelects = {};
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
      },
      {
        code: 'fr',
        name: 'French',
        localname: 'Francais',
        flag: 'fr'
      },
      {
        code: 'es',
        name: 'Spanish',
        localname: 'Español',
        flag: 'es'
      }
    ];

    switch (game) {
      case "pathfinder2":
      case "pathfinder2remaster":
      case "starfinder2":
        baseSelects["heritage/versatile"] = {
          select: "heritage/versatile",
          name: "Versatile Heritages",
          max: 1,
          base: false,
          values: [],
        };
        break;
    }

    units.forEach(unit => {
      if (_.has(unit, "in")) {
        // get a shorter unit code
        if (!_.has(unit, "code")) {
          unit.code = unit.id;
          if (unit.in == "heritage/versatile/") {
            unit.code = unit.id.substr("heritage/".length);
          } else if (unit.code.startsWith(unit.in)) {
            unit.code = unit.id.substr(unit.in.length + 1);
          }
          unit.code = unit.code.replace(/\//g, '-');
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
          meta: {
            rarity: 'common',
            ...unit.meta
          }
        };

        if (_.has(unit, "badge"))
          item.badge = unit.badge;
        if (_.has(unit, "level"))
          item.level = unit.level;
        if (_.has(unit, "order"))
          item.order = unit.order;
        if (unit.in == "archetype")
          item.multiclass = _.has(unit, "multiclass") && unit.multiclass;
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
            if (!_.has(baseSelects, item.select)) {
              item.base = (_.has(item, "base") && item.base) || (unit.id == "base");
              baseSelects[item.select] = item;
            } else {
              warn("formdata", "Not adding duplicate select", item, "from", unit.id);
            }
          } else if (key == "option") {
            item.base = (_.has(item, "base") && item.base) || (unit.id == "base");
            baseOptions.push(item);
          }
        });
      }
    });

    baseSelects = Object.values(baseSelects);
    baseSelects.sort((a, b) => ('' + a.select).localeCompare(b.select));

    for (let sel of baseSelects) {
      sel.values = _.has(slotValues, sel.select) ? Object.values(slotValues[sel.select]) : [];
      sel.values.sort((a, b) => ('' + a.id).localeCompare(b.id));
      sel.groups = _.has(slotGroups, sel.select) ? slotGroups[sel.select] : {};
      // log("formdata", `Slot ${sel.select}: ${sel.values.length} units`);
    }

    // translation data
    // TODO language completion
    
    return {
      edition: game,
      selects: baseSelects,
      options: baseOptions,
      languages: languages,
    };
  }
};
