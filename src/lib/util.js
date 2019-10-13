const color = require('color');

import * as _ from 'lodash';
import { log, warn, error } from './log';


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


if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (this.length > targetLength) {
      return String(this);
    }
    else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0, targetLength);
    }
  };
}

// From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {

      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}


// identity functions
export function isNull(val) {
  return val === null || val === undefined;
}

export function isNumber(val) {
  return Number.isFinite(val);
}

export function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

export function isArray(val) {
  return Array.isArray(val);
}

export function isObject(val) {
  return val instanceof Object;
}

export function isEmpty(val) {
  if (val === null || val === undefined || val === false) {
    return true;
  }
  if (isString(val)) {
    return val == '';
  }
  if (isArray(val)) {
    return val.length == 0;
  }
  if (isObject(val)) {
    return !Object.entries((val || {})).length;
  }
  return false;
}

export function has(container, property) {
  if (isNull(container)) return false;
  return Object.prototype.hasOwnProperty.call(container, property) && !isNull(container[property]);
}

// Escape strings for HTML
export function esc(content, newlines = false) {
  content = content.replace(/#{.*?}/g, '');
  content = _.escape(content);
  content = content.replace(/’/g, '&rsquo;').replace(/‘/g, '&lsquo;');
  content = content.replace(/—/g, '&mdash;');
  content = content.replace(/&amp;(.+);/, '&$1;');

  if (newlines) {
    content = content.replace(/[\n\r]+/g, '<br>');
  }
  return content;
}

export function elementID(element, id = null) {
  if (id === null || id == '' || id == 'null') {
    return '';
  }

  return ` id='${element}-${id}'`;
}

function pickMods(args, keys) {
  return _.flatMap(args, (v, k) => {
    if (isString(v)) {
      v = v.replace(/#\{.*?\}/g, '');
    }
    return (v && keys.includes(k) && !isEmpty(v) && v != 'false') ? [k] : [];
  });
}

function pickAttribs(args, keys) {
  return _.pick(args, keys);
};

// Convert string case
function splitAnyCase(str) {
  let words = str.split(/[ _/-]+/);
  words = words.flatMap(word => word.split(/([A-Z][a-z]+)/));
  words = words.map(word => word.toLowerCase());
  words = words.filter(word => word != '');
  return words;
}

export function toKebabCase(str) {
  // convert-a-string-to-kebab-case
  const words = splitAnyCase(str);
  return words.join('-');
}

export function toCamelCase(str) {
  // convertAStringToCamelCase
  let words = splitAnyCase(str);
  words = words.map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  words[0] = words[0].toLowerCase();
  return words.join('');
}

export function toPathCase(str) {
  // convert/a/string/to/path/case
  const words = splitAnyCase(str);
  return words.join('/');
}

export function toSpaceCase(str) {
  // convert a string to space case
  const words = splitAnyCase(str);
  return words.join(' ');
}

export function toTitleCase(str) {
  // Convert A String To Title Case
  let words = str.split(' ');
  words = words.map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  return words.join(' ');
}

export function clone(original) {
  if (isNull(original)) {
    return null;
  }
  if (isArray(original)) {
    return [...original];
  }
  if (isObject(original)) {
    return { ...original };
  }
  return original;
}

export function cloneDeep(original) {
  if (isNull(original)) {
    return null;
  }

  if (isArray(original)) {
    return original.map(o => cloneDeep(o));
  }

  if (isObject(original)) {
    let product = {};
    Object.keys(original).forEach(key => {
      product[cloneDeep(key)] = cloneDeep(original[key]);
    });
    return product;
  }

  return original;
}

export function elementClass(block, element = null, args = {}, modKeys = [], attribDefs = {}) {
  let cls = [];

  const prefix = isNull(element) ? block : `${block}__${element}`;

  // built-in elements don't need to repeat that in their class
  switch (prefix) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'hr':
    case 'section':
    case 'aside':
    case 'article':
    case 'header':
    case 'footer':
    case 'img':
    case 'table':
    case 'p':
    case 'span':
    case 'b':
    case 'i':
      break;
    default:
      cls.push(prefix);
  }

  // mods are single-word adjectives, eg
  const mods = pickMods(args, modKeys);
  mods.forEach((mod) => {
    switch (mod) {
      // global mods that don't need a prefix
      // case 'align':
      //     cls.push(``)
      //     break;
      case 'shade':
      case 'lp':
      case 'optional':
        cls.push(mod);
        break;
      default:
        cls.push(`${prefix}--${mod}`);
    }
  });

  // attribs are key-values, eg align=left
  let attribKeys;
  if (isArray(attribDefs)) {
    attribKeys = attribDefs;
    attribDefs = {};
  } else {
    attribKeys = Object.keys(attribDefs);
  }
  const attribs = pickAttribs(args, attribKeys);

  Object.entries(attribs).forEach(pair => {
    const key = pair[0];
    const value = pair[1];

    if (isEmpty(value)) {
      return;
    }
    if (has(attribDefs, key) && value == attribDefs[key]) {
      return;
    }

    switch (key) {
      // global attributes that don't need a prefix
      case 'align':
      case 'valign':
      case 'lp':
      case 'rb':
      case 'icon':
      case 'flex':
        cls.push(`${key}_${value}`);
        break;
      default:
        cls.push(`${prefix}--${key}_${value}`);
        break;
    }
  });

  // the class attr, if needed
  if (isEmpty(cls)) {
    return '';
  }
  return ` class='${cls.join(' ')}'`;
}


export function interpolate(template, values, document = null) {
  if (isNull(template)) {
    return null;
  }

  if (isString(template)) {
    return template.replace(/#\{(.*?)\}/g, function (tag) {
      const match = tag.match(/#\{(.*?)\}/);
      const index = match[1];
      if (has(values, index)) {
        return values[index];
      } else if (!isNull(document) && document.hasVar(index)) {
        return document.getVar(index);
      }
      return match[0];
    });
  }

  if (isArray(template)) {
    const product = template.map(item => interpolate(item, values, document));
    return product.flatMap(item => isArray(item) ? item : [ item ]);
  }

  if (isObject(template)) {
    let pairs = _.toPairs(template);
    pairs = pairs.map((pair) => [pair[0], interpolate(pair[1], values, document)]);

    // check if the whole object needs replacing
    let first = pairs[0][0];
    if (first == "type")
      first = template[first];
    if (first == 'param') {
      const paramkey = pairs[0][1];
      if (has(values, paramkey)) {
        return values[paramkey];
      } else if (!isNull(document) && document.hasVar(paramkey)) {
        return document.getVar(paramkey);
      }
    } else if (first == 'item' && has(values, 'item') && !isEmpty(values.item)) {
      return values.item;
    }

    const obj = _.fromPairs(pairs);
    return obj;
  }

  return template;
};


export function replaceColours(str, documentColour, accentColour, highContrast) {
  str = str.replace(/#[0-9a-fA-F]{6}/g, (c) => adjustColour(c, documentColour, highContrast));
  str = str.replace(/%23[0-9a-fA-F]{6}/g, (c) => {
    c = c.replace('%23', '#');
    c = adjustColour(c, documentColour, highContrast);
    c = c.replace('#', '%23');
    return c;
  });
  str = str.replace(/rgba\(.*?,.*?,.*?,(.*?)\)/g, (c) => adjustColour(c, documentColour, highContrast));
  str = str.replace(/--c-accent/g, accentColour);
  str = str.replace(/="#([0-9a-fA-F]{6})"/g, '="%23$1"');
  return str;
}

export function adjustColourRGBA(c, opacity, highContrast) {
  let col2 = color(this.adjustColour(c, highContrast));
  col2.fade(opacity);
  return col2.rgba();
}

export function adjustColour(c, documentColour, highContrast) {
  try {
    const base = color(c);
    let col = color(documentColour);

    const lmin = 16;
    let lightness = base.lightness();
    if (highContrast) {
      if (lightness < 50) {
        lightness = lightness * 0.8;
      }
    }
    if (lightness < lmin) lightness = lmin;
    col = col.lightness(lightness);

    // reduce the saturation of mid-lightness colours so they don't look too odd
    // enhance the saturation of dark colours so they don't fade away
    const nd = 24;
    const nmid = 50;
    const nlow = nmid - nd;
    const nhigh = nmid + nd;
    const f = 1.3;

    let saturation = col.saturationl();
    saturation = saturation + 10;
    if (lightness > nlow && lightness <= nmid) {
      const diff = lightness - nlow;
      saturation -= diff * f;
    } else if (lightness > nmid && lightness < nhigh) {
      const diff = nhigh - lightness;
      saturation -= diff * f;
    }
    if (saturation < 0) saturation = 0;
    if (saturation > 100) saturation = 100;
    col = col.saturationl(saturation);

    // readjust the opacity
    const alpha = base.alpha();
    col.alpha(alpha);

    if (alpha != 1) {
      const red = Math.round(col.red());
      const green = Math.round(col.green());
      const blue = Math.round(col.blue());
      const result = `rgba(${red},${green},${blue},${alpha})`;
      return result;
    }
    const result = col.hex();
    return result;
  } catch (x) {
    error('util', 'Colour error:', x, x.stack);
    return c;
  }
}

export function getLabelHeight(args) {
  if (isNull(args)) {
    return 1;
  }

  if (has(args, 'labelHeight')) {
    return args.labelHeight;
  }
  if (has(args, 'context') && args.context !== null && has(args.context, 'labelHeight')) {
    return args.context.labelHeight;
  }

  switch (args.type) {
    case 'field': {
      switch (args.frame) {
        case 'none':
        case 'left':
        case 'right':
        case 'h-label':
        case 'circle':
          return 0;

        default: {
          const labelHeight = args.label ? args.label.split(/\n/).length : 0;
          const legendHeight = args.legend ? args.legend.split(/\n/).length : 0;
          return Math.max(labelHeight, legendHeight, 0);
        }
      }
    }

    case 'calc': {
      let height = getLabelHeight(args.output);
      args.inputs.forEach((field) => {
        const h = getLabelHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'row': {
      let height = 0;
      args.contents.forEach((field) => {
        const h = getLabelHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'g': {
      const height = getLabelHeight(args.contents[0]);
      return height;
    }
  }
  return 0;
};

export function getRubyHeight(args) {
  if (isNull(args)) {
    return 0;
  }

  switch (args.type) {
    case 'ruby': {
      const rubyHeight = args.ruby.split(/\n/).length;
      return rubyHeight;
    }

    case 'field': {
      return 0;
    }

    case 'calc': {
      let height = getRubyHeight(args.output);
      args.inputs.forEach((field) => {
        const h = getRubyHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'row': {
      let height = 0;
      args.contents.forEach((field) => {
        const h = getRubyHeight(field);
        if (h > height) {
          height = h;
        }
      });
      return height;
    }

    case 'g': {
      const height = getRubyHeight(args.contents[0]);
      return height;
    }
  }
  return 0;
}
