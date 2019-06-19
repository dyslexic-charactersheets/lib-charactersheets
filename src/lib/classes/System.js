
import { log, error } from '../log';

import * as fs from 'fs';

export class System {
    constructor(system) {
        this.code = system.code;
        this.name = system.name;
        this.units = system.units;
    }
}

var systems = {};

export function loadSystemData(systems) {
    systems.forEach(system => {
        var systemFile = __dirname+"/lib-"+system+".json";
        log("System", `Loading: ${systemFile}`);
        fs.readFile(systemFile, 'utf-8', (err, data) => {
            if (err) {
                error("System", `Error loading system file ${systemFile}:`, err);
                return;
            }

            var systemData = JSON.parse(data);
            log("System", `Loaded ${systemData.name} (${systemData.units.length} units)`);
            systems[system] = systemData;
        })
    });
}

export function getSystem(code) {
    return systems[code];
}