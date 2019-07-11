import { log, error } from '../log';

import { Character } from './Character';

function randomID() {
  return Math.random().toString(16).substring(2,9)
}

export class Request {
  constructor(chardesc) {
    this.instances = {};
    this.primary = [];

    this.parse(chardesc);
  }

  parse(request) {
    // log("Request", "Parsing request", request);
    // included instances go first, in case there's an ID conflict
    if (Object.hasOwnProperty(request, "included")) {
      if (Array.isArray(request.included)) {
        request.included.forEach(instance => this.addInstance(instance, false));
      }
    }

    // primary data may be one item or several
    if (Array.isArray(request.data)) {
      request.data.forEach(instance => this.addInstance(instance, true));
    } else {
      this.addInstance(request.data, true);
    }
  }

  addInstance(instance, primary) {
    if (!Object.hasOwnProperty(instance, "id"))
      instance.id = randomID();
    this.instances[instance.id] = instance;
    if (primary)
      this.primary.push(instance);
  }

  getPrimaries(registry) {
  //   log("Request", "getPrimaries", this.primary);
  //   log("Request", "Instances", this.instances);

    this.primary.forEach(primary => {
      // swap in linked instances
      if (Object.hasOwnProperty(primary, "relationships")) {
        Object.keys(primary.relationships).forEach(relkey => {
          primary.attributes[relkey] = primary.relationships[relkey].data.flatMap(link => {
            if (Object.hasOwnProperty(this.instances, link.id)) {
              return [this.instances[link.id]];
            } else {
              return [];
            }
          });
          log("Request", "Substituted relationships: ", relkey, "=", primary.attributes[relkey]);
        });
      }
    });

    return this.primary.map(primary => {
      switch(primary.type) {
        case 'character':
          return new Character(primary, registry);

        // case 'party':
        //   let members = primary.attributes.members.map(member => {
        //     return new Character(member);
        //   });
        //   return new Party(primary, members);
      }
    });
  }
}
