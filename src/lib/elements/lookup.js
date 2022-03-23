import { isString, isObject, isArray } from '../util';
import { has } from '../util/objects';
import { log } from '../log';

export let lookup = {
  name: 'lookup',
  key: 'lookup',
  defaults: {
    lookup: {},
    contents: [],
  },
  transform(args) {
    var lookup = args.lookup;
    if (isArray(lookup)) {
      lookup = lookup[0];
    }
    // log("lookup", "Lookup", lookup);
    // log("lookup", "Items", args.contents);
    return args.contents.flatMap(item => {
      if (isObject(item)) {
        // log("lookup", "Literal item", item);
        return item;
      }

      if (isString(item) && has(lookup, item)) {
        // log("lookup", "Found item", item);
        return [lookup[item]];
      }

      log("lookup", "No such item", item);
      return [];
    });
  }
}
