/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { readFile } from 'fs';
import { log, warn, error, trace, stackTrace } from '../log';
import { isNull, isArray } from '../util';
import { has } from '../util/objects';

let systems = {};
export let commonSystem = null;
export let premiumSystem = null;
let promises = [];

export const COMMON = "common";
export const PREMIUM = "premium";
export const PATHFINDER_2 = "pathfinder2";
export const PATHFINDER_2_REMASTER = "pathfinder2remaster";
export const STARFINDER_2 = "starfinder2";
export const BLACK_FLAG = "blackflag";


export class System {
  constructor(system) {
    this.code = system.code;
    this.name = system.name;
    this.units = {};
    system.units.forEach(unit => {
      this.units[unit.id] = unit;
    });
  }

  hasUnit(code) {
    return has(this.units, code);
  }

  getUnit(code) {
    if (has(this.units, code)) {
      return this.units[code];
    }
    warn("System", "Unknown unit:", code);
    stackTrace();
    return null;
  }

  getUnits(codes) {
    return codes.flatMap(code => {
      let unit = this.getUnit(code);
      return isNull(unit) ? [] : [unit];
    });
  }
  
  inferUnits(units) {
    // infer required units (to a finite depth)
    let more = true;
    for (let i = 0; more && i < 10; i++) {
      more = false;
      // log("System", "Checking for required units");
      let moreunits = [];
      let denyunits = [];
      let unitIds = units.map(unit => unit.id);
      // log("Character", "Unit IDs:", unitIds);
      units.forEach(unit => {
        if (has(unit, "require") && !isArray(unit.require)) {
          error("System", `Require not an array in ${unit.id}`, unit.require);
        }
        if (has(unit, "require")) {
          unit.require.forEach(req => {
            if (has(req, "deny")) {
              denyunits.push(req["deny"]);
              return;
            }

            // log("System", `Unit ${unit.id} requires`, req);
            // check if the new unit is really new
            if (unitIds.includes(req.unit))
              return;

            // check if the new unit has dependencies on other units
            if (has(req, "with")) {
              if (!unitIds.includes(req.with)) {
                // log("System", `Unfulfilled inference: ${req.with}`);
                return;
              }
            }

            // log("Character", `Inferred: ${unit.id} -> ${req.unit}`);
            const newunit = this.getUnit(req.unit);
            if (!isNull(newunit)) {
              // log("Character", `Infer units: ${unit.id} -> ${newunit.id}`);
              moreunits.push(newunit);
              more = true; // let's do this again
            } else {
              log("System", `Required unit not found: ${req.unit}`);
            }
          });
        }
      });
      // log("Character", `Infer units: #${i} = ${more}`);
      units = units.concat(moreunits).filter(unit => !denyunits.includes(unit.id));
    }
    units = [...new Set(units)];
    // log("Character", "Inferred units:", units.map(unit => unit.id));
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
        if (code == COMMON) {
          // log("System", "Found common system");
          commonSystem = system;
        } else if (code == PREMIUM) {
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
