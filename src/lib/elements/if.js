import { interpolate } from '../util/objects';
import { log, warn } from '../log';
import { isEmpty, isNumber, isString } from '../util';

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

    case 'false':
    case 'no':
    case '0':
    case false:
    case 0:
    case '':
      return false;

    default:
      return true;
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
    warn("if", "Late evaluation of if condition:", args.condition)
    let ok = testCondition(args.condition, doc);
    if (ok) {
      return reg.render(args.then, doc);
    } else {
      return reg.render(args.else, doc);
    }
  }
}

export let switchelem = {
  name: 'switch',
  key: 'on',
  defaults: {
    on: '',
    case: {},
    default: []
  },
  transform(args, ctx) {
    log("switch", "Evaluating switch:", args.on);
    for (let key in args.values) {
      let value = args.values[key];
      if (testCondition(`${args.on}==${key}`, ctx)) {
        return value;
      }
    }
    return args.default;
  },
  render(args, reg, doc) {
    warn("switch", "Late evaluation of switch:", args.on);
    for (let key in args.values) {
      let value = args.values[key];
      if (testCondition(`${args.on}==${key}`, doc)) {
        return reg.render(value, doc);
      }
    }
    return reg.render(args.default, doc);
  }
}
