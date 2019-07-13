import { Registry } from './classes/Registry';
import { Request } from './classes/Request';
import { Character } from './classes/Character';
import { System, loadSystemData } from './classes/System';
import { addAssetsDir as _addAssetsDir } from './data';

// start this first, it's the slow bit
loadSystemData(["common", "pathfinder2"]);

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

}

export function onCreateElementTree(callback) {

}

export function onError(callback) {

}
