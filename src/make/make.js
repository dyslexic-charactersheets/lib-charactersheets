const fs = require('fs');
const path = require('path');

require('./log');
const units = require('./units');
const formdata = require('./formdata');

const systems = [
    {
        code: "common",
        name: "Common"
    },
    {
        code: "pathfinder2",
        name: "Pathfinder 2nd Edition"
    },
    // {
    //     code: "dnd5e",
    //     name: "Dungeons & Dragons 5th Edition"
    // }
    // {
    //     code: "starfinder",
    //     name: "Starfinder"
    // }
    // {
    //     code: "core-fantasy",
    //     name: "Tales of the Valiant"
    // }
    {
      code: "premium",
      name: "Premium Options"
    }
];

systems.forEach(system => {
    log("make", "Building "+system.name);

    units.loadSystem(system.code, system.name, systemUnits => {
        log("make", `Built ${system.name} (${systemUnits.length} units)`);

        system.units = systemUnits;
        var systemData = JSON.stringify(system);

        var systemFile = path.normalize(__dirname+'/../../lib/lib-'+system.code+".json");
        fs.writeFile(systemFile, systemData, err => {
            if (err) error("make", "Error saving system", system, err);
        });

        if (system.code != "common") {
          var summary = formdata.summarise(system.code, systemUnits);
          var summaryData = JSON.stringify(summary);
          var summaryFile = path.normalize(__dirname+'/../../lib/data-'+system.code+".json");
          fs.writeFile(summaryFile, summaryData, err => {
            if (err) error("make", "Error saving summary", system, err);
          });
        }

        // i18n.parseSystemUnits(system, systemUnits);
    });
});

// i18n.writePot();
