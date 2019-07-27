const fs = require('fs');
const path = require('path');

// const _ = require('lodash');
// const handlebars = require('handlebars');

const load = require('./loadQueue');

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
    },
    // {
    //     code: "dnd5e",
    //     name: "Dungeons & Dragons 5th Edition"
    // }
    {
      code: "premium",
      name: "Premium Options"
    }
];

systems.forEach(system => {
    log("make", "Building "+system.name);

    units.loadSystem(system.code, systemUnits => {
        log("make", `Built ${system.name} (${systemUnits.length} units)`);

        system.units = systemUnits;
        var systemData = JSON.stringify(system);

        var systemFile = path.normalize(__dirname+'/../../lib/lib-'+system.code+".json");
        fs.writeFile(systemFile, systemData, err => {
            if (err) error("make", "Error saving system", system, err);
        });
    });
});

/*
var assetsDir = path.normalize(__dirname+'/../assets');
var assetsDest = path.normalize(__dirname+'/../../lib/assets');
var nAssets = 0;
load.assets.walkDirectory(assetsDir, fn => {
    if (fn.match(/\.base64$/))
        return false;
    if (fn.match(/\.(svg|png|jpg|jpeg)$/))
        return true;
    return false;
}, (data, fn) => {
    var dest = assetsDest+'/'+fn;

    // log("make", "Processing...", fn);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    
    if (fn.match(/\.svg$/)) {
        var dest = assetsDest+'/'+fn;
        // log("make", " => "+dest);
        fs.writeFile(dest, data, err => {
            if (err) error("make", "Error saving asset:", fn, err);
        });
    } else {
        var buff = Buffer.from(data);  
        var base64data = buff.toString('base64');
        
        // var dest = assetsDest+'/'+fn+'.base64';
        dest = dest+".base64";

        // log("make", " => "+dest);
        fs.writeFile(dest, base64data, err => {
            if (err) error("make", "Error saving asset:", fn, err);
        });
    }

    nAssets++;
});
load.assets.ready(() => {
    log('make', 'Processed '+nAssets+' assets');
});
*/
