import { log, warn } from '../log';

import { Character } from './Character';
import { Party } from './Party';
import { Kingdom } from './Kingdom';
import { GM_Party } from './GM_Party';
import { GM_Maps } from './GM_Maps';
import { Build } from './Build';
import { events } from './Events';
import { isArray } from '../util';
import { has } from '../util/objects';
import { Custom } from './Custom';

function randomID() {
  return Math.random().toString(16).substring(2, 9)
}

export class Request {
  constructor(chardesc) {
    this.instances = {};
    this.primary = [];

    events.emit('request', {
      request: chardesc
    });
    this.parse(chardesc);
  }

  parse(request) {
    // log("Request", "Parsing request", request);
    // included instances go first, in case there's an ID conflict
    if (has(request, "included")) {
      if (isArray(request.included)) {
        request.included.forEach(instance => this.addInstance(instance, false));
      }
    }

    // primary data may be one item or several
    if (isArray(request.data)) {
      request.data.forEach(instance => this.addInstance(instance, true));
    } else {
      this.addInstance(request.data, true);
    }
  }

  addInstance(instance, primary) {
    if (!has(instance, "id"))
      instance.id = randomID();
    this.instances[instance.id] = instance;
    if (primary)
      this.primary.push(instance);
  }

  getInstance(id) {
    if (has(this.instances, id)) {
      // log("Request", "getInstance: found", id);
      return this.instances[id];
    }
    // log("Request", "getInstance: not found", id);
    return null;
  }

  getPrimaries(registry) {
    //   log("Request", "getPrimaries", this.primary);
    //   log("Request", "Instances", this.instances);

    // log("Request", "Known instances:", Object.keys(this.instances));

    const primaries = this.primary.map(primary => {
      // swap in linked instances
      if (has(primary, "relationships")) {
        Object.keys(primary.relationships).forEach(relkey => {
          primary.attributes[relkey] = primary.relationships[relkey].data.flatMap(link => {
            if (has(this.instances, link.id)) {
              return [this.instances[link.id]];
            } else {
              return [];
            }
          });
          // log("Request", "Substituted relationships: ", relkey, "=", primary.attributes[relkey]);
        });
      }
      return primary;
    });

    return primaries.map(primary => {
      // log("Request", "Primary", primary);
      switch (primary.type) {
        case 'character':
          return new Character(primary, this, registry);

        case 'party':
          return new Party(primary, this, registry);

        case 'kingdom':
          return new Kingdom(primary, this, registry);

        case 'gm':
          switch(primary.attributes['gm']) {
            case 'characters':
              return new GM_Party(primary, this, registry);
            case 'maps':
              return new GM_Maps(primary, this, registry);
            default:
              warn("Request", "No valid primary in GM request");
          }

        case 'quick':
          switch(primary.attributes['quick']) {
            case 'build':
              return new Build(primary, this, registry);
          }

        case 'custom':
          return new Custom(primary, this, registry);

        default:
          warn("Request", "No valid primary in request");
          return null;
      }
    });
  }
}
