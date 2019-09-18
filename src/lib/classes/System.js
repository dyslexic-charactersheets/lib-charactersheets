import { readFile } from 'fs';
import { log, warn, error } from '../log';
import { isNull, has } from '../util';

let systems = {};
let commonSystem = null;
let premiumSystem = null;
let promises = [];

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
    if (has(this.units, code)) {
      return this.units[code];
    }
    if (commonSystem !== null && has(commonSystem.units, code)) {
      return commonSystem.units[code];
    }
    if (premiumSystem !== null && has(premiumSystem.units, code)) {
      return premiumSystem.units[code];
    }
    warn("System", "Unknown unit:", code);
    return null;
  }

  getUnits(codes) {
    return codes.flatMap(code => {
      let unit = this.getUnit(code);
      return isNull(unit) ? [] : [unit];
    });
  }
}

export function loadSystemData(codes) {
  codes.forEach(code => {
    const systemFile = __dirname + "/lib-" + code + ".json";
    // log("System", `Loading: ${systemFile}`);
    const promise = new Promise((resolve, reject) => {
      readFile(systemFile, 'utf-8', (err, data) => {
        if (err) {
          error("System", `Error loading system file ${systemFile}:`, err);
          resolve();
          return;
        }

        const systemData = JSON.parse(data);
        const system = new System(systemData);
        log("System", `Loaded ${system.name} (${systemData.units.length} units)`);

        systems[code] = system;
        if (code == "common") {
          // log("System", "Found common system");
          commonSystem = system;
        } else if (code == "premium") {
          premiumSystem = system;
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
