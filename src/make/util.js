'use strict';

// const _ = require('lodash');

// Polyfills

// polyfill for Array.flat and Array.flatMap, which aren't well supported even with Babel
// cf https://github.com/jonathantneal/array-flat-polyfill

if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    value: function flat() {
      var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

      return depth ? Array.prototype.reduce.call(this, function (acc, cur) {
        if (Array.isArray(cur)) {
          acc.push.apply(acc, flat.call(cur, depth - 1));
        } else {
          acc.push(cur);
        }

        return acc;
      }, []) : Array.prototype.slice.call(this);
    },
    writable: true
  });
}

if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    configurable: true,
    value: function flatMap(callback) {
      var parts = Array.prototype.map.apply(this, arguments);
      return parts.flat();
    },
    writable: true
  });
}


// identity functions
function isNull(val) {
  return val === null || val === undefined;
}

function isEmpty(val) {
  return val === null || val === undefined || val == "" || (Array.isArray(val) && val.length == 0);
}

function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

function isNumber(val) {
  return Number.isFinite(val);
}

function isArray(val) {
  return Array.isArray(val);
}

function isObject(val) {
  return val instanceof Object;
}

function has(container, property) {
  if (isNull(container)) return false;
  return Object.prototype.hasOwnProperty.call(container, property) && !isNull(container[property]);
}

function interpolate(template, values) {
  if (isNull(template)) {
    return null;
  }

  if (isString(template)) {
    if (has(values, "unit")) {
      template = template.replace(/##/g, values.unit);
    }
    return template.replace(/#\{(.*?)\}/g, function (tag) {
      const match = tag.match(/#\{(.*?)\}/);
      const index = match[1];
      if (has(values, index)) {
        return values[index];
      } else {
        const trinaryMatch = index.match(/(.*)\?(.*):(.*)/);
        if (trinaryMatch) {
          let ok = toBoolean(trinaryMatch[1]);
        }
      }
      return match[0];
    });
  }

  if (isArray(template)) {
    const product = template.map(item => interpolate(item, values));
    return product.flatMap(item => isArray(item) ? item : [item]);
  }

  if (isObject(template)) {
    // replace all the values
    let keys = Object.keys(template);
    let obj = {};
    keys.forEach(key => {
      obj[key] = interpolate(template[key], values);
    });

    // check if the whole object needs replacing
    let first = keys[0];
    if (first == "type")
      first = template[first];
    if (first == 'param') {
      const paramkey = pairs[0][1];
      if (has(values, paramkey)) {
        return values[paramkey];
      }
    } else if (first == 'item' && has(values, 'item') && !isEmpty(values.item)) {
      // log("util", "Interpolate: item", values.item);
      return values.item;
    }

    return obj;
  }

  return template;
}

module.exports = {
  has,
  isEmpty,
  isNull,
  interpolate,
};
