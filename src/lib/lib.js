import { Registry } from './classes/Registry';
import { Request } from './classes/Request';
import { loadSystemData } from './classes/System';
import { Events } from './classes/Events';
import { addAssetsDir as _addAssetsDir } from './data';

// start this first, it's the slow bit
loadSystemData([
  "common", 
  "pathfinder2",
  "premium"
]);

let registry = new Registry();

export function create(chardesc) {
  let request = new Request(chardesc);
  let primary = request.getPrimaries(registry);
  return primary[0];
}

export function addAssetsDir(dir) {
  _addAssetsDir(dir);
}

export function onCreate(callback) {
  Events.createEvt.on(callback);
}

export function onCreateElementTree(callback) {
  Events.createElementTreeEvt.on(callback);
}

export function onError(callback) {
  Events.errorEvt.on(callback);
}
