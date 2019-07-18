
import { log, error } from '../log';
import { System, ready as systemsReady, getSystem } from './System';
import { Document } from './Document';
import { LoadQueue } from './LoadQueue';
import { Events } from './Events';

function parseParty(primary, request) {
  let attr = Object.assign({
    game: 'pathfinder2',
    language: 'en',
    name: ''
  }, primary.attributes);

  return {};
}

export class Party {
  constructor(primary, request, registry) {
    this.registry = registry;
    this.partydesc = parseParty(primary, request);
  }
  
  render(callback) {

  }
}
