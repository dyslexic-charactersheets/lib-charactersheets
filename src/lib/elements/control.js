import { interpolate, isEmpty } from '../util';
import { log } from '../log';

export let ifelem = {
  name: 'if',
  key: 'condition',
  defaults: {
    condition: '',
    then: [],
    else: []
  },
  transform(args, ctx) {
    // log("control", "if", args.condition);
    let condition = interpolate(args.condition, {}, ctx);
    condition = condition.replace(/#\{.*?\}/g, '');

    // conditions
    // log("control", "if condition:", condition);
    let m;
    if (m = condition.match(/(.*)==(.*)/)) {
      let left = m[1].trim();
      let right = m[2].trim();
      condition = (left == right);
    } else if (m = condition.match(/(.*)!=(.*)/)) {
      let left = m[1].trim();
      let right = m[2].trim();
      condition = (left != right);
    } else if (m = condition.match(/(.*)>=(.*)/)) {
      let left = m[1].trim();
      let right = m[2].trim();
      condition = (left >= right);
    } else if (m = condition.match(/(.*)>(.*)/)) {
      let left = m[1].trim();
      let right = m[2].trim();
      condition = (left > right);
    } else if (m = condition.match(/(.*)<=(.*)/)) {
      let left = m[1].trim();
      let right = m[2].trim();
      condition = (left <= right);
    } else if (m = condition.match(/(.*)<(.*)/)) {
      let left = m[1].trim();
      let right = m[2].trim();
      condition = (left < right);
    } else if (m = condition.match(/!(.*)/)) {
      let value = m[1].trim();
      condition = !(value);
    } else {
      condition = condition.trim();
    }

    // log("control", "if: value:", condition);
    switch(condition) {
      case 'true':
      case 'yes':
      case '1':
      case true:
      case 1:
        // log("control", "if: then:", args.then);
        return args.then;

      default:
        // log("control", "if: else:", args.else);
        return args.else;
    }
  }
}
