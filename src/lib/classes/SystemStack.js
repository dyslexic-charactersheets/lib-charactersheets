import { getSystem, COMMON, PREMIUM, PATHFINDER_2, PATHFINDER_2_REMASTER, STARFINDER_2 } from "./System";
import { isNull, isArray } from '../util';
import { log, warn } from "../log";
import { has } from '../util/objects';

class SystemStack {
  constructor(systems) {
    this.systems = systems;
    this.code = systems[0].code;
    this.name = systems[0].name;
  }

  getUnit(code) {
    for (let system of this.systems) {
      if (system.hasUnit(code)) {
        // log ("SystemStack", "Unit", code, "in", system.code);
        return system.getUnit(code);
      }
    }
    warn("SystemStack", "Unknown unit:", code);
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
          error("SystemStack", `Require not an array in ${unit.id}`, unit.require);
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
              warn("SystemStack", `Required unit not found: ${req.unit}`);
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

export function getSystemStack(code) {
  let stack = code.split(',').map((systemCode) => {
    switch (systemCode) {
      case PATHFINDER_2:
        return [PATHFINDER_2];
      case PATHFINDER_2_REMASTER:
        return [PATHFINDER_2_REMASTER];
      case STARFINDER_2:
        return [STARFINDER_2];
      default:
        return [systemCode];
    }
  }).flat();
  stack = [...stack, PREMIUM, COMMON];

  // dedup
  stack = [...new Set(stack)];
  log("SystemStack", "System stack", stack);

  // make systems
  let systems = [];
  for (let systemCode of stack) {
    let system = getSystem(systemCode);
    if (!isNull(system)) {
      systems.push(system);
    }
  }

  return new SystemStack(systems);
}
