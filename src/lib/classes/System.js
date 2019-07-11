import * as fs from 'fs';
import { log, warn, error } from '../log';

var systems = {};
var commonSystem = null;
var promises = [];

export class System {
    constructor(system) {
        this.code = system.code;
        this.name = system.name;
        this.units = {};
        system.units.forEach(unit => {
            this.units[unit.id] = unit;
        });
    }

    getUnit(code) {
        if (this.units.hasOwnProperty(code)) {
            return this.units[code];
        }
        if (commonSystem !== null && commonSystem.units.hasOwnProperty(code)) {
            return commonSystem.units[code];
        }
        warn("System", "Unknown unit:", code);
        return null;
    }

    getUnits(codes) {
        var units = codes.map(code => {
            return this.getUnit(code);
        });
        return units.filter(unit => unit !== null);
    }
}

export function loadSystemData(codes) {
    codes.forEach(code => {
        var systemFile = __dirname+"/lib-"+code+".json";
        log("System", `Loading: ${systemFile}`);
        var promise = new Promise((resolve, reject) => {
            fs.readFile(systemFile, 'utf-8', (err, data) => {
                if (err) {
                    error("System", `Error loading system file ${systemFile}:`, err);
                    reject();
                    return;
                }
    
                var systemData = JSON.parse(data);
                var system = new System(systemData);
                log("System", `Loaded ${system.name} (${systemData.units.length} units)`);

                systems[code] = system;
                if (code == "common") {
                    // log("System", "Found common system");
                    commonSystem = system;
                }
                resolve();
            });
        });
        promises.push(promise);
    });
}

export function ready(callback) {
    Promise.all(promises).then(() => {
        // log("System", "Ready");
        callback();
    });
}

export function getSystem(code) {
    // log("System", `Get system: ${code}`);
    // log("System", "Systems", systems);
    return systems[code];
}
