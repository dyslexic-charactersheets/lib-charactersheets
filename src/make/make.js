const fs = require('fs');

const _ = require('lodash');
const handlebars = require('handlebars');

require('./log');
const units = require('./units');

const systems = [
    {
        code: "common",
        name: "Common"
    },
    {
        code: "pathfinder2",
        name: "Pathfinder 2nd Edition"
    }
];

systems.forEach(system => {
    log("make", "Building "+system.name);

    units.loadSystem(system.code, systemUnits => {
        log("make", `Built ${system.name} (${systemUnits.length} units)`);

        system.units = systemUnits;
        var systemData = JSON.stringify(system);

        var systemFile = __dirname+'/../../lib/lib-'+system.code+".json";
        fs.writeFile(systemFile, systemData, err => {
            if (err) error("make", "Error saving system", system, err);
        });
    });
});
