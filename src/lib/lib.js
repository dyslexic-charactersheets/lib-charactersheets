import {Registry} from './classes/Registry';
import { Request } from './classes/Request';
import {Character} from './classes/Character';
import {System, loadSystemData} from './classes/System';

// start this first, it's the slow bit
loadSystemData([ "common", "pathfinder2" ]);

let registry = new Registry();

function CharacterSheets(chardesc) {
  let request = new Request(chardesc);
  let primary = request.getPrimaries(registry);
  return primary[0];
};

export default CharacterSheets;
