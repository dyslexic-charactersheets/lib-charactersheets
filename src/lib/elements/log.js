import { log } from '../log';
import { interpolate } from '../util/objects';

export let logelem = {
  name: 'log',
  key: 'message',
  defaults: {
    message: '',
  },
  transform(args, doc) {
    const message = interpolate(args.message, {}, doc);
    log("-", message);
    return [];
  }
};
