import { interpolate } from '../util/objects';
import { log } from '../log';

function testCondition(condition, ctx) {
  // log("control", "if", args.condition);
  condition = interpolate(condition, {}, ctx);
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
      return true;

    default:
      return false;
  }
}

export let ifelem = {
  name: 'if',
  key: 'condition',
  defaults: {
    condition: '',
    delay: false,
    then: [],
    else: []
  },
  transform(args, ctx) {
    if (args.delay) {
      return false;
    }

    let ok = testCondition(args.condition, ctx);
    if (ok) {
      return args.then;
    } else {
      return args.else;
    }
  },
  render(args, reg, doc) {
    let ok = testCondition(args.condition, doc);
    if (ok) {
      return reg.render(args.then, doc);
    } else {
      return reg.render(args.else, doc);
    }
  }
}
