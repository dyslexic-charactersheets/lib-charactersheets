import { interpolate } from '../util';
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
      let left = trim(m[1]);
      let right = trim(m[2]);
      condition = (left == right);
    } else if (m = condition.match(/(.*)!=(.*)/)) {
      let left = trim(m[1]);
      let right = trim(m[2]);
      condition = (left != right);
    } else if (m = condition.match(/(.*)>=(.*)/)) {
      let left = trim(m[1]);
      let right = trim(m[2]);
      condition = (left >= right);
    } else if (m = condition.match(/(.*)>(.*)/)) {
      let left = trim(m[1]);
      let right = trim(m[2]);
      condition = (left > right);
    } else if (m = condition.match(/(.*)<=(.*)/)) {
      let left = trim(m[1]);
      let right = trim(m[2]);
      condition = (left <= right);
    } else if (m = condition.match(/(.*)<(.*)/)) {
      let left = trim(m[1]);
      let right = trim(m[2]);
      condition = (left < right);
    } else if (m = condition.match(/!(.*)/)) {
      let value = trim(m[1]);
      condition = !(value);
    }

    // log("control", "if value:", condition);
    switch(condition) {
      case 'true':
      case 'yes':
      case '1':
      case true:
      case 1:
        return args.then;

      default:
        return args.else;
    }
  }
}
