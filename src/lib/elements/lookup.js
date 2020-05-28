import { isString, isObject, has } from '../util';
import { log } from '../log';

export let lookup = {
  name: 'lookup',
  key: 'lookup',
  defaults: {
    lookup: {},
    contents: [],
  },
  transform(args) {
    // log("lookup", "Items", args.contents);
    return args.contents.flatMap(item => {
      if (isObject(item)) {
        return item;
      }

      if (isString(item) && has(args.lookup, item)) {
        return [args.lookup[item]];
      }

      return [];
    });
  }
}
