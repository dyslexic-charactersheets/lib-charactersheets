import { readFile } from 'fs';
import { log, warn, error } from '../log';
import { isNull, isArray, has } from '../util';

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
  
  inferUnits(units, system) {
    // infer required units (to a finite depth)
    let more = true;
    for (let i = 0; more && i < 10; i++) {
      more = false;
      // log("Character", "Checking for required units");
      let moreunits = [];
      let unitIds = units.map(unit => unit.id);
      // log("Character", "Unit IDs:", unitIds);
      units.forEach(unit => {
        if (has(unit, "require") && !isArray(unit.require)) {
          error("Character", `Require not an array in ${unit.id}`, unit.require);
        }
        if (has(unit, "require")) {
          unit.require.forEach(req => {
            // log("Character", `Unit ${unit.id} requires`, req);
            // check if the new unit is really new
            if (unitIds.includes(req.unit))
              return;

            // check if the new unit has dependencies on other units
            if (has(req, "with")) {
              if (!unitIds.includes(req.with))
                return;
            }

            const newunit = this.getUnit(req.unit);
            if (!isNull(newunit)) {
              moreunits.push(newunit);
              more = true; // let's do this again
            }
          });
        }
      });
      units = units.concat(moreunits);
    }
    units = [...new Set(units)];
    return units;
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
