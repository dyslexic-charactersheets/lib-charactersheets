import { interpolate } from '../util/objects';
import { log } from '../log';
import { isNumber, isString } from '../util';

export let large_print = {
  name: 'large-print',
  key: 'contents',
  defaults: {
    'contents': [],
    'else': [],
  },
  transform(args, ctx) {
    if (ctx.largePrint) {
      return args['contents'];
    } else {
      return args['else'];
    }
  }
}
