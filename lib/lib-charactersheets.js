'use strict';

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var fs$1 = require('fs');

require('colors');

function log(area, message) {
  var _console;

  var prefix = "[".concat(area, "] ").padEnd(16).cyan;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  (_console = console).log.apply(_console, ["".concat(prefix).concat(message)].concat(args));
}

function warn$1(area, message) {
  var _console2;

  var prefix = "[".concat(area, "] ").padEnd(16).yellow;

  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  (_console2 = console).log.apply(_console2, ["".concat(prefix).concat(message)].concat(args));
}

function error$1(area, message) {
  var _console3;

  var prefix = "[".concat(area, "] ").padEnd(16).red.bold;

  for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  (_console3 = console).log.apply(_console3, ["".concat(prefix).concat(message)].concat(args));
}

function trace(registry, area, message) {
  var _console4;

  // log("log", "Registry", registry);
  var prefix = "[".concat(area, "] ").padEnd(16).yellow;
  var trace = JSON.stringify(registry.stack, function (key, value) {
    if (value === undefined) {
      return '<undefined>';
    }

    return value;
  });

  for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
    args[_key4 - 3] = arguments[_key4];
  }

  (_console4 = console).log.apply(_console4, ["".concat(prefix).concat(trace, "\n                ").concat(message)].concat(args));
} // Polyfills
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

    padString = String(typeof padString !== 'undefined' ? padString : ' ');

    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;

      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }

      return String(this) + padString.slice(0, targetLength);
    }
  };
} // From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js


if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function value(searchElement, fromIndex) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

      var len = o.length >>> 0; // 3. If len is 0, return false.

      if (len === 0) {
        return false;
      } // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)


      var n = fromIndex | 0; // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.

      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
      } // 7. Repeat, while k < len


      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }

        k++;
      } // 8. Return false


      return false;
    }
  });
}

if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
  };
} // identity functions


function isNull(val) {
  return val === null || val === undefined;
}

function isBoolean(val) {
  return val === true || val === false;
}

function isNumber(val) {
  return Number.isFinite(val);
}

function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

function isArray(val) {
  return Array.isArray(val);
}

function isObject(val) {
  return val instanceof Object;
}

function isEmpty$1(val) {
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
    return !Object.entries(val || {}).length;
  }

  return false;
} // coerce


function toBoolean(value) {
  if (value === true || value === false) {
    return value;
  }

  if (value === null || value === undefined) {
    return false;
  }

  if (value == "yes" || value == "true") {
    return true;
  }

  if (value == "no" || value == "false") {
    return false;
  }

  return !!value;
}

function has(container, property) {
  if (isNull(container)) return false;
  return Object.prototype.hasOwnProperty.call(container, property) && !isNull(container[property]);
}

function clone(original) {
  if (isNull(original)) {
    return null;
  }

  if (isArray(original)) {
    return _toConsumableArray(original);
  }

  if (isObject(original)) {
    return _objectSpread({}, original);
  }

  return original;
}

function cloneDeep(original) {
  if (isNull(original)) {
    return null;
  }

  if (isArray(original)) {
    var product = [];

    for (var i = 0; i < original.length; ++i) {
      product.push(cloneDeep(original[i]));
    }

    return product;
  }

  if (isObject(original)) {
    var _product = {};

    for (var key in original) {
      _product[cloneDeep(key)] = cloneDeep(original[key]);
    }

    return _product;
  }

  return original;
}

function interpolate(template, values) {
  var document = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (isNull(template)) {
    return null;
  }

  if (isString(template)) {
    return template.replace(/#\{(.*?)\}/g, function (tag) {
      var match = tag.match(/#\{(.*?)\}/);
      var index = match[1];

      if (has(values, index)) {
        return values[index];
      } else if (!isNull(document) && document.hasVar(index)) {
        return document.getVar(index, 'string');
      }

      return match[0];
    });
  }

  if (isArray(template)) {
    var product = template.map(function (item) {
      return interpolate(item, values, document);
    });
    return product.flatMap(function (item) {
      return isArray(item) ? item : [item];
    });
  }

  if (isObject(template)) {
    // replace all the values
    var keys = Object.keys(template);
    var obj = {};
    keys.forEach(function (key) {
      obj[key] = interpolate(template[key], values, document);
    }); // check if the whole object needs replacing

    var first = keys[0];
    if (first == "type") first = template[first];

    if (first == 'param') {
      var paramkey = pairs[0][1];

      if (has(values, paramkey)) {
        return values[paramkey];
      } else if (!isNull(document) && document.hasVar(paramkey)) {
        return document.getVar(paramkey);
      }
    } else if (first == 'item' && has(values, 'item') && !isEmpty$1(values.item)) {
      // log("util", "Interpolate: item", values.item);
      return values.item;
    }

    return obj;
  }

  return template;
}

function embed(contents) {
  if (isArray(contents)) {
    if (contents.length == 1) {
      return contents[0];
    } else {
      return {
        type: 'g',
        contents: contents
      };
    }
  }

  if (isObject(contents) && has(contents, "type")) {
    return contents;
  }

  warn("util", "Embed: unknown element!", contents);
  return contents;
}

function pickMods(args, keys) {
  var mods = [];
  Object.keys(args).forEach(function (k) {
    var v = args[k];

    if (isString(v)) {
      v = v.replace(/#\{.*?\}/g, '');
    }

    if (v && keys.includes(k) && !isEmpty$1(v) && v != 'false') {
      mods.push(k);
    }
  });
  return mods;
}

function pickAttribs(args, keys) {
  var picked = {};
  keys.forEach(function (key) {
    if (has(args, key)) {
      picked[key] = clone(args[key]);
    }
  });
  return picked;
}

function elementID(element) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (id === null || id == '' || id == 'null') {
    return '';
  }

  return " id='".concat(element, "-").concat(id, "'");
}

function elementName(element, id) {
  var subid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (isEmpty$1(id)) {
    return '';
  }

  var name = id;

  if (!isEmpty$1(element)) {
    name = "".concat(element, "-").concat(id);
  }

  if (!isEmpty$1(subid)) {
    name = "".concat(name, "__").concat(subid);
  }

  return " name='".concat(name, "'");
}

function elementClass(block) {
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var modKeys = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var attribDefs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var cls = [];
  var prefix = isNull(element) ? block : "".concat(block, "__").concat(element); // built-in elements don't need to repeat that in their class

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
    case 'tr':
    case 'td':
    case 'p':
    case 'span':
    case 'b':
    case 'i':
    case 'ul':
    case 'li':
      break;

    default:
      cls.push(prefix);
  } // mods are single-word adjectives, eg


  var mods = pickMods(args, modKeys);
  mods.forEach(function (mod) {
    switch (mod) {
      // global mods that don't need a prefix
      case 'shade':
      case 'lp':
      case 'optional':
      case 'blk':
      case 'unblk':
      case 'pad':
        cls.push(mod);
        break;

      default:
        cls.push("".concat(prefix, "--").concat(mod));
    }
  }); // attribs are key-values, eg align=left

  var attribKeys;

  if (isArray(attribDefs)) {
    attribKeys = attribDefs;
    attribDefs = {};
  } else {
    attribKeys = Object.keys(attribDefs);
  }

  var attribs = pickAttribs(args, attribKeys);
  Object.entries(attribs).forEach(function (pair) {
    var key = pair[0];
    var value = pair[1];

    if (isEmpty$1(value)) {
      return;
    }

    if (has(attribDefs, key) && value == attribDefs[key]) {
      return;
    }

    var values = ("" + value).split(/ +/);
    values.forEach(function (value) {
      if (isEmpty$1(value)) {
        return;
      }

      switch (key) {
        // global attributes that don't need a prefix
        case 'align':
        case 'valign':
        case 'lp':
        case 'rb':
        case 'icon':
        case 'size':
        case 'flex':
          cls.push("".concat(key, "_").concat(value));
          break;

        default:
          cls.push("".concat(prefix, "--").concat(key, "_").concat(value));
          break;
      }
    });
  }); // the class attr, if needed

  if (isEmpty$1(cls)) {
    return '';
  }

  return " class='".concat(cls.join(' '), "'");
}

function mergeBottom(element) {
  var allItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (isArray(element)) {
    if (allItems) {
      element.forEach(function (e) {
        e['merge-bottom'] = true;
      });
    } else {
      element[element.length - 1] = mergeBottom(element[element.length - 1]);
    }
  } else if (_typeof(element) == 'object') {
    switch (element.type) {
      // horizontal elements don't
      case 'calc':
        element.inputs.forEach(function (e) {
          e['merge-bottom'] = true;
        });
        break;

      case 'table':
        element.rows = mergeBottom(element.rows);
        break;

      case 'row':
      case 'td':
        element.contents.forEach(function (e) {
          e['merge-bottom'] = true;
        });
        break;

      case 'tr':
        element.cells.forEach(function (e) {
          e['merge-bottom'] = true;
        });
        break;

      case 'field':
        element['merge-bottom'] = true;
        break;

      case 'list':
      default:
        element.contents = mergeBottom(element.contents);
    }
  }

  return element;
}

function getLabelHeight(args) {
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
    case 'field':
      {
        switch (args.frame) {
          case 'none':
          case 'left':
          case 'right':
          case 'h-label':
          case 'circle':
            return 0;

          default:
            {
              var labelHeight = args.label ? args.label.split(/\n/).length : 0;
              var legendHeight = args.legend ? args.legend.split(/\n/).length : 0;
              return Math.max(labelHeight, legendHeight, 0);
            }
        }
      }

    case 'calc':
      {
        var height = getLabelHeight(args.output);
        args.inputs.forEach(function (field) {
          var h = getLabelHeight(field);

          if (h > height) {
            height = h;
          }
        });
        return height;
      }

    case 'row':
      {
        var _height = 0;
        args.contents.forEach(function (field) {
          var h = getLabelHeight(field);

          if (h > _height) {
            _height = h;
          }
        });
        return _height;
      }

    case 'g':
      {
        var _height2 = getLabelHeight(args.contents[0]);

        return _height2;
      }
  }

  return 0;
}

function getRubyHeight(args) {
  if (isNull(args)) {
    return 0;
  }

  switch (args.type) {
    case 'ruby':
      {
        var rubyHeight = args.ruby.split(/\n/).length;
        return rubyHeight;
      }

    case 'field':
      {
        var _ruby = 0;

        if (args.border == "multi") {
          args.parts.forEach(function (part) {
            if (part.ruby) {
              var _rubyHeight = part.ruby.split(/\n/).length;
              if (_rubyHeight > _ruby) _ruby = _rubyHeight;
            }
          });
        }

        if (args.ruby) {
          var _rubyHeight2 = args.ruby.split(/\n/).length;
          if (_rubyHeight2 > _ruby) _ruby = _rubyHeight2;
        }

        return _ruby;
      }

    case 'calc':
      {
        var height = getRubyHeight(args.output);
        args.inputs.forEach(function (field) {
          var h = getRubyHeight(field);

          if (h > height) {
            height = h;
          }
        });
        return height;
      }

    case 'row':
      {
        var _height3 = 0;
        args.contents.forEach(function (field) {
          var h = getRubyHeight(field);

          if (h > _height3) {
            _height3 = h;
          }
        });
        return _height3;
      }

    case 'g':
      {
        var _height4 = getRubyHeight(args.contents[0]);

        return _height4;
      }
  }

  return 0;
}

var unit = {
  name: 'unit',
  key: 'unit-type',
  defaults: {
    'unit-type': 'class',
    'group': '',
    'id': '',
    'inc': []
  }
};
var action = {
  name: 'action',
  key: 'action',
  defaults: {
    action: 1,
    id: false,
    blk: false,
    order: 1,
    contents: []
  },
  transform: function transform(args) {
    var icon = 'action';
    var layout = 'indent-l';

    switch (args.action) {
      case 1:
        icon = 'action';
        break;

      case 2:
        icon = 'action2';
        break;

      case 3:
        icon = 'action3';
        layout = 'indent-lw';
        break;

      case 13:
      case "13":
        icon = 'action13';
        layout = 'indent-lw';
        break;

      case '2nd':
        icon = 'action2nd';
        break;

      case '3rd':
        icon = 'action3rd';
        layout = 'indent-lw';
        break;

      case 'reaction':
        icon = 'reaction';
        break;

      case 'free':
        icon = 'free-action';
        break;

      case 'template':
        icon = 'action-template';
        layout = 'indent-lw';
        break;
    }

    var iconPart = {
      type: "g",
      contents: [{
        type: "icon",
        icon: icon
      }]
    };

    if (args.action == "template") {
      iconPart = {
        type: "field",
        id: args.id + "-action",
        control: "action-icon",
        value: 'template',
        frame: "none"
      };
    }

    return [{
      type: "layout",
      layout: layout,
      blk: args.blk,
      order: args.order,
      contents: [iconPart, {
        type: "g",
        contents: args.contents
      }]
    }];
  }
};
var selectable = {
  name: 'selectable',
  key: 'id',
  defaults: {
    id: '',
    blk: false,
    max: 1,
    pad: false,
    selected: false,
    style: '',
    radio: false,
    order: null,
    contents: []
  },
  transform: function transform(args) {
    var checkboxes = [];

    if (args.max > 1) {
      var depth = args.max > 6 ? 3 : args.max > 2 ? 2 : 1;
      checkboxes = [{
        type: "field",
        id: args.id,
        control: 'checkgrid',
        frame: 'none',
        max: args.max,
        depth: depth,
        direction: "vertical",
        value: args.selected,
        style: args.style
      }]; // for (let i = 1; i <= args.max; i++) {
      //   checkboxes.push({
      //     type: "field",
      //     id: args.id+"-"+i,
      //     control: args.radio ? 'radio' : 'checkbox',
      //     frame: 'none',
      //     value: args.selected,
      //     style: args.style
      //   });
      // }
    } else {
      checkboxes = [{
        type: "field",
        id: args.id,
        control: args.radio ? 'radio' : 'checkbox',
        frame: 'none',
        value: args.selected,
        style: args.style
      }];
    }

    return [{
      type: "layout",
      layout: "indent-l",
      blk: args.blk,
      order: args.order,
      contents: [{
        type: "g",
        contents: checkboxes
      }, {
        type: "g",
        pad: args.pad,
        contents: args.contents
      }]
    }];
  }
}; // Convert string case

function splitAnyCase(str) {
  if (!isString(str)) {
    warn("util", "Not a string", str);
    return [];
  }

  var words = str.split(/[ _/-]+/);
  words = words.flatMap(function (word) {
    return word.split(/([A-Z][a-z]+)/);
  });
  words = words.map(function (word) {
    return word.toLowerCase();
  });
  words = words.filter(function (word) {
    return word != '';
  });
  return words;
}

function toKebabCase(str) {
  // convert-a-string-to-kebab-case
  var words = splitAnyCase(str);
  return words.join('-');
}

function toCamelCase(str) {
  // convertAStringToCamelCase
  var words = splitAnyCase(str);
  words = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
  words[0] = words[0].toLowerCase();
  return words.join('');
}

var advancement = {
  name: 'advancement',
  key: 'id',
  defaults: {
    id: "advancement",
    title: "_{Advancement}",
    start: 1,
    end: 20,
    zebra: true,
    shade: true,
    elide: false,
    flip: false,
    rotate: false,
    advances: [],
    index: "_{Level}",
    labels: [],
    fields: []
  },
  transform: function transform(args, ctx) {
    var table_id = isEmpty$1(args.id) ? 'advancement' : args.id; // log("advancement", "Advances", args.advances);
    // collect items by level

    var itemsByLevel = {};

    for (var lv = 1; lv <= 20; lv++) {
      itemsByLevel[lv] = [];
    }

    args.advances.forEach(function (advance) {
      // log("advancement", "Advance", advance);
      var levels = advance.levels;
      delete advance.levels;

      if (isEmpty$1(levels) && has(advance, "level")) {
        if (isArray(advance.level)) levels = advance.level;else levels = [advance.level];
        delete advance.level;
      }

      if (isEmpty$1(levels)) {
        warn$1("advancement", "Cannot place advancement", advance);
        return;
      }

      var keys = Object.keys(advance); // log("advancement", "Placing keys", keys);

      keys.forEach(function (key) {
        if (!isArray(advance[key]) || key == "contents") {
          advance[key] = Array(levels.length).fill(advance[key]);
        }
      }); // log("advancement", "Placing", levels, advance);

      levels.forEach(function (level, i) {
        var item = {
          level: level
        };
        keys.forEach(function (key) {
          item[key] = advance[key][i];
        });
        if (!has(itemsByLevel, level)) warn$1("advancement", "Unknown level:", level);
        itemsByLevel[level].push(cloneDeep(item));
      });
    });
    var has_labels = false;
    var rows = [];

    var _loop = function _loop(_lv) {
      var flags = {};
      var advances = [];
      var gains = [];
      var contents = [];
      var icons = [];
      var proficiencyAdvances = {
        trained: [],
        expert: [],
        master: [],
        legendary: []
      };
      var iconItems = [];

      itemsByLevel[_lv].forEach(function (item) {
        Object.assign(flags, item);

        if (has(item, "advance")) {
          if (has(item, "proficiency")) {
            proficiencyAdvances[item.proficiency].push(item.advance);
          } else if (has(item, "icon")) {
            iconItems.push({
              type: "p",
              blk: false,
              content: item.advance,
              icon: item.icon
            });
          } else {
            advances.push(item.advance);
            has_labels = true;
          }
        } else if (has(item, "gain")) {
          gains.push(item.gain);
          has_labels = true;
        }

        if (has(item, "contents")) {
          var rowContents = cloneDeep(item.contents);
          log("advancement", "Item contents at level ".concat(_lv), rowContents);
          if (!isArray(rowContents)) rowContents = [rowContents];
          rowContents = interpolate(rowContents, {
            level: _lv
          });
          contents = [].concat(_toConsumableArray(contents), _toConsumableArray(rowContents));
        } // if (has(item, "icon")) {
        //   icons.push(item.icon);
        //   has_icons = true;
        // }

      });

      delete flags.level;
      delete flags.label;
      delete flags.advance;
      delete flags.gain;
      delete flags.type;
      var proficiencyItems = [];
      ["trained", "expert", "master", "legendary"].forEach(function (tier) {
        if (!isEmpty$1(proficiencyAdvances[tier])) {
          proficiencyItems.push({
            type: "p",
            // title: tier.charAt(0).toUpperCase() + tier.slice(1),
            blk: false,
            content: proficiencyAdvances[tier].join(", "),
            icon: "proficiency-" + tier
          });
        }
      });
      var items = [];

      if (!isEmpty$1(gains)) {
        gains = gains.map(function (gain) {
          var slug = gain.replace(/_\{(.*?)\}/g, '$1');
          slug = "gain-".concat(_lv, "-").concat(toKebabCase(slug));
          return {
            type: "field",
            id: slug,
            control: "checkbox",
            frame: "right",
            label: gain,
            align: "left"
          };
        });
        items.push({
          type: "row",
          wrap: true,
          blk: false,
          contents: gains
        });
      }

      if (!isEmpty$1(advances)) {
        items.push({
          type: "p",
          blk: false,
          content: advances.join(", ")
        });
      }

      if (args.elide && isEmpty$1(icons) && isEmpty$1(items) && isEmpty$1(flags)) {
        return "continue";
      }

      rows.push(_objectSpread(_objectSpread({}, flags), {}, {
        level: _lv,
        icon: icons.join(","),
        item: {
          type: "g",
          contents: [].concat(proficiencyItems, iconItems, items, _toConsumableArray(contents))
        }
      }));
    };

    for (var _lv = 1; _lv <= 20; _lv++) {
      var _ret = _loop(_lv);

      if (_ret === "continue") continue;
    } // allocate cells and columns


    var columns = [{
      type: "label",
      label: args.index,
      rotate: args.flip ^ args.rotate,
      valign: "middle"
    }];
    var template = [{
      type: "level-marker",
      marker: '',
      level: '#{level}'
    }];

    if (has_labels) {
      columns.push({
        type: "label",
        label: args.title,
        rotate: args.flip ^ args.rotate,
        align: "left",
        valign: "bottom"
      }); // template.push({
      //   type: "p",
      //   content: "#{advance}",
      //   align: "left"
      // });

      template.push({
        type: "item"
      });
    } // identify columns
    // cast shade


    var sh = true;
    args.fields.forEach(function (field) {
      if (!has(field, "name")) return;
      field.shade = args.shade && sh;
      sh = !sh;
      columns.push({
        type: "label",
        label: field.name,
        rotate: args.flip ^ args.rotate,
        align: "center",
        valign: "bottom",
        shade: field.shade
      });
      var format = has(field, "format") ? field.format : 'checkbox';

      switch (format) {
        case 'checkbox':
          template.push({
            type: "field",
            id: table_id + '-#{level}-' + field.key,
            frame: "none",
            control: "checkbox",
            // width: "small",
            exists: "#{" + field.key + "}",
            shade: field.shade
          });
          break;

        case 'checkgrid':
          // log("advancement", `Checkgrid: label = ${field.label}, max = ${field.max}`);
          template.push({
            type: "field",
            id: table_id + '-#{level}-' + field.key,
            frame: "left",
            label: field.label,
            control: "checkgrid",
            depth: 'auto',
            max: field.max,
            shade: field.shade
          });
          break;

        case 'string':
          template.push({
            type: "span",
            content: "#{" + field.key + "}",
            shade: field.shade
          });
          break;

        default:
          template.push({
            type: "nothing",
            shade: field.shade
          });
      }
    }); // log("advancement", "Column", columns);
    // log("advancement", "Rows", rows);
    // log("advancement", "Template", template);

    var table = {
      id: args.id,
      type: 'table',
      zebra: args.zebra,
      flip: args.flip,
      collapse: true,
      narrow: true,
      rows: rows,
      columns: columns,
      template: template,
      td_valign: 'middle',
      blk: false
    }; // log("advancement", "Table", table);

    return [table];
  }
};
var translatorCallbacks = [];

function translate(str, doc) {
  if (str == "") {
    return "";
  }

  var language = doc.language;
  var meta = {};

  var _iterator = _createForOfIteratorHelper(translatorCallbacks),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var callback = _step.value;
      var translation = callback(str, language, meta);

      if (!isNull(translation)) {
        return translation;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return str;
}

function addTranslator(callback) {
  translatorCallbacks.push(callback);
}

function __(str, doc) {
  if (isNumber(str)) {
    str = "" + str;
  }

  if (!isString(str)) {
    error$1("i18n", "Not a string:", str);

    if (isBoolean(str)) {
      return translate(str ? "true" : "false", doc);
    }

    if (isNumber(str)) {
      return "" + str;
    }

    throw new Error("Not a string");
  }

  return str.replace(/_\{([\s\S]*?(#\{[\s\S]*?\}[\s\S]*?)*)\}/g, function (m, p) {
    return translate(p, doc);
  });
}

function _e(str, doc) {
  return esc(__(str, doc), true, true);
} // Escape strings for HTML


function esc(content) {
  var newlines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var bbformat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  content = content.replace(/#{.*?}/g, ''); // content = _.escape(content);

  content = content.replace(/’/g, '&rsquo;').replace(/‘/g, '&lsquo;');
  content = content.replace(/—/g, '&mdash;');
  content = content.replace(/&amp;(.+);/, '&$1;');

  if (newlines) {
    content = content.replace(/[\n\r]+/g, '<br>');
  }

  if (bbformat) {
    content = format_string(content);
  }

  return content;
}

function format_string(content) {
  content = content.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
  content = content.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
  return content;
}

function parsePO(data) {
  if (isNull(data)) {
    warn("i18n");
    return {};
  }

  var trans = {};
  var lines = data.split(/\n/);
  var current_msgid = "";
  var current_msgstr = "";
  var current_msgctxt = "";
  var lastLine = "";

  function submit() {
    if (current_msgstr != "") {
      trans[current_msgid] = current_msgstr;
    } // reset for the next message


    current_msgid = "";
    current_msgstr = "";
    current_msgctxt = "";
    lastLine = "";
  }

  lines.forEach(function (line) {
    if (line.match(/^#/)) return;
    var msgid = line.match(/^msgid \"(.*)\"/);

    if (msgid) {
      submit();
      lastLine = "msgid";
      current_msgid = msgid[1];
    }

    var msgstr = line.match(/^msgstr \"(.*)\"/);

    if (msgstr) {
      lastLine = "msgstr";
      current_msgstr = msgstr[1];
    }

    var msgctx = line.match(/^msgctxt \"(.*)\"/);

    if (msgctx) {
      lastLine = "msgctxt";
      current_msgctxt = msgctxt[1];
    }

    var contstr = line.match(/^\"(.*)\"/);

    if (contstr) {
      switch (lastLine) {
        case "msgid":
          current_msgid = current_msgid + "\n" + contstr[1];
          break;

        case "msgstr":
          current_msgstr = current_msgstr + "\n" + contstr[1];
          break;

        case "msgctxt":
          current_msgctxt = current_msgctxt + "\n" + contstr[1];
          break;
      }
    }
  });
  submit();
  return trans;
}

function addTranslationData(lang, data) {
  var translations = parsePO(data);
  addTranslator(function (str, language, meta) {
    if (language != lang) {
      return null;
    }

    if (has(translations, str)) {
      return translations[str];
    }

    return null;
  });
  return Object.keys(translations).length;
}

function loadTranslations(lang) {
  var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var isDefault = true;

  if (isNull(filename)) {
    filename = __dirname + '/i18n/' + lang + '.po';
    isDefault = false;
  }

  return new Promise(function (resolve, reject) {
    if (fs$1.existsSync(filename)) {
      fs$1.readFile(filename, 'utf-8', function (err, data) {
        var num = addTranslationData(lang, data);

        if (isDefault) {
          log("i18n", "Loaded ".concat(num, " translations for ").concat(lang));
        } else {
          log("i18n", "Loaded ".concat(num, " translations for ").concat(lang), filename);
        }

        resolve();
      });
    } else {
      warn("i18n", "File not found:", filename);
      resolve();
    }
  });
}

function loadDefaultTranslations() {
  return new Promise(function (resolve, reject) {
    fs$1.readdir(__dirname + "/i18n", function (err, files) {
      if (err) {
        reject();
        return;
      }

      var promises = [];
      files.forEach(function (file) {
        if (file.match(/\.po$/)) {
          var lang = file.replace(/\.po$/, '');
          var promise = loadTranslations(lang, __dirname + "/i18n/" + file);
          promises.push(promise);
        }
      });
      Promise.all(promises).then(resolve);
    });
  });
}

var article = {
  name: 'article',
  key: 'id',
  defaults: {
    id: '',
    title: false,
    header: [],
    'header-size': 'medium',
    contents: [],
    content: '',
    shade: false,
    'merge-bottom': true,
    blk: true,
    annotation: false,
    cat: false,
    level: false,
    'show-cat': false,
    'show-level': false,
    lines: 2,
    reduce: 1,
    left: false,
    right: false,
    action: false
  },
  transform: function transform(args, ctx) {
    var emptyHeader = false;

    if (isEmpty$1(args.header) || isEmpty$1(args.contents)) {
      var header = args.header;

      if (isEmpty$1(args.header)) {
        header = [];

        if (args.title) {
          header.push({
            type: 'h6',
            blk: false,
            title: args.title
          });
        } else {
          header.push({
            type: 'field',
            id: args.id,
            frame: 'none',
            align: 'left',
            format: 'string',
            size: args['header-size'],
            width: 'stretch'
          });
          emptyHeader = true;
        }

        if (args.cat || args['show-cat']) {
          emptyHeader = false;

          if (args.cat) {
            header.push({
              type: 'span',
              'article-cat': true,
              content: args.cat
            });
          } else {
            header.push({
              type: 'field',
              id: args.id + '-cat',
              frame: 'none',
              size: 'large',
              align: 'right',
              width: 'large'
            });
          }
        }

        if (args.level || args['show-level']) {
          emptyHeader = false;

          if (args.level) {
            header.push({
              type: 'level-marker',
              level: args.level,
              marker: false
            });
          } else {
            header.push({
              type: 'field',
              id: args.id + '-level',
              frame: 'none',
              border: 'heavy',
              size: 'large',
              width: 'small'
            });
          }
        }

        header = [{
          type: 'row',
          blk: false,
          contents: header
        }];
      }

      var contents = args.contents;

      if (isEmpty$1(args.contents)) {
        if (ctx.largePrint && args.lines > 1 && args.reduce > 0) {
          args.lines -= args.reduce;
        }

        contents = [];

        if (args.content) {
          contents.push({
            type: 'p',
            content: args.content
          });
        } else {
          contents.push({
            type: 'field',
            id: args.id + '-details',
            frame: 'none',
            align: 'left',
            format: 'string',
            repeat: args.lines,
            width: 'stretch',
            'merge-bottom': args['merge-bottom']
          });
        }
      }

      if (args.action && !args.left) {
        var icon;

        switch (args.action) {
          case 1:
            icon = 'action';
            break;

          case 'reaction':
            icon = 'reaction';
            break;

          case 'free':
            icon = 'free-action';
            break;

          case 'template':
            icon = 'action-template';
            break;

          default:
            icon = 'action' + args.action;
            break;
        }

        args.left = {
          type: 'icon',
          icon: icon
        }; // log("article", "Adding action:", args.action, args.left);
      }

      if (args.left || args.right) {
        var _layout = '';

        if (args.left && args.right) {
          _layout = 'indent-lr';
          contents = [embed(args.left), embed(contents), embed(args.right)];
        } else if (args.left) {
          _layout = 'indent-l';
          contents = [embed(args.left), embed(contents)];
        } else if (args.right) {
          _layout = 'indent-r';
          contents = [embed(contents), embed(args.right)];
        }

        contents = [{
          type: 'layout',
          layout: _layout,
          contents: contents
        }];
      }

      var _article = {
        type: 'article',
        id: args.id,
        header: header,
        contents: contents,
        shade: false,
        blk: args.blk,
        annotation: args.annotation,
        "no-header-line": args['no-header-line'] || emptyHeader,
        'merge-bottom': args['merge-bottom']
      };
      return [_article];
    }

    return false;
  },
  render: function render(args, reg, doc) {
    if (isEmpty$1(args.header) || args.header.length == 1 && args.header[0].type == 'field') args['no-header-line'] = true;
    var id = elementID('article', args.id);
    var cls = elementClass('article', null, args, ['shade', 'blk', 'no-header-line']);
    var annotation = args.annotation ? "<div class='article__annotation'>".concat(__(args.annotation, doc), "</div>") : '';
    var header = "<header>".concat(reg.render(args.header, doc), "</header>");
    var dl = ''; // const contents = mergeBottom(args.contents);

    return "<article".concat(id).concat(cls, ">\n      ").concat(annotation).concat(header).concat(dl, "\n      <div class='g'>").concat(reg.render(args.contents, doc), "</div>\n      </article>");
  }
};
var blockquote = {
  name: 'blockquote',
  defaults: {
    blk: true
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('blockquote', null, args, ['blk']);
    return "<blockquote>".concat(reg.render(args.contents, doc), "</blockquote>");
  }
};
var calc = {
  name: 'calc',
  // key: 'output',
  defaults: {
    output: {},
    outputs: [],
    layout: 'left',
    inline: false,
    inputs: [],
    blk: true,
    spacer: true
  },
  render: function render(args, reg, doc) {
    args.lp = getLabelHeight(args);
    args.rb = getRubyHeight(args);
    args.calc = true;
    var cls = elementClass('row', null, args, ["calc", "inline", "blk"], {
      'layout': 'center',
      'lp': '',
      'rb': ''
    }); // parts of the calculation
    // const outputPart = Object.assign({
    //   border: "full"
    // }, args.output);
    // log("-","Output:", output);

    var outputs = isEmpty$1(args.outputs) ? [args.output] : args.outputs;
    var outputParts = outputs.map(function (part) {
      if (isString(part)) {
        return {
          "type": "span",
          "content": part
        };
      }

      if (isObject(part)) {
        if (part.type == "field") {
          return _objectSpread({
            border: "full"
          }, part);
        }
      }

      return part;
    });
    var inputParts = args.inputs.map(function (part) {
      if (isString(part)) {
        return {
          "type": "span",
          "content": part
        };
      }

      return part;
    });
    var parts = [].concat(_toConsumableArray(outputParts), [{
      "type": "span",
      "content": "="
    }], _toConsumableArray(inputParts)); // log("-","Calculation contents", parts);
    // contextual args

    if (args.inline) args.field_frame = "inline";
    var spacer = args.spacer ? "<div class='spacer'></div>" : '';
    return "<div".concat(cls, "><div class='row__inner'>").concat(reg.render(parts, doc)).concat(spacer, "</div></div>");
  }
};
var class_icon = {
  name: 'class-icon',
  key: 'icon',
  defaults: {
    icon: '#{class-icon}',
    optional: true,
    size: 'medium'
  },
  render: function render(args, reg, doc) {
    args = interpolate(args, {}, doc);
    var cls = elementClass('class-icon', null, args, [], {
      'icon': '',
      'size': 'medium'
    });
    return "<div".concat(cls, "></div>");
  }
};
var color = {
  name: 'color',
  key: 'color',
  defaults: {
    color: 'base',
    blk: false,
    contents: []
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('color', null, args, ['blk'], {
      color: ''
    });
    return "<div".concat(cls, ">").concat(reg.render(args.contents, doc), "</div>");
  }
};
var dl = {
  name: 'dl',
  key: 'defs',
  defaults: {
    div: false,
    min: false,
    defs: {},
    blk: true
  },
  render: function render(args, reg, doc) {
    var defs = Object.keys(args.defs).map(function (term) {
      var termdef = args.defs[term];
      var icon = '';
      if (isEmpty$1(termdef)) return '';

      switch (term) {
        case 'cast':
          term = "_{Cast}";
          break;

        case 'trigger':
          term = "_{Trigger}";
          break;

        case 'frequency':
          term = "_{Frequency}";
          break;

        case 'duration':
          term = "_{Duration}";
          break;

        case 'range':
          term = "_{Range}";
          break;

        case 'target':
          term = "_{Target}";
          break;

        case 'area':
          term = "_{Area}";
          break;

        case 'save':
          term = "_{Saving Throw}";
          break;

        case 'critical_success':
          icon = 'save-crit-succeed';
          term = "_{Critical Success}";
          break;

        case 'success':
          icon = 'save-succeed';
          term = "_{Success}";
          break;

        case 'failure':
          icon = 'save-fail';
          term = "_{Failure}";
          break;

        case 'critical_failure':
          icon = 'save-crit-fail';
          term = "_{Critical Failure}";
          break;

        case 'sustain':
          term = "_{Sustain}";
          break;

        case 'requirement':
        case 'requirements':
          term = "_{Requirements}";
          break;
      }

      if (args.min) term = "";
      if (icon !== "") icon = "<i class='icon icon_".concat(icon, " size_small'></i>"); // log("p", "dl", term, termdef);

      return "<div><dt>".concat(icon).concat(_e(term, doc), "</dt><dd>").concat(_e(termdef, doc), "</dd></div> ");
    });
    var dlCls = elementClass('dl', null, args, ['div', 'blk']);
    return "<dl".concat(dlCls, ">").concat(defs.join(""), "</dl>");
  }
}; // import { log } from '../log';

var each = {
  name: 'each',
  key: '',
  defaults: {
    template: '',
    index: 'i',
    rows: [],
    params: {},
    map: {},
    contents: []
  },
  transform: function transform(args) {
    var i = 0; // log("each", "Items", args.contents);

    return args.contents.flatMap(function (item) {
      i++;
      var values = cloneDeep(args.params);
      if (i < args.rows.length && isObject(args.rows[i])) values = _objectSpread(_objectSpread({}, args.rows[i]), values);

      if (isString(item) && has(args.map, item)) {
        values = _objectSpread(_objectSpread(_objectSpread({}, args.map[item]), values), {}, {
          item: item
        });
      } else {
        values = _objectSpread(_objectSpread(_objectSpread({}, item), values), {}, {
          item: cloneDeep(item)
        });
      }

      values[args.index] = i; // log("each", "Template", args.template);
      // log("each", "Values", values);

      var product = interpolate(args.template, values); // log("each", "Product", values);

      return product;
    });
  }
};
var embed$1 = {
  name: 'embed',
  key: 'src',
  defaults: {
    src: '',
    contents: [],
    reverse: [],
    base: []
  },
  render: function render(args, reg, doc) {
    var contents = isEmpty$1(args.contents) ? '' : "<div class='embed__inner'>".concat(reg.render(args.contents, doc), "</div>");
    var reverse = isEmpty$1(args.reverse) ? '' : "<div class='embed__reverse'>".concat(reg.render(args.reverse, doc), "</div>");
    var base = isEmpty$1(args.base) ? '' : "<div class='embed__base'>".concat(reg.render(args.base, doc), "</div>");
    var baseRev = isEmpty$1(args.base) ? '' : "<div class='embed__base-reverse'>".concat(reg.render(args.base, doc), "</div>");
    args.src = interpolate(args.src, {}, doc);
    var cls = elementClass('embed', null, args, ['blk'], {
      'src': ''
    });
    return "<div".concat(cls, ">").concat(reverse).concat(contents).concat(base).concat(baseRev, "</div>");
  }
};
var flags = {
  name: 'flags',
  key: 'flags',
  defaults: {
    label: '',
    flags: [],
    sort: true,
    blk: true,
    content: ''
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('p', null, args, ['blk', 'flags'], {});
    var label = interpolate(args.label, {}, doc);
    var flags = args.flags;

    if (args.sort) {
      flags = flags.sort();
    }

    flags = flags.map(function (flag) {
      return {
        type: "span",
        content: flag
      };
    }); // log("p", "Content", content);

    return "<p".concat(cls, ">").concat(_e(label, doc)).concat(reg.render(flags, doc)).concat(_e(args.content, doc), "</p>");
  }
};
var flag = {
  name: 'flag',
  key: 'flag',
  defaults: {
    flag: ''
  },
  render: function render(args, reg, doc) {
    return reg.render({
      type: "span",
      flag: true,
      content: args.flag
    }, doc);
  }
};
var g = {
  name: 'g',
  key: '',
  defaults: {
    contents: [],
    galign: 'justify',
    valign: 'center',
    align: '',
    flex: 'medium',
    blk: false,
    pad: false,
    cut: 'none'
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('g', null, args, ['pad', 'blk'], {
      'galign': 'justify',
      'valign': 'center',
      'align': '',
      'flex': 'medium',
      'cut': 'none'
    });
    return "<div".concat(cls, ">").concat(reg.render(args.contents, doc), "</div>");
  }
};

function renderHeading(h) {
  return function (args, reg, doc) {
    // log("headings", "elementClass:", args);
    var cls = elementClass(h, null, args, ['fade', 'bold', 'blk', 'pad', 'nowrap'], {
      'align': '',
      'size': 'medium'
    });
    return "<".concat(h).concat(cls, ">").concat(_e(args.title, doc), "</").concat(h, ">");
  };
}

var h1 = {
  name: 'h1',
  key: 'title',
  defaults: {
    title: "",
    align: "",
    blk: true,
    size: 'medium'
  },
  render: renderHeading('h1')
};
var h2 = {
  name: 'h2',
  key: 'title',
  defaults: {
    title: "",
    align: "",
    blk: true,
    size: 'medium'
  },
  render: renderHeading('h2')
};
var h3 = {
  name: 'h3',
  key: 'title',
  defaults: {
    title: "",
    align: "",
    blk: true,
    size: 'medium'
  },
  render: renderHeading('h3')
};
var h4 = {
  name: 'h4',
  key: 'title',
  defaults: {
    title: "",
    align: "",
    blk: true,
    size: 'medium'
  },
  render: renderHeading('h4')
};
var h5 = {
  name: 'h5',
  key: 'title',
  defaults: {
    title: "",
    align: "",
    blk: true,
    size: 'medium'
  },
  render: renderHeading('h5')
};
var h6 = {
  name: 'h6',
  key: 'title',
  defaults: {
    title: "",
    align: "",
    blk: true,
    size: 'medium'
  },
  render: renderHeading('h6')
};
var class_name = {
  name: 'class-name',
  key: 'title',
  defaults: {
    title: '',
    preface: '',
    suffix: '',
    contents: [],
    flex: 'medium'
  },
  render: function render(args, reg, doc) {
    var preface = isEmpty$1(args.preface) ? '' : "<h5>".concat(_e(args.preface, doc), "</h5>");
    var name = "<h2>".concat(_e(args.title, doc), "</h2>");
    var suffix = isEmpty$1(args.suffix) ? '' : "<h5>".concat(_e(args.suffix, doc), "</h5>");
    var cls = elementClass('class-name', null, args, [], {
      flex: 'medium'
    });
    return "<div".concat(cls, ">").concat(preface).concat(name).concat(suffix).concat(reg.render(args.contents, doc), "</div>");
  }
};
var hr = {
  name: 'hr',
  defaults: {
    swash: false,
    dotted: false,
    light: false,
    blk: true
  },
  render: function render(args) {
    if (args.swash) {
      var _cls = elementClass('hr', null, args, ['swash', 'blk']);

      return "<div".concat(_cls, "><div class='inner'></div></div>");
    }

    var cls = elementClass('hr', null, args, ['swash', 'light', 'dotted', 'blk']);
    return "<hr".concat(cls, ">");
  }
};
var tail = {
  name: 'tail',
  defaults: {
    blk: true
  },
  render: function render(args) {
    args.tail = true;
    var cls = elementClass('hr', null, args, ['tail', 'blk']);
    return "<hr".concat(cls, ">");
  }
};
var vr = {
  name: 'vr',
  defaults: {
    dotted: false
  },
  render: function render(args) {
    var cls = elementClass('vr', null, args, ['dotted']);
    return "<span".concat(cls, "></span>");
  }
};
var icon = {
  name: 'icon',
  key: 'icon',
  defaults: {
    icon: "",
    size: "medium",
    width: ""
  },
  render: function render(args) {
    args.blk = true;
    var cls = elementClass('icon', null, args, ["blk"], {
      "icon": "",
      "size": "medium",
      "width": ""
    });
    return "<i".concat(cls, "></i>");
  }
};

function testCondition(condition, ctx) {
  // log("control", "if", args.condition);
  condition = interpolate(condition, {}, ctx);
  condition = condition.replace(/#\{.*?\}/g, ''); // conditions
  // log("control", "if condition:", condition);

  var m;

  if (m = condition.match(/(.*)==(.*)/)) {
    var left = m[1].trim();
    var right = m[2].trim();
    condition = left == right;
  } else if (m = condition.match(/(.*)!=(.*)/)) {
    var _left = m[1].trim();

    var _right = m[2].trim();

    condition = _left != _right;
  } else if (m = condition.match(/(.*)>=(.*)/)) {
    var _left2 = m[1].trim();

    var _right2 = m[2].trim();

    condition = _left2 >= _right2;
  } else if (m = condition.match(/(.*)>(.*)/)) {
    var _left3 = m[1].trim();

    var _right3 = m[2].trim();

    condition = _left3 > _right3;
  } else if (m = condition.match(/(.*)<=(.*)/)) {
    var _left4 = m[1].trim();

    var _right4 = m[2].trim();

    condition = _left4 <= _right4;
  } else if (m = condition.match(/(.*)<(.*)/)) {
    var _left5 = m[1].trim();

    var _right5 = m[2].trim();

    condition = _left5 < _right5;
  } else if (m = condition.match(/!(.*)/)) {
    var _value = m[1].trim();

    condition = !_value;
  } else {
    condition = condition.trim();
  } // log("control", "if: value:", condition);


  switch (condition) {
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

var ifelem = {
  name: 'if',
  key: 'condition',
  defaults: {
    condition: '',
    delay: false,
    then: [],
    else: []
  },
  transform: function transform(args, ctx) {
    if (args.delay) {
      return false;
    }

    var ok = testCondition(args.condition, ctx);

    if (ok) {
      return args.then;
    } else {
      return args.else;
    }
  },
  render: function render(args, reg, doc) {
    warn$1("if", "Late evaluation of if condition:", args.condition);
    var ok = testCondition(args.condition, doc);

    if (ok) {
      return reg.render(args.then, doc);
    } else {
      return reg.render(args.else, doc);
    }
  }
};
var label = {
  name: 'label',
  key: 'label',
  defaults: {
    label: "",
    rotate: false,
    align: "",
    nowrap: false,
    narrow: false
  },
  render: function render(args, reg, doc) {
    // log("label", "Args", args);
    var cls = elementClass('label', null, args, ["rotate", "nowrap", "narrow"], {
      "align": ""
    });
    return "<label".concat(cls, ">").concat(_e(args.label, doc), "</label>");
  }
};
var large_print = {
  name: 'large-print',
  key: 'contents',
  defaults: {
    'contents': [],
    'else': []
  },
  transform: function transform(args, ctx) {
    if (ctx.largePrint) {
      return args['contents'];
    } else {
      return args['else'];
    }
  }
};
var layout = {
  name: 'layout',
  key: 'layout',
  defaults: {
    layout: 'single',
    flex: false,
    columns: 0,
    gutter: 'medium',
    contents: [],
    blk: false,
    unblk: true,
    vr: false
  },
  render: function render(args, reg, doc) {
    // pick a column number
    var columns = args.columns;

    if (columns == 0) {
      switch (args.layout) {
        case '1n':
          columns = 1;
          break;

        case '2e':
        case '2l':
        case '2ll':
        case '2r':
        case '2rr':
        case 'alignment':
        case 'indent-l':
        case 'indent-r':
        case 'indent-lw':
        case 'indent-rw':
        case 'indent-ln':
        case 'indent-rn':
          columns = 2;
          break;

        case '3e':
        case 'indent-lr':
        case 'indent-lrw':
        case 'indent-lrn':
          columns = 3;
          break;

        case '4e':
          columns = 4;
          break;

        case '5e':
          columns = 5;
          break;

        case '6e':
          columns = 6;
          break;
      }
    }

    if (columns > 0 && args.contents.length > columns) {
      // log("layout", `Split: ${args.contents.length} items into ${columns} columns`);
      var items = [];

      for (var n = 0; n < args.contents.length; n += columns) {
        var _chunk = args.contents.slice(n, n + columns);

        items.push(_objectSpread(_objectSpread({}, args), {}, {
          contents: _chunk
        }));
      } // log("layout", "Split render", items);


      return reg.render(items, doc);
    } // wrap layout


    var contents = args.contents.map(function (elem) {
      return "<div class='layout__inner'>".concat(reg.render([elem], doc), "</div>");
    });
    var cls = elementClass('layout', null, args, ['no-flex', 'blk', 'unblk', 'vr'], {
      'layout': '',
      'gutter': '',
      'flex': false
    });
    return "<div".concat(cls, ">").concat(contents.join(''), "</div>");
  }
};
var place = {
  name: 'place',
  key: 'loc',
  defaults: {
    loc: 'middle',
    contents: []
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('layout', 'place', args, [], {
      'loc': ''
    });
    return "<div".concat(cls, ">").concat(reg.render(args.contents, doc), "</div>");
  }
};
var indent = {
  name: 'indent',
  key: 'layout',
  defaults: {
    layout: 'left',
    contents: []
  },
  transform: function transform(args, ctx) {
    var layout = args.layout;
    var contents = args.contents;

    switch (layout) {
      case null:
      case '':
      case 'left':
        layout = 'indent-l';
        contents = [{
          type: 'g'
        }, {
          type: 'g',
          contents: args.contents
        }];
        break;

      case 'right':
        layout = 'indent-r';
        contents = [{
          type: 'g',
          contents: args.contents
        }, {
          type: 'g'
        }];
        break;

      case 'both':
        layout = 'indent-lr';
        contents = [{
          type: 'g'
        }, {
          type: 'g',
          contents: args.contents
        }, {
          type: 'g'
        }];

      case false:
        return [{
          type: 'g',
          contents: contents
        }];
    } // log("layout", "Indent", args.layout, "=>", layout);


    return [{
      type: 'layout',
      layout: layout,
      contents: contents
    }];
  }
};
var level = {
  name: 'level',
  key: 'level',
  defaults: {
    level: 1,
    narrow: true,
    blk: false,
    marker: "_{Level}",
    contents: [],
    inline: false
  },
  transform: function transform(args) {
    var layout = "indent-l";

    if (args.inline) {
      layout = "indent-lw";
    }

    return [{
      type: "layout",
      layout: layout,
      blk: args.blk,
      contents: [{
        type: "g",
        contents: [{
          type: "level-marker",
          inline: args.inline,
          level: args.level,
          marker: args.marker
        }]
      }, {
        type: "g",
        contents: args.contents
      }]
    }];
  }
};
var level_marker = {
  name: 'level-marker',
  key: 'level',
  defaults: {
    level: 1,
    marker: "_{Level}",
    inline: false,
    blk: true
  },
  render: function render(args, reg, doc) {
    var level = ("" + args.level).replace(/^\s*/, '').replace(/\s*$/, '');

    if (level == "") {
      return "<div class='level-marker'></div>";
    }

    if (level == "_") {
      level = "&nbsp;";
    }

    var cls = elementClass("level-marker", null, args, ['inline', 'blk']);
    var marker = args.marker ? "<label>".concat(_e(args.marker, doc), "</label>") : '';
    return "<div".concat(cls, ">").concat(marker, "<div class='level-marker__level'>").concat(_e(level, doc), "</div></div>");
  }
};
var cost = {
  name: 'cost',
  key: 'cost',
  defaults: {
    cost: 1,
    unit: '',
    inline: false,
    blk: false
  },
  render: function render(args, reg, doc) {
    var cost = ("" + args.cost).replace(/^\s*/, '').replace(/\s*$/, '');

    if (cost == "") {
      return "<div class='level-marker'></div>";
    }

    if (cost == "_") {
      cost = "&nbsp;";
    }

    var cls = elementClass("level-marker", null, args, ['inline', 'blk', 'cost']);
    var unit = args.unit ? "<label>".concat(_e(args.unit, doc), "</label>") : '';
    return "<div".concat(cls, "><div class='level-marker__level'>").concat(_e(cost, doc), "</div>").concat(unit, "</div>");
  }
};
var list = {
  name: 'list',
  defaults: {
    contents: [],
    columns: 1,
    blk: false,
    flowv: true,
    zebra: false,
    'zebra-inverse': false,
    flex: false,
    sort: true,
    hr: false,
    vr: false,
    light: false,
    'merge-bottom': false,
    'avoid-shade': false,
    flatten: false,
    unblk: true,
    header: [],
    footer: []
  },
  render: function render(args, reg, doc) {
    if (isNull(args.contents)) {
      error$1("list", "No list contents", this);
    }

    if (args.zebra && args['avoid-shade']) {
      args['zebra-inverse'] = args.contents.length % 2 == 0; // } else if (isNumber(args['zebra-inverse']) || isString(args['zebra-inverse'])) {
      //   let zebraInverse = parseInt(args['zebra-inverse']);
      //   log("list", "Zebra inverse:", zebraInverse);
      //   args['zebra-inverse'] = (zebraInverse % 2 == 0);
    }

    var cls = elementClass('list', null, args, ["zebra", "zebra-inverse", "collapse", "vr", "hr", "light", "merge-bottom", "blk", "unblk"], {
      "flex": false
    });
    var header = isEmpty$1(args.contents) ? '' : reg.render(args.header, doc);
    var footer = isEmpty$1(args.contents) ? '' : reg.render(args.footer, doc);
    return "<div".concat(cls, ">").concat(header).concat(reg.render(args.contents, doc)).concat(footer, "</div>");
  },
  transform: function transform(args) {
    // transform columns into a grid of lists
    if (args.columns > 1) {
      var header = isEmpty$1(args.contents) ? [] : args.header;
      var footer = isEmpty$1(args.contents) ? [] : args.footer; // log("-",`[zone] Split into ${element.columns} columns`);
      // log("-",`[zone] Contents:`, element.contents);

      var cols = [];

      if (args.flowv) {
        for (var _i = 0; _i < args.columns; _i++) {
          cols.push([]);
        }

        var i = 0;
        args.contents.forEach(function (element) {
          cols[i].push(element);
          i++;
          if (i >= cols.length) i = 0;
        });
      } else {
        var split = Math.ceil((args.contents.length + 0.0) / (args.columns + 0.0)); // log("-",`[zone] Split every ${element.contents.length} / ${element.columns} = ${split} items`);

        for (var _i2 = 0; _i2 < args.columns; _i2++) {
          var contents = args.contents.slice(_i2 * split, (_i2 + 1) * split);
          cols.push(contents);
        }
      }

      return [].concat(_toConsumableArray(header), [{
        type: "layout",
        layout: args.columns + "e",
        flex: args.flex,
        gutter: args.gutter,
        blk: args.blk,
        'merge-bottom': args['merge-bottom'],
        contents: cols.map(function (col) {
          return _objectSpread(_objectSpread({}, args), {}, {
            header: [],
            columns: 1,
            contents: col
          });
        })
      }], _toConsumableArray(footer));
    } // flatten lists


    if (args.flatten) {
      var flattened = false;
      args.contents = args.contents.flatMap(function (item) {
        if (isObject(item) && has(item, "type") && item.type == "list") {
          flattened = true;
          return item.contents;
        }

        return [item];
      }); // log("list", "Flatten:", flattened);

      if (flattened) {
        return [args];
      }
    }

    return false;
  }
};
var join = {
  name: 'join',
  key: 'join',
  defaults: {
    contents: [],
    join: ''
  },
  transform: function transform(args) {
    var items = [];
    args.contents.forEach(function (item) {
      items.push({
        type: 'span',
        content: args.join
      });
      items.push(item);
    });
    items.shift();
    return items;
  }
};
var logelem = {
  name: 'log',
  key: 'message',
  defaults: {
    message: ''
  },
  transform: function transform(args, doc) {
    var message = interpolate(args.message, {}, doc);
    log("-", message);
    return [];
  }
};
var logo = {
  name: 'logo',
  key: 'source',
  defaults: {
    source: '',
    size: 'medium'
  },
  render: function render(args) {
    var cls = elementClass('logo', null, args, [], {
      'size': 'medium'
    });
    return "<h1".concat(cls, "></h1>");
  } // `<h1 class='logo'></h1>`

};
var lookup = {
  name: 'lookup',
  key: 'lookup',
  defaults: {
    lookup: {},
    contents: []
  },
  transform: function transform(args) {
    var lookup = args.lookup;

    if (isArray(lookup)) {
      lookup = lookup[0];
    } // log("lookup", "Lookup", lookup);
    // log("lookup", "Items", args.contents);


    return args.contents.flatMap(function (item) {
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
};
var nothing = {
  name: 'nothing',
  transform: function transform(args) {
    return [];
  }
};
var paizoCopyrightAttribution = "<div class='copyright-attribution'><p>\n<b>&copy; Marcus Downing &nbsp; <a href='https://www.dyslexic-charactersheets.com/'>dyslexic-charactersheets.com</a></b>\n<span>This character sheet uses trademarks and/or copyrights owned by Paizo Publishing, LLC, which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This character sheet is not published, endorsed, or specifically approved by Paizo Publishing. For more information about Paizo's Community Use Policy, please visit <a href='http://paizo.com/communityuse'>paizo.com/communityuse</a>. For more information about Paizo Publishing and Paizo products, please visit <a href='http://paizo.com'>paizo.com</a>.</span>\n</p></div>";
var page = {
  name: 'page',
  key: 'id',
  defaults: {
    name: '',
    order: 10,
    numbered: true,
    flex: false,
    landscape: false,
    half: false,
    background: 'yes',
    fill: false,
    contents: []
  },
  render: function render(args, reg, doc) {
    // log("page", "Rendering page", args.id);
    if (has(args, 'no-bg') && args['no-bg']) args.background = 'no';
    var id = elementID('page', args.id);
    var cls = elementClass('page', null, args, ['flex', 'landscape', 'no-bg', 'fill']);
    var pageNumber = args.numbered ? "<div class='page__number'>".concat(doc.nextPageNumber(), "</div>") : '';
    var copyrightAttribution = paizoCopyrightAttribution;
    if (args.id == 'permission') copyrightAttribution = '';
    var background = '';

    switch (args.background) {
      case 'yes':
        background = "<div class='page__background'></div>";
        break;

      case 'no':
        break;

      default:
        background = "<div class='page__background page__background--background_".concat(args.background, "'></div>");
    }

    var fill = '';

    if (args.fill) {
      fill = "<div class='page__fill page__fill--fill_".concat(args.fill, "'></div>");
    }

    var watermark = doc.watermark ? "<div class='page__watermark'><div class='page__watermark__inner'>".concat(doc.watermark, "</div></div>") : '';
    return "<div".concat(id).concat(cls, ">").concat(background).concat(fill, "\n      ").concat(copyrightAttribution).concat(pageNumber).concat(watermark, "\n      <div class='page__contents'>").concat(reg.render(args.contents, doc), "</div>\n      </div>\n      ");
  }
}; // combine pages

var collate_pages = {
  name: 'collate-pages',
  defaults: {
    contents: []
  },
  transform: function transform(args) {
    var pages = args.contents; // log("page", "Collate", pages);

    var out = [];

    for (var i = 0; i < pages.length; i++) {
      var _page = pages[i];

      if (has(_page, "half") && _page.half) {
        // log("page", "Collate: half page", page.id);
        var nextPage = pages[i + 1];
        var id = _page.id;
        var name = _page.name;
        var replacement = [embed(_page.contents)];

        if (has(nextPage, "half") && nextPage.half) {
          // log("page", "Collate: next page", nextPage.id);
          replacement.push(embed(nextPage.contents));
          id = "".concat(id, "+").concat(nextPage.id);
          name = "".concat(name, " + ").concat(nextPage.name);
          i++;
        }

        out.push({
          type: 'page',
          order: _page.order,
          id: id,
          name: name,
          numbered: _page.numbered,
          flex: true,
          landscape: true,
          half: false,
          contents: [{
            type: 'layout',
            layout: '2e',
            contents: replacement
          }]
        });
      } else {
        // log("page", "Collate: full page", page.id);
        out.push(_page);
      }
    }

    return out;
  }
};
var p = {
  name: 'p',
  key: 'content',
  defaults: {
    prose: false,
    title: '',
    flags: [],
    content: '',
    align: 'left',
    icon: false,
    blk: true,
    nowrap: false,
    size: 'medium',
    columns: 1
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('p', null, args, ['blk', 'nowrap', 'icon', 'optional'], {
      'align': 'left',
      'size': 'medium'
    }); // let paras = args.content.split(/[\n\r]/);

    var icon = args.icon ? reg.renderItem({
      type: 'icon',
      icon: args.icon,
      size: 'small'
    }, doc) : '';
    var content = interpolate(args.content, {}, doc);

    if (args.prose) {
      // log("p", "Prose content", content);
      var paras = __(content).split("\n").map(function (p) {
        return p.trim();
      }).filter(function (p) {
        return p != "";
      });

      if (paras.length == 0) {
        return "";
      } // log("p", "Prose paras", paras);


      var _title = args.title != '' ? "<span class='p__title'>".concat(_e(args.title, doc), "</span>") : '';

      var firstpara = paras.shift();
      firstpara = "<p".concat(cls, "><span class='p__inner'>").concat(icon, "<span class='p__content'>").concat(_title).concat(esc(firstpara), "</span></span></p>");
      paras = paras.map(function (p) {
        return "<p".concat(cls, ">").concat(esc(p), "</p>");
      });
      paras = [firstpara].concat(_toConsumableArray(paras));
      var prosecls = elementClass('prose', null, args, ['blk'], {
        'columns': 1
      });
      return "<div".concat(prosecls, "><div class='prose__inner'>").concat(paras.join(""), "</div></div>");
    }

    var title = args.title != '' ? "<span class='p__title'>".concat(_e(args.title, doc), "</span> ") : ''; // log("p", "Content", content);

    return "<p".concat(cls, "><span class='p__inner'>").concat(icon, "<span class='p__content'>").concat(title).concat(_e(content, doc), "</span><span></p>");
  }
};
var portrait = {
  name: 'portrait',
  key: 'char',
  defaults: {
    overprint: false,
    char: 'personal',
    copyright: true
  },
  render: function render(args, reg, doc) {
    // TODO get the right copyright attribution from the data
    var copyright = "Image &copy; Paizo Publishing";
    var caption = args.copyright ? "<figcaption>".concat(__(copyright, doc), "</figcaption>") : '';
    var cls = elementClass('portrait', null, args, ['overprint'], {
      'char': ''
    });
    return "<figure".concat(cls, "><div class='portrait__inner'></div>").concat(caption, "</figure>");
  }
};
var proficiency = {
  name: 'proficiency',
  key: 'proficiency',
  defaults: {
    proficiency: "untrained",
    content: false,
    contents: []
  },
  transform: function transform(args) {
    if (args.proficiency === null) args.proficiency = "untrained";
    var icon = args.proficiency == "untrained" ? "proficiency" : "proficiency-" + args.proficiency;
    var contents = args.content ? {
      type: "p",
      content: args.content
    } : {
      type: "g",
      contents: args.contents
    };
    return [{
      type: "layout",
      layout: "indent-l",
      contents: [{
        type: "icon",
        icon: icon
      }, contents]
    }];
  }
};
var repeat = {
  name: 'repeat',
  key: 'repeat',
  defaults: {
    repeat: 0,
    reduce: 0,
    contents: [],
    index: "i",
    start: 1,
    "merge-bottom": false,
    rows: []
  },
  transform: function transform(args, ctx) {
    var contents = [];
    var repeat = parseInt(args.repeat);

    if (!repeat) {
      if (!isEmpty$1(args.rows)) repeat = args.rows.length;else repeat = 1;
    }

    if (ctx.largePrint && args.reduce > 0) repeat -= parseInt(args.reduce);
    var start = parseInt(args.start);
    var end = start + repeat;

    for (var i = start; i < end; i++) {
      var vars = {};

      if (i <= args.rows.length) {
        vars = args.rows[i - 1];
      }

      vars[args.index] = i;
      var items = interpolate(args.contents, vars);
      contents = contents.concat(items);
    }

    if (toBoolean(args["merge-bottom"])) {
      contents[contents.length - 1]["merge-bottom"] = true;
    }

    return contents;
  }
};
var row = {
  name: 'row',
  key: 'layout',
  defaults: {
    contents: [],
    layout: 'left',
    valign: 'bottom',
    unlabelled: false,
    narrow: false,
    wrap: false,
    blk: true
  },
  render: function render(args, reg, doc) {
    // args.lp = getLabelHeight(args);
    args.rb = getRubyHeight(args);
    var cls = elementClass('row', null, args, ['unlabelled', 'narrow', 'blk', 'pad', 'wrap'], {
      'layout': 'left',
      'valign': 'bottom',
      'rb': '',
      'flex': 'medium'
    });
    return "<div".concat(cls, "><div class='row__inner'>").concat(reg.render(args.contents, doc), "</div></div>");
  }
};
var ruby = {
  name: 'ruby',
  key: 'ruby',
  defaults: {
    ruby: '',
    contents: [],
    align: 'center'
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('ruby', null, args, [], {
      'align': 'center'
    });
    return "<div".concat(cls, "><label class='ruby__text'>").concat(_e(args.ruby, doc), "</label>").concat(reg.render(args.contents, doc), "</div>");
  }
};
var ruby_round_down = {
  name: 'ruby-round-down',
  defaults: {
    contents: []
  },
  transform: function transform(args) {
    return [{
      type: 'ruby',
      ruby: '_{(Round down)}',
      contents: args.contents
    }];
  }
};
var ruby_round_up = {
  name: 'ruby-round-up',
  defaults: {
    contents: []
  },
  transform: function transform(args) {
    return [{
      type: 'ruby',
      ruby: '[b]_{(Round up)}[/b]',
      contents: args.contents
    }];
  }
};
var section = {
  name: 'section',
  key: 'title',
  defaults: {
    title: '',
    id: '',
    fill: false,
    flex: 'medium',
    untitled: false,
    contents: [],
    icon: false,
    mark: false
  },
  render: function render(args, reg, doc) {
    var id = elementID('section', args.id);
    var cls = elementClass('section', null, args, ['primary', 'fill', 'untitled', 'mark'], {
      flex: 'medium'
    });
    var icon = args.icon ? "<i class='icon icon_".concat(args.icon, "'></i>") : '';
    var title = args.untitled ? '' : "<h3>".concat(icon).concat(_e(args.title, doc), "</h3>");
    var mark = args.mark ? "<i class='mark icon_".concat(args.mark, "'></i>") : '';
    var content = "<div class='section__inner'>".concat(mark).concat(reg.render(args.contents, doc), "</div>");
    return "<section".concat(id).concat(cls, ">").concat(title, "\n            ").concat(content, "\n            </section>");
  }
};
var sort = {
  name: 'sort',
  key: 'orderby',
  defaults: {
    orderby: '',
    order: 'ASC',
    unique: false,
    contents: []
  },
  transform: function transform(args, ctx) {
    var key = args.orderby; // log("sort", `Sorting ${args.contents.length} items by ${key}`);
    // log("sort", JSON.stringify(args.contents, null, 2));

    var defaultValue = false;

    if (args.orderby == 'level' || args.orderby == 'order') {
      defaultValue = 1;
    }

    var contents = args.contents;

    if (args.unique) {
      contents = _toConsumableArray(new Set(contents));
    }

    contents = contents.sort(function (a, b) {
      var ka = isString(a) ? a : has(a, key) ? a[key] : defaultValue;
      var kb = isString(b) ? b : has(b, key) ? b[key] : defaultValue;
      if (!ka && !kb) return 0;
      if (!ka) return 1;
      if (!kb) return -1; // log("sort", `Compare: "${ka}" <> "${kb}"`);

      if (isNumber(ka) || isNumber(kb)) return ka - kb;
      return ka.localeCompare(kb, ctx.locale, {
        sensitivity: 'base',
        ignorePunctuation: true
      });
    });

    if (args.order == 'DESC') {
      contents = contents.reverse();
    } // log("sort", "Sorted items", contents);


    return contents;
  }
}; // import { mergeBottom } from '../classes/Registry';

var slots = {
  name: 'slots',
  key: 'slots',
  defaults: {
    slots: [],
    key: 'level',
    placeholder: null,
    max: false,
    min: false,
    reduce: 0,
    extra: 0,
    index: 'i',
    even: false,
    contents: []
  },
  transform: function transform(args, ctx) {
    // log("slots", "Args slots:", args.slots);
    var placeholder = args.placeholder;
    if (!isArray(placeholder)) placeholder = [placeholder];

    if (ctx.largePrint && args.reduce > 0) {
      args.min -= args.reduce;
      args.max -= args.reduce;
    }

    function slotItems(items, slotValues) {
      // log("slots", "Slot items", items, slotValues);
      if (args.min && items.length < args.min) {
        var n = args.min - items.length;

        for (var _i3 = 0; _i3 < n; _i3++) {
          var values = cloneDeep(slotValues);
          values[args.index] = _i3; // log("slots", "Placeholder slot", values);

          var _placeholder = interpolate(cloneDeep(args.placeholder), values);

          items = items.concat(_placeholder);
        }
      }

      if (args.max && items.length > args.max) {
        items = items.slice(0, args.max);
      }

      return items;
    }

    if (args.slots === null || args.slots == []) {
      // log("slots","Single slot");
      var _contents = slotItems(args.contents, {});

      if (args['merge-bottom']) {
        _contents = mergeBottom(_contents);
      }

      return _contents;
    }

    var slots = {};

    if (!isArray(args.slots)) {
      if (isString(args.slots)) {
        args.slots = args.slots.split(/,/);
      } else {
        warn$1("slots", "Not a list of slots:", args.slots);
      }
    }

    var i = 1;
    args.slots.forEach(function (s) {
      slots[s] = {
        key: s,
        contents: []
      };
      slots[s][args.key] = s;
      slots[s][args.index] = i++;
    }); // log("slots","Filled", slots);

    args.contents.forEach(function (item) {
      if (!has(item, args.key)) return;

      if (has(slots, item[args.key])) {
        slots[item[args.key]].contents.push(item);
      }
    });

    var _loop2 = function _loop2() {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i4], 2),
          n = _Object$entries$_i[0],
          s = _Object$entries$_i[1];

      // log("slots","Slot", s.key);
      s.contents = slotItems(s.contents, s);
      s.contents.forEach(function (item) {
        return item[args.key] = s.key;
      }); // log("slots","Slot", s.key, "items", s.contents);
    };

    for (var _i4 = 0, _Object$entries = Object.entries(slots); _i4 < _Object$entries.length; _i4++) {
      _loop2();
    } // log("slots", "Final slots:", JSON.stringify(slots, null, 2));


    var contents = Object.values(slots).flatMap(function (s) {
      return s.contents;
    }); //let blank = {};
    //blank[args.key] = '';

    var blank = _defineProperty({}, args.key, ''); // 'extra' slots: add a fixed number of placeholders


    for (var j = 0; j < args.extra; j++) {
      var values = cloneDeep(blank);
      values[args.index] = 'extra-' + i++;
      log("slots", "Extra slots", values);
      var add = cloneDeep(args.placeholder);
      add = interpolate(add, values);
      contents = contents.concat(add);
    } // 'balance' slot: if the list isn't even, add one more to balance them up


    if (args.even && contents.length % 2 != 0) {
      var _values = cloneDeep(blank);

      _values[args.index] = 'extra-' + i++;
      log("slots", "Balance slot", _values);

      var _add = cloneDeep(args.placeholder);

      _add = interpolate(_add, _values);
      contents = contents.concat(_add);
    } // log("slots", contents);


    if (args['merge-bottom']) {
      contents = mergeBottom(contents);
    }

    return contents;
  }
};
var spacer = {
  name: 'spacer',
  defaults: {
    flex: 'medium'
  },
  render: function render(args) {
    var cls = elementClass('spacer', null, args, [], {
      flex: 'medium'
    });
    return "<div".concat(cls, "></div>");
  }
};
var span = {
  name: 'span',
  key: 'content',
  defaults: {
    content: '',
    'field-separator': false,
    'article-cat': false,
    value: false,
    size: 'medium'
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('span', null, args, ['field-separator', 'article-cat', 'value'], {
      'size': 'medium'
    });
    return "<span".concat(cls, ">").concat(_e(args.content, doc), "</span>");
  }
};

function spellField(lvl, style, checks, n, annotation, value) {
  // log("spells", `Spell field: level = ${lvl}, style = ${style}, n = ${n}`);
  var frame = "none";
  var label = null; // let border = "bottom";

  if (annotation) {
    frame = "annotation";
    label = annotation; // border = "full";
    // log("spells", "Annotation", annotation);
  }

  switch (style) {
    case 'prepared':
      var checkboxes = [];

      for (var i = 0; i < checks; i++) {
        checkboxes.push({
          control: "checkbox",
          id: "spells-level-".concat(lvl, "-").concat(n, "-").concat(i)
        });
      }

      return {
        type: "field",
        id: "spells-level-".concat(lvl, "-").concat(n),
        frame: frame,
        label: label,
        align: 'left',
        width: 'stretch',
        // border: border,
        control: "compound",
        parts: [].concat(checkboxes, [{
          control: "input",
          width: 'stretch',
          value: value
        }])
      };

    case 'spontaneous':
      return {
        type: "field",
        id: "spells-level-".concat(lvl, "-").concat(n),
        frame: frame,
        label: label,
        // border: border,
        value: value,
        width: "stretch"
      };

    default:
      warn("spells", "Unknown style", style);
      return {};
  }
}

function spellLevel(lvl, ord, style, checks, slots, special, special_value) {
  // log("spells", "Spell level:", lvl);
  var level_marker = {
    type: "level-marker",
    level: ord,
    marker: ''
  }; // number of spells

  var fields = [];

  if (special) {
    if (isString(special)) {
      // log("spells", "Adding special entry", special);
      special = spellField(lvl, style, checks, "special", special, special_value); // log("spells", "Special", special);
    }

    special = interpolate(special, {
      'level': lvl
    });
    if (isArray(special)) fields = special;else fields.push(special);
  }

  var n = parseInt(2 * Math.ceil((slots + fields.length) / 2.0)) - fields.length; // log("spells", `Adding up to ${n} spell fields`);

  for (var i = 1; i <= n; i++) {
    fields.push(spellField(lvl, style, checks, i, '', ''));
  } // log("spells", "Spell fields", fields);


  var left = [];
  var right = [];

  for (var _i5 = 0; _i5 < fields.length; _i5++) {
    left.push(fields[_i5]);
    _i5++;
    right.push(fields[_i5]);
  } // full level


  if (ord == "") {
    return {
      type: "layout",
      layout: "2e",
      narrow: true,
      contents: [{
        type: "list",
        collapse: true,
        "merge-bottom": true,
        contents: left
      }, {
        type: "list",
        collapse: true,
        "merge-bottom": true,
        marker: '',
        contents: right
      }]
    };
  }

  return {
    type: "layout",
    layout: "spells-list",
    narrow: true,
    contents: [{
      type: "list",
      collapse: true,
      "merge-bottom": true,
      contents: left
    }, level_marker, {
      type: "list",
      collapse: true,
      "merge-bottom": true,
      marker: '',
      contents: right
    }]
  };
}

function ordinal(number) {
  switch (number) {
    case 0:
      return '';

    case 1:
      return "_{1st}";

    case 2:
      return "_{2nd}";

    case 3:
      return "_{3rd}";

    case 4:
      return "_{4th}";

    case 5:
      return "_{5th}";

    case 6:
      return "_{6th}";

    case 7:
      return "_{7th}";

    case 8:
      return "_{8th}";

    case 9:
      return "_{9th}";

    case 10:
      return "_{10th}";
  }
}

var spells_bundle = {
  name: 'spells-bundle',
  defaults: {
    level: '',
    slots: 4,
    checks: 3,
    cantrips: false,
    style: "prepared"
  },
  transform: function transform(args, ctx) {
    return [spellLevel(args.level, args.level, args.style, args.checks, args.slots)];
  }
};
var spells_list = {
  name: 'spells-list',
  key: 'style',
  defaults: {
    min: 1,
    max: 9,
    spells: 4,
    cantrips: false,
    daily: false,
    special: false,
    "special-value": "",
    style: "prepared",
    checks: 3,
    ordinal: true
  },
  transform: function transform(args, ctx) {
    var min = args.min;
    var max = args.max; // number of spells at each level

    var slots = {};

    if (isArray(args.spells)) {
      var i = 0;

      for (var lvl = min; lvl <= max; lvl++) {
        slots[lvl] = args.spells[i++];
      }
    } else {
      for (var _lvl = min; _lvl <= max; _lvl++) {
        slots[_lvl] = args.spells;
      }
    } // objects to render


    var spell_levels = [];

    if (args.cantrips) {
      spell_levels.push(spellLevel(0, '', 'spontaneous', 1, args.cantrips, false));
    }

    for (var _lvl2 = min; _lvl2 <= max; _lvl2++) {
      var ord = args.ordinal ? ordinal(_lvl2) : _lvl2;
      var special_value = "";

      if (args.special && isArray(args["special-value"]) && args["special-value"].length > _lvl2 - args.max) {
        special_value = args["special-value"][_lvl2 - args.max];
      }

      spell_levels.push(spellLevel(_lvl2, ord, args.style, args.checks, slots[_lvl2], args.special, special_value));
    }

    return [{
      type: "list",
      hr: true,
      zebra: true,
      flex: args.flex,
      'avoid-shade': true,
      contents: spell_levels
    }];
  }
};
var spells_table = {
  name: 'spells-table',
  defaults: {
    min: 1,
    max: 9,
    'spells-per-day': true,
    'max-spells-per-day': 6,
    'spells-today': false,
    'expanded': false,
    ordinal: true,
    flip: false,
    pad: false,
    'merge-bottom': true,
    at: []
  },
  transform: function transform(args) {
    // log("-","[spells] Expanding spells table:", args);
    var rows = [];
    var columns = [];
    var template = []; // Rows

    for (var lvl = args.min; lvl <= args.max; lvl++) {
      var ord = args.ordinal && !args.flip ? ordinal(lvl) : lvl;
      rows.push({
        level: lvl,
        ordinal: ord
      });
    } // Spell Level


    columns.push("Spell\nLevel");
    template.push({
      type: "level-marker",
      level: "#{ordinal}",
      marker: ""
    }); // Spells per day

    if (args['spells-per-day']) {
      columns.push("_{Spells\nper day}");
      template.push({
        type: "field",
        id: "spells-#{level}-per-day",
        border: args.flip ? args['merge-bottom'] ? "right" : "bottom-right" : "bottom",
        frame: "none",
        width: args.flip ? "small" : "medium",
        'merge-right': true
      });
    }

    if (args['spells-today']) {
      columns.push("_{Spell\ntoday}");
      template.push({
        type: "field",
        id: "spells-#{level}-today",
        control: "checkgrid",
        max: args['max-spells-per-day'],
        depth: 'auto',
        frame: "none",
        at: args.at.map(function (item) {
          return {
            level: item.level,
            max: item['max-spells-per-day']
          };
        })
      });
    }

    if (args.expanded) {
      columns.push(args.expanded);
      template.push({
        type: "field",
        id: "spells-#{level}-expanded",
        width: "stretch",
        align: "left",
        frame: "none"
      });
    }

    if (args.flip) {
      columns = [];
    }

    var table = {
      type: "table",
      width: "stretch",
      collapse: true,
      flip: args.flip,
      rows: rows,
      columns: columns,
      template: template
    };
    table = Object.assign({}, args, table); // log("-","[spells] Expanded spells table:", table);

    if (args.pad) {
      table = {
        type: "g",
        pad: true,
        contents: [table]
      };
    }

    return [table];
  }
};
var spells_list2 = {
  name: 'spells-list2',
  defaults: {
    min: 1,
    max: 9,
    cantrips: 4,
    spells: 4,
    daily: false,
    special: false
  },
  transform: function transform(args) {
    var min = args.min;
    if (min < 0) min = 0;
    var max = args.max;
    if (max > 9) max = 9; // number of spells at each level
    // var slots = {};
    // if (isArray(args.spells)) {
    //     var i = 0;
    //     for (var lvl = min; lvl <= max; lvl++) {
    //         slots[lvl] = args.spells[i];
    //     }
    // } else {
    //     for (var lvl = min; lvl <= max; lvl++) {
    //         slots[lvl] = args.spells;
    //     }
    // }

    var spell_levels = [];
    spell_levels.push({
      type: "layout",
      layout: "2l",
      contents: [{
        type: "level",
        level: 2,
        marker: "Spell\nLevel",
        contents: [{
          type: "row",
          contents: [{
            type: "field",
            label: "Spells\nper day",
            frame: "none"
          }, {
            type: "field",
            label: "Spells\ntoday",
            frame: "none",
            control: "checkgrid",
            max: 4,
            depth: 2
          }, {
            type: "spacer"
          }]
        }]
      }, {
        type: "field",
        width: "stretch",
        repeat: args.spells,
        'merge-bottom': true,
        frame: 'none'
      }]
    });
    return [{
      type: "list",
      hr: true,
      zebra: true,
      'avoid-shade': true,
      contents: spell_levels
    }];
  }
}; // import { mergeBottom } from '../classes/Registry';
// Standard table

function renderTableBasic(args, reg, doc, headings, rows) {
  // headings
  var thead = '';

  if (!isNull(headings)) {
    var tcols = headings.map(function (col) {
      var colCls = elementClass('th', null, col, ['vr'], {
        'width': ''
      });
      var elem = reg.renderItem(col, doc);
      var colspan = has(col, "colspan") && col.colspan > 1 ? " colspan=\"".concat(col.colspan, "\"") : '';
      var rowspan = has(col, "rowspan") && col.rowspan > 1 ? " rowspan=\"".concat(col.rowspan, "\"") : '';
      return "<th".concat(colCls).concat(colspan).concat(rowspan, ">").concat(elem, "</th>");
    });
    thead = "<thead>".concat(tcols.join("\n"), "</thead>\n");
  } // take care of the 'hr'


  rows.forEach(function (row, i) {
    if (has(row.params, 'hr') && row.params.hr) {
      mergeBottom(rows[i - 1].cells, true);
    }
  });

  if (args['merge-bottom']) {
    mergeBottom(rows[rows.length - 1].cells, true);
  } // cells
  // log("table", "Rows", rows);


  var trows = rows.map(function (row) {
    if (!has(row, "cells")) {
      error("table-basic", "No cells in table row", row);
      return '';
    }

    var cells = row.cells.map(function (cell, h) {
      if (h < headings.length) {
        // if (has(headings[h], "shade") && headings[h].shade)
        //   cell.shade = true;
        // use object destructuring to extract fields from the heading
        var colFields = function (_ref) {
          var shade = _ref.shade,
              vr = _ref.vr;
          return {
            shade: shade,
            vr: vr
          };
        }(headings[h]);

        cell = _objectSpread(_objectSpread({}, colFields), cell);
      }

      var cellCls = elementClass('td', null, cell, ['shade', 'vr'], {
        'width': '',
        'align': '',
        'valign': 'bottom'
      });
      var colspan = has(cell, "colspan") && cell.colspan > 1 ? " colspan=\"".concat(cell.colspan, "\"") : '';
      var rowspan = has(cell, "rowspan") && cell.rowspan > 1 ? " rowspan=\"".concat(cell.rowspan, "\"") : '';
      return "<td".concat(cellCls).concat(colspan).concat(rowspan, ">").concat(reg.renderItem(cell, doc), "</td>");
    });
    var rowCls = elementClass('tr', null, row.params, ['hr']); // log("table", "Table row class", row, rowCls);

    return "<tr".concat(rowCls, ">").concat(cells.join("\n"), "</tr>\n");
  }); // put it all together

  var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed', 'blk'], ['width', 'layout']);
  return "<table".concat(cls, ">").concat(thead, "<tbody>").concat(trows.join("\n"), "</tbody></table>");
} // Column-oriented table


function renderTableFlipped(args, reg, doc, headings, cols) {
  // log("table", "Flipped", headings, cols);
  // find the size of the table and make an empty grid of cells
  var hasHeading = false;
  var ncols = cols.length;
  var nrows = 0;
  headings = headings.map(function (heading) {
    if (isNull(heading) || isString(heading) && heading == "" || isObject(heading) && heading.type == 'label' && isEmpty$1(heading.label)) {
      heading = {
        type: 'label',
        label: ''
      };
    } else {
      hasHeading = true;
    }

    if (!has(heading, "rowspan")) heading.rowspan = 1;
    nrows += heading.rowspan;
    return heading;
  });
  cols.forEach(function (col) {
    if (col.cells.length > nrows) nrows = col.cells.length;
  });
  if (hasHeading) ncols++; // log("table", `Table: ${nrows} rows, ${ncols} cols`);

  var cells = Array.from({
    length: nrows
  }, function (r) {
    return Array(ncols).fill(null);
  }); // log("table", "Cell grid:", cells);
  // fill the grid

  if (hasHeading) {
    // log("table", "Headings");
    var _row = 0;
    headings.forEach(function (heading) {
      cells[_row][0] = heading;
      _row += heading.rowspan;
    });
  }

  cols.forEach(function (col, c) {
    if (hasHeading) c++; // log("table", "Column", c, col);

    col.cells.forEach(function (cell, r) {
      // log("table", "Cell at:", r, c, "=", cell);
      cells[r][c] = cell;
    });
  }); // log("table", "Cells", cells);
  // render it

  var trows = cells.map(function (row) {
    var th = '';

    if (hasHeading) {
      var head = row.shift();
      var colspan = has(head, "colspan") && head.colspan > 1 ? " colspan=\"".concat(head.colspan, "\"") : '';
      var rowspan = has(head, "rowspan") && head.rowspan > 1 ? " rowspan=\"".concat(head.rowspan, "\"") : '';
      th = "<th scope=\"row\"".concat(colspan).concat(rowspan, ">").concat(isNull(head) ? '' : reg.renderItem(head, doc), "</th>");
    }

    var tds = row.map(function (elem) {
      var colspan = has(elem, "colspan") && elem.colspan > 1 ? " colspan=\"".concat(elem.colspan, "\"") : '';
      var rowspan = has(elem, "rowspan") && elem.rowspan > 1 ? " rowspan=\"".concat(elem.rowspan, "\"") : '';
      return "<td>".concat(isNull(elem) ? '' : reg.renderItem(elem, doc), "</td>");
    });
    return "<tr>".concat(th).concat(tds.join(""), "</tr>");
  }); // put it all together

  var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed', 'blk', 'flip'], ['width', 'layout']);
  return "<table".concat(cls, "><tbody>").concat(trows.join("\n"), "</tbody></table>");
} // import { renderTableGrid } from './table-grid';


var table = {
  name: 'table',
  key: 'id',
  defaults: {
    rows: [{}],
    columns: [],
    repeat: 1,
    reduce: 0,
    flip: false,
    template: [],
    width: '',
    blk: false,
    zebra: false,
    collapse: false,
    fixed: false,
    layout: false,
    'merge-bottom': false
  },
  transform: function transform(args, ctx) {
    if (has(args, "_direct") && args._direct) {
      return false;
    }

    if (!has(args, "template") && !has(args, "repeat")
    /*&& !has(args, "columns")*/
    && (!has(args, "reduce") || !args.reduce)) {
      return false;
    } // get headings


    if (ctx.largePrint || ctx.skipOptional) {
      args.columns = args.columns.filter(function (col) {
        return !(has(col, "optional") && col.optional);
      });
    }

    var headings = args.columns.map(function (col) {
      if (isNull(col)) {
        col = {
          type: 'label',
          label: ''
        };
      } else if (isString(col)) {
        col = {
          type: 'label',
          label: col,
          misc: col == "Misc"
        };
      }

      return col;
    });

    if (isEmpty$1(args.rows) || args.rows == []) {
      // log("table", "Filling in empty rows");
      args.rows = [{}];
    } // individual rows repeat


    var rows = args.rows;
    var hr = false;
    rows = rows.flatMap(function (row) {
      if (has(row, "hr") || has(row, "type") && row.type == "hr") {
        // log("table", "Found hr");
        hr = true;
        return [];
      }

      var repeat = has(row, "repeat") ? row.repeat : 1;
      if (ctx.largePrint && row.reduce > 0) repeat -= row.reduce;

      if (repeat > 1) {
        // log("table", `Repeating row ${rep} times:`, row);
        var reprows = Array.from({
          length: repeat
        }, function (e) {
          return _objectSpread({}, row);
        });

        if (hr) {
          // log("table", "Setting repeated row hr");
          reprows[0].hr = true;
          hr = false;
        }

        return reprows;
      }

      if (hr) {
        // log("table", "Setting row hr");
        row.hr = true;
        hr = false;
      }

      return [row];
    });

    if (ctx.largePrint) {
      rows = rows.filter(function (row) {
        return !(has(row, "optional") && row.optional);
      });
    } // repeat the whole set


    if (has(args, "repeat")) {
      var _repeat = args.repeat;
      if (ctx.largePrint && args.reduce > 0) rep -= args.reduce;

      if (args.repeat > 1) {
        var rows2 = Array(rows.length * _repeat);

        for (var i = 0; i < _repeat; i += rows.length) {
          for (var j = 0; j < rows.length; j++) {
            rows2[i + j] = cloneDeep(rows[j]);
          }
        }

        rows = rows2; // log("table", "Repeating row", args.repeat, "times:", rows);
      }
    } // number rows


    for (var _i6 = 0; _i6 < rows.length; _i6++) {
      if (!isObject(rows[_i6])) {
        warn$1("table", "Row is not an object", rows[_i6]);
      }

      rows[_i6].i = _i6 + 1;
    } // apply the row template


    if (isArray(args.template) && args.template.length > 0) {
      var templateCells = args.template.flatMap(function (cell) {
        if (isObject(cell) && has(cell, "type") && cell.type == "calc") {
          var fields = _toConsumableArray(cell.inputs);

          fields.unshift({
            type: "span",
            content: "="
          });

          var output = _objectSpread(_objectSpread({}, cell.output), {}, {
            output: true
          });

          fields.unshift(output);
          return fields;
        }

        return [cell];
      });
      rows = rows.map(function (row) {
        var cells = templateCells.map(function (cell, i) {
          // let params = {...args, ...row};
          // log("table", "Interpolating cell", cell, row);
          cell = interpolate(cell, row, ctx); // log("table", "Cell", cell);

          if (cell === null) {
            return null;
          } else {
            if (isString(cell)) cell = {
              type: "label",
              label: cell
            }; // log("-","Cell:", cell, "Row:", row);

            if (!has(cell, "type")) {
              return null;
            } // transform the cell
            // let replace = ctx.composeElement(cell, reg);
            // log("table", "Cell, composed", replace);
            // if (isEmpty(replace)) {
            //   cell = { type: 'g', contents: [] };
            // }
            // if (replace.length > 1) {
            //   cell = { type: 'g', contents: replace };
            // }
            // cell = replace[0];


            var levelat = {};

            if (has(row, "level") && has(cell, "at") && isArray(cell.at)) {
              var levelats = cell.at.filter(function (item) {
                return item.level == row.level;
              });

              if (!isEmpty$1(levelats)) {
                levelat = levelats[0];
                delete levelat.type;
                delete levelat.level; // log("table", "Found at level:", row.level, levelat);
              }
            }

            var col = _objectSpread(_objectSpread({}, headings[i]), {}, {
              label: '',
              legend: ''
            });

            delete col.icon;
            return _objectSpread(_objectSpread(_objectSpread({
              type: 'label',
              label: ''
            }, col), {}, {
              colspan: 1,
              rowspan: 1
            }, cell), levelat);
          }
        }); // apply transformations so the contents of cells can compose
        // cells = cells.map(cell => {
        //   let replace = ctx.composeElement(cell, reg);
        //   // log("table", "Cell, composed", replace);
        //   if (isEmpty(replace)) {
        //     return { type: 'g', contents: [] };
        //   }
        //   if (replace.length > 1) {
        //     return { type: 'g', contents: replace };
        //   }
        //   return replace[0];
        // });
        // cells = interpolate(cells, {...args, ...row}, ctx);
        // log("table", "Templated row cells", row, cells);

        return {
          params: row,
          cells: cells
        };
      });
    } else {
      rows = args.rows.map(function (row) {
        var cells = [];

        if (isArray(row)) {
          cells = row;
        } else if (isObject(row)) {
          if (has(row, "contents")) {
            cells = row.contents;
          }
        }

        cells = cells.map(function (cell) {
          if (isString(cell)) return {
            type: "label",
            label: cell
          };
          if (!has(cell, "type")) return null;
          return cell;
        });
        return {
          params: row,
          cells: cells
        };
      });
    } // apply transformations to cells
    // rows = rows.map(row => {
    //   row.cells = row.cells.map(cell => {
    //     let replace = doc.composeElement(cell, reg);
    //     // log("table", "Cell, composed", replace);
    //     if (isEmpty(replace)) {
    //       return { type: 'g', contents: [] };
    //     }
    //     if (replace.length > 1) {
    //       return { type: 'g', contents: replace };
    //     }
    //     return replace[0];
    //   });
    //   return row;
    // })
    // log("table", `${headings.length} columns, ${rows.length} rows`);


    return [{
      id: args.id,
      type: "table",
      rows: rows,
      flip: args.flip,
      width: args.width,
      blk: args.blk,
      'merge-bottom': args['merge-bottom'],
      zebra: args.zebra,
      collapse: args.collapse,
      fixed: args.fixed,
      layout: args.layout,
      _headings: headings,
      _direct: true
    }];
  },
  render: function render(args, reg, doc) {
    // render
    // return renderTableBasic(headings, rows);
    if (args.flip) {
      return renderTableFlipped(args, reg, doc, args._headings, args.rows);
    } else {
      return renderTableBasic(args, reg, doc, args._headings, args.rows);
    }
  }
};
var paste = {
  name: 'paste',
  key: 'template',
  defaults: {
    template: '',
    params: {},
    contents: []
  },
  transform: function transform(args, ctx) {
    // log("template", "Paste", args.template);
    if (!has(ctx.templates, args.template)) return [];
    var template = ctx.templates[args.template];
    if (isEmpty$1(template)) return []; // const params = { ...template.params, ...args.params, item: args.contents };
    // const item = {
    //   type: 'g',
    //   contents: cloneDeep(args.contents)
    // };

    var item = cloneDeep(args.contents);

    var params = _objectSpread(_objectSpread({
      item: item
    }, template.params), args.params);

    var contents = cloneDeep(template.contents); // log("template", "Paste", args.template, "template:", contents);
    // log("template", "Paste", args.template, "params:", params);

    contents = interpolate(contents, params);
    return contents;
  }
};
var copy = {
  name: 'copy',
  key: 'template',
  defaults: {
    template: '',
    alias: [],
    params: {},
    contents: []
  },
  transform: function transform(args, ctx) {
    log("template", "Copy template:", args.template);
    ctx.templates[args.template] = {
      params: args.params,
      contents: args.contents
    };
    args.alias.forEach(function (alias) {
      log("template", "Copy template alias:", args.template);
      ctx.templates[alias] = {
        params: args.params,
        contents: args.contents
      };
    });
    return [];
  }
};
var ul = {
  name: 'ul',
  key: 'contents',
  defaults: {
    blk: true,
    flags: false
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('ul', null, args, ['blk', 'flags']);
    return "<ul".concat(cls, ">").concat(reg.render(args.contents, doc), "</ul>");
  }
};
var li = {
  name: 'li',
  key: 'content',
  defaults: {
    content: '',
    contents: '',
    blk: true
  },
  render: function render(args, reg, doc) {
    if (isEmpty$1(args.contents) && !isEmpty$1(args.content)) {
      args.contents = [{
        type: "p",
        content: args.content
      }];
    }

    var cls = elementClass('li', null, args, ['blk']);
    return "<li".concat(cls, ">").concat(reg.render(args.contents, doc), "</li>");
  }
};
var zone = {
  name: 'zone',
  key: 'zone',
  defaults: {
    zone: '',
    sort: false
  },
  transform: function transform(args, ctx) {
    if (isNull(args.zone) || isEmpty$1(args.zone) || args.zone.charAt(0) != '@') {
      warn$1("zone", "Not a zone ID:", args.zone);
    } // log("zone", "Zone", args.zone);


    var existing = has(args, "contents") && args.contents ? args.contents : [];
    var insert = has(ctx.zones, args.zone) ? cloneDeep(ctx.zones[args.zone]) : [];
    var replace = insert.reduce(function (repl, element) {
      return repl || element.replace;
    }, false);

    if (replace) {
      existing = [];
    }

    var contents = existing.concat(insert); // const contents = [ ...existing, ...insert ];
    // log("-","[zone] Contents", contents);
    // sort the contents

    if (args.sort) {
      // log("-","[zone] Sorting");
      contents = contents.map(function (subelement) {
        return _objectSpread({
          level: 1,
          order: 1
        }, subelement);
      });
      contents = contents.sort(function (a, b) {
        if (a.level != b.level) return a.level - b.level;
        if (a.order != b.order) return a.order - b.order;
        if (a.primary && !b.primary) return -1;
        if (b.primary && !a.primary) return 1;
        return 0;
      });
    }

    return contents;
  }
}; // import { render, renderItem } from '../classes/Registry';

var field = {
  name: 'field',
  key: 'id',
  defaults: {
    frame: 'above',
    control: 'input',
    repeat: 1,
    reduce: 0,
    editable: true,
    flex: false,
    'merge-bottom': false,
    format: 'string',
    label: false,
    indent: false,
    value: null,
    blk: false,
    ruby: false,
    overprint: false,
    eq: false,
    ref: false
  },
  expect: ['icon'],
  // transform(args, ctx) {
  //   switch (args.type) {
  //     case 'compound':
  //     case 'progression':
  //       let modified = false;
  //       args.parts = args.parts.map(part => {
  //       });
  //       if (modified) {
  //         return args;
  //       }
  //       break;
  //   }
  //   return null;
  // },
  render: function render(args, reg, doc) {
    args = fieldDefaults(args, reg, doc);

    if (isNull(args.value)) {
      args.value = doc.getVar(args.id, args.format); // if (args.value) log("field", "Value:", args.id, "=", args.value);
    }

    if (args.ruby) {
      args.rb = getRubyHeight(args);
    } // if (args.eq || args.ref) {
    //   args.editable = false;
    // }


    if (isEmpty$1(args.id) && isEmpty$1(args.ref)) {
      trace(reg, "field", "No ID or reference", args);
    }

    var id = elementID('field', args.id);
    var name = elementName('field', args.id);
    var cls = elementClass('field', null, args, ["icon", "ref", "misc", "temp", "indent", "blk", "overprint", "no-icon-indent"], {
      "frame": "normal",
      "width": "",
      "align": "centre",
      "size": "medium",
      "control": "input",
      "shift": 0,
      "rb": 0,
      "border": "bottom",
      "flex": false
    });
    var frameArgs = Object.assign({}, args, {
      type: 'frame:' + args.frame
    });
    var frame = reg.renderItem(frameArgs, doc);
    var ruby = args.ruby ? "<label class='field__ruby-text'>".concat(_e(args.ruby, doc), "</label>") : '';
    return "<div".concat(id).concat(name).concat(cls, ">").concat(frame).concat(ruby, "</div>");
  }
}; // field defaults are a combination of the defaults from the field's frame and control

function fieldDefaults(args, reg, doc) {
  args = Object.assign({
    frame: 'above',
    control: 'input'
  }, args);
  var frame = reg.get('frame:' + args.frame);

  if (!frame) {
    args.frame = 'above';
    frame = reg.get('frame:above');
  }

  var control = reg.get('control:' + args.control);

  if (!control) {
    args.control = 'input';
    control = reg.get('control:input');
  }

  args = Object.assign({
    border: args.output ? 'full' : 'bottom',
    align: args.width == "stretch" ? "left" : "centre",
    width: "medium",
    icon: false
  }, control.defaults, frame.defaults, args); // Special fields

  if (args.control == "money") {
    args.width = "";
  }

  if (args.control == "proficiency" && !args['has-bonus']) {
    args.width = "tiny";
    args.border = "none";
    args.icon = false;
  }

  args = interpolate(args, {}, doc);
  return args;
}

function fieldIdent() {
  var fieldid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var partid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (fieldid == '' || fieldid === null) {
    return {
      id: '',
      name: '',
      for: '',
      ident: ''
    };
  }

  if (partid == '') {
    var _ident = " id='".concat(fieldid, "' name='").concat(fieldid, "'");

    var _forid = " for='".concat(fieldid, "'");

    return {
      id: fieldid,
      name: fieldid,
      for: _forid,
      ident: _ident
    };
  }

  var eid = fieldid + "--" + partid;
  var name = fieldid + '[' + partid + ']';
  var ident = " id='".concat(eid, "' name='").concat(name, "'");
  var forid = " for='".concat(eid, "'");
  return {
    id: eid,
    name: name,
    for: forid,
    ident: ident
  };
}

function fieldRadioIdent() {
  var fieldid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (fieldid == '') {
    return {
      id: '',
      name: '',
      for: '',
      ident: ''
    };
  }

  if (value == '') {
    return fieldIdent(fieldid);
  }

  var id = fieldid + '--' + value;
  var ident = " id='".concat(id, "' name='").concat(fieldid, "' value='").concat(value, "'");
  var forid = " for='".concat(id, "'");
  return {
    id: id,
    name: fieldid,
    for: forid,
    ident: ident
  };
}

function fieldInner(args, reg, doc, decoration) {
  args = Object.assign({}, args, {
    type: 'control:' + args.control
  });
  var icon = has(args, "icon") && !!args.icon && isString(args.icon) && args.control != "icon" ? "<i class='icon icon_".concat(args.icon, "'></i>") : '';
  var unit = has(args, "unit") && !!args.unit ? "<label class='field__unit'>".concat(__(args.unit, doc), "</label>") : '';
  var boxargs = {
    icon: args.icon,
    border: args.border
  };
  var merge_bottom = toBoolean(args['merge-bottom']);
  var inner;

  if (doc.largePrint && args.reduce > 0) {
    args.repeat -= args.reduce;
  }

  if (args.repeat > 1) {
    var boxes = [];
    var values = isArray(args.value) ? args.value : [args.value];

    for (var i = 0; i < args.repeat; i++) {
      var _value2 = i >= values.length ? null : values[i];

      var controlArgs = Object.assign({}, args, {
        value: _value2,
        id: "".concat(args.id, "[").concat(i + 1, "]")
      });
      var control = reg.renderItem(controlArgs, doc);
      if (i == args.repeat - 1 && merge_bottom && boxargs['border'] == 'bottom') boxargs['border'] = 'none';
      var boxcls = elementClass('field', 'box', boxargs, ["icon", "temp"], {
        "border": "bottom"
      });
      var box = "<div".concat(boxcls, ">").concat(icon).concat(control).concat(unit, "</div>");
      boxes.push(box);
    }

    inner = boxes.join("");
  } else if (args.border == 'multi') {
    var _boxes = [];

    var _values2 = isArray(args.value) ? args.value : [args.value];

    for (var _i7 = 0; _i7 < args.parts.length; _i7++) {
      var _value3 = _i7 >= _values2.length ? null : _values2[_i7];

      var part = args.parts[_i7];

      if (has(part, "type") && part.type != "field") {
        var item = reg.renderItem(part, doc);

        _boxes.push(item);

        continue;
      }

      var partArgs = _objectSpread(_objectSpread(_objectSpread({}, args), {}, {
        label: '',
        control: 'input',
        border: 'full',
        width: 'medium'
      }, part), {}, {
        value: _value3
      });

      partArgs = _objectSpread(_objectSpread({}, partArgs), {}, {
        type: 'control:' + partArgs.control
      });

      var _control = reg.renderItem(partArgs, doc);

      var _boxcls = elementClass('field', 'box', partArgs, ["temp"], {
        "border": "bottom"
      });

      var partUnit = has(partArgs, "unit") && !!args.unit ? "<label class='field__unit'>".concat(__(args.unit, doc), "</label>") : '';

      var _ruby2 = partArgs.ruby ? "<label class='field__ruby-text'>".concat(_e(partArgs.ruby, doc), "</label>") : '';

      var _box = "<div class='field__boxes__inner'><div".concat(_boxcls, ">").concat(_i7 == 0 ? icon : '').concat(_control).concat(partUnit, "</div>").concat(_ruby2, "</div>");

      _boxes.push(_box);
    }

    inner = "<div class='field__boxes'>".concat(_boxes.join(""), "</div>");
  } else {
    var _control2 = reg.renderItem(args, doc);

    if (merge_bottom && boxargs['border'] == 'bottom') boxargs['border'] = 'none';

    var _boxcls2 = elementClass('field', 'box', boxargs, ["icon", "temp"], {
      "border": "bottom"
    });

    inner = "<div".concat(_boxcls2, ">").concat(icon).concat(_control2).concat(unit, "</div>");
  }

  return inner;
}

function defaultFrameRender(args, reg, doc) {
  var ident = args.control == 'radio' ? fieldRadioIdent(args.id, args.value) : fieldIdent(args.id);
  var labelcls = elementClass('label', null, args, ["rotate", "nowrap"], {
    "align": ""
  });
  var label = args.label ? "<label".concat(labelcls).concat(ident.for, ">").concat(_e(args.label, doc), "</label>") : '';
  var legend = args.legend ? "<legend>".concat(_e(args.legend, doc), "</legend>") : '';
  var framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
  return "<div".concat(framecls, ">").concat(legend).concat(label).concat(fieldInner(args, reg, doc), "</div>");
} // Register the faux-elements


var field_frame_above = {
  name: 'frame:above',
  defaults: {
    label: false,
    legend: false
  },
  render: defaultFrameRender
};
var field_frame_left = {
  name: 'frame:left',
  defaults: {
    label: false,
    legend: false
  },
  render: defaultFrameRender
};
var field_frame_right = {
  name: 'frame:right',
  defaults: {
    label: false,
    legend: false
  },
  render: function render(args, reg, doc) {
    var ident = args.control == 'radio' ? fieldRadioIdent(args.id, args.value) : fieldIdent(args.id);
    var label = args.label ? "<label".concat(ident.for, ">").concat(_e(args.label, doc), "</label>") : '';
    var legend = args.legend ? "<legend>".concat(_e(args.legend, doc), "</legend>") : '';
    var framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return "<div".concat(framecls, ">").concat(fieldInner(args, reg, doc)).concat(legend).concat(label, "</div>");
  }
};
var field_frame_h_label = {
  name: 'frame:h-label',
  defaults: {
    label: false
  },
  render: function render(args, reg, doc) {
    var ident = fieldIdent(args.id);
    var label = args.label ? "<label class='field__h-label'".concat(ident.for, ">").concat(_e(args.label, doc), "</label>") : ''; // WRONG! The h-label is supposed to go inside the box!

    var framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return "<div".concat(framecls, ">").concat(label).concat(fieldInner(args, reg, doc), "</div>");
  }
};
var field_frame_none = {
  name: 'frame:none',
  render: function render(args, reg, doc) {
    var framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return "<div".concat(framecls, ">").concat(fieldInner(args, reg, doc), "</div>");
  }
};
var field_frame_annotation = {
  name: 'frame:annotation',
  render: function render(args, reg, doc) {
    var ident = fieldIdent(args.id);
    var label = args.label ? "<label class='field__annotation'".concat(ident.for, ">").concat(_e(args.label, doc), "</label>") : '';
    var framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return "<div".concat(framecls, ">").concat(label).concat(fieldInner(args, reg, doc), "</div>");
  }
};
var field_frame_circle = {
  name: 'frame:circle',
  defaults: {
    border: 'circle'
  },
  render: defaultFrameRender
};

function chunk(array, size) {
  var chunks = [];

  for (var i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

function defaultControlRender(args, reg, doc) {
  args = Object.assign({
    align: "center",
    width: "medium",
    editable: true,
    eq: null,
    prefix: false,
    suffix: false,
    underlay: false
  }, args);
  var ident = fieldIdent(args.id);
  var cls = elementClass("field", "control", args, ["damage-die"], {
    "align": "centre",
    "width": ""
  });
  var value = args.value == '' ? '' : " value='".concat(_e(args.value, doc), "'");
  var readonly = args.editable ? '' : ' readonly';
  var ref = args.ref ? " ref='".concat(args.ref, "'") : '';
  var input = "<input".concat(ident.ident).concat(ref).concat(value).concat(readonly, ">");
  var underlay = args.underlay ? "<u>".concat(__(args.underlay, doc), "</u>") : '';
  var prefix = args.prefix ? "<span class='field__overlay'>".concat(__(args.prefix, doc), "</span>") : '';
  var suffix = args.suffix ? "<span class='field__overlay'>".concat(__(args.suffix, doc), "</span>") : '';
  return "".concat(prefix, "<div").concat(cls, ">").concat(input).concat(underlay, "</div>").concat(suffix);
}

function renderCompoundControl(args, reg, doc) {
  var parts = args.parts;

  if (isNull(parts)) {
    error$1("field", "Compound control: no parts", args);
    return;
  }

  var i = 0;
  var outputParts = parts.map(function (part) {
    if (typeof part == 'string') return part;

    if (isArray(args.value) && args.value.length > i) {
      part.value = args.value[i];
    }

    i++;
    if (has(part, "type") && part.type != "field") return reg.renderItem(part, doc);
    part = fieldDefaults(part, reg);

    if (has(part, "subid")) {
      if (part.subid == "") {
        part.id = args.id;
      } else {
        part.id = args.id + "-" + part.subid;
      }
    }

    part.type = 'control:' + part.control;
    return reg.renderItem(part, doc);
  }); // log("control", "Parts:", outputParts);

  return outputParts.join("");
} // Register the faux-elements


var field_control_input = {
  name: 'control:input',
  defaults: {
    value: '',
    border: 'bottom',
    format: 'string'
  },
  render: defaultControlRender
};
var field_control_value = {
  name: 'control:value',
  defaults: {
    value: '',
    border: 'none',
    format: 'int'
  },
  render: function render(args, reg, doc) {
    var cls = elementClass("field", "control", args, [], {
      "control": "",
      "align": "centre",
      "width": ""
    });
    var prefix = args.prefix ? "<span class='field__overlay'>".concat(__(args.prefix, doc), "</span>") : '';
    var suffix = args.suffix ? "<span class='field__overlay'>".concat(__(args.suffix, doc), "</span>") : '';
    var underlay = args.underlay ? "<u>".concat(__(args.underlay, doc), "</u>") : '';
    var spancls = elementClass("span", null, args, [], {
      'size': 'medium'
    });

    if (isNull(args.value)) {
      error$1("field", "Value is undefined", args);
    } else if (isBoolean(args.value)) {
      error$1("field", "Value is a boolean", args);
    }

    var value = "<span".concat(spancls, ">").concat(_e(args.value, doc), "</span>");
    return "".concat(prefix, "<div").concat(cls, ">").concat(value).concat(underlay, "</div>").concat(suffix);
  }
};
var field_control_ref = {
  name: 'control:ref',
  defaults: {
    icon: "book",
    width: "huge"
  },
  render: function render(args, reg, doc) {
    var id = args.id;
    args.parts = [{
      type: "field",
      id: "".concat(id, "-book"),
      width: "large"
    }, {
      type: "span",
      content: "_{p}"
    }, {
      type: "field",
      id: "".concat(id, "-page"),
      width: "large",
      align: "left"
    }];
    return renderCompoundControl(args, reg, doc);
  }
};
var field_control_speed = {
  name: 'control:speed',
  defaults: {
    value: '',
    width: 'large',
    format: 'int'
  },
  render: function render(args, reg, doc) {
    switch (doc.measurementUnits) {
      case "imperial":
        {
          var ftIdent = fieldIdent(args.id, "ft");
          var sqIdent = fieldIdent(args.id, "sq");
          args.parts = [{
            type: "field",
            id: ftIdent.id,
            align: "right",
            width: "small"
          }, {
            type: "label",
            label: "_{ft}"
          }, {
            type: "field",
            id: sqIdent.id,
            align: "right",
            width: "tiny"
          }, {
            type: "label",
            label: "_{sq}"
          }];
          break;
        }

      case "metric":
        {
          var mIdent = fieldIdent(args.id, "m");

          var _sqIdent = fieldIdent(args.id, "sq");

          args.parts = [{
            type: "field",
            id: mIdent.id,
            align: "right",
            width: "small",
            format: "decimal"
          }, {
            type: "label",
            label: "_{m}"
          }, {
            type: "field",
            id: _sqIdent.id,
            align: "right",
            width: "tiny"
          }, {
            type: "label",
            label: "_{sq}"
          }];
          break;
        }
    } // log("field", "Speed field", args);


    return renderCompoundControl(args, reg, doc);
  }
};
var field_control_weight = {
  name: 'control:weight',
  defaults: {
    schema: "bulk",
    width: "huge",
    format: 'decimal'
  },
  render: function render(args, reg, doc) {
    switch (args.schema) {
      case "bulk":
        {
          var bulkIdent = fieldIdent(args.id, "bulk");
          var lightIdent = fieldIdent(args.id, "light");
          args.parts = [{
            type: "field",
            id: bulkIdent.id,
            align: "right"
          }, {
            type: "label",
            label: "_{B}"
          }, {
            type: "field",
            id: lightIdent.id,
            align: "right",
            width: "tiny"
          }, {
            type: "label",
            label: "_{L}"
          }];
          break;
        }
    }

    return renderCompoundControl(args, reg, doc);
  }
};
var field_control_enum = {
  name: 'control:enum',
  defaults: {
    options: [],
    default: '',
    value: '',
    border: 'bottom',
    format: 'string'
  },
  render: function render(args, reg, doc) {
    var options = args.options.map(function (opt) {
      var menuId = 'enum-menu-' + args.id;
      var slug = toKebabCase(opt.replace(/_\{([\s\S]*?(#\{[\s\S]*?\}[\s\S]*?)*)\}/g, function (m, p) {
        return p;
      }));

      var title = __(opt, doc);

      return "<label for='".concat(menuId, "-").concat(slug, "'><input type='radio' name='").concat(menuId, "' value='").concat(slug, "' data-value='").concat(_e(opt, doc), "' id='").concat(menuId, "-").concat(slug, "'> ").concat(__(title, doc), "</label>");
    });
    args.editable = false;
    return defaultControlRender(args, reg, doc) + "<div class='field--control_enum__options'>".concat(options.join(''), "</div>");
  }
};
var field_control_radio = {
  name: 'control:radio',
  defaults: {
    value: false,
    border: 'none',
    format: 'radio'
  },
  render: function render(args) {
    var ident = fieldRadioIdent(args.id, args.value);
    var cls = elementClass("field", "control", args, [], ["control"]);
    return "<div".concat(cls, "><input type='radio'").concat(ident.ident, "><label").concat(ident.for, "></label></div>");
  }
};
var field_control_checkbox = {
  name: 'control:checkbox',
  defaults: {
    value: false,
    border: 'none',
    width: 'tiny',
    style: '',
    format: 'checkbox'
  },
  render: function render(args) {
    var ident = fieldIdent(args.id);
    var cls = elementClass("field", "control", args, [], {
      control: '',
      style: ''
    });

    if (args.value == "false") {
      args.value = false;
    }

    var checked = args.value ? ' checked' : '';
    return "<div".concat(cls, "><input type='checkbox'").concat(checked).concat(ident.ident, "><label").concat(ident.for, "></label></div>");
  }
};
var field_control_boost = {
  name: 'control:boost',
  defaults: {
    value: false,
    up: true,
    down: true,
    border: 'none',
    format: 'int'
  },
  render: function render(args) {
    var up = '';

    if (args.up) {
      var upident = fieldIdent(args.id, "up");
      up = "<div class='field__control field__control--boost_up'><input type='checkbox' ".concat(upident.ident, "><label ").concat(upident.for, "></label></div>");
    }

    var down = '';

    if (args.down) {
      var downident = fieldIdent(args.id, "down");
      down = "<div class='field__control field__control--boost_down'><input type='checkbox' ".concat(downident.ident, "><label ").concat(downident.for, "></label></div>");
    }

    return "".concat(down).concat(up);
  }
};
var field_control_checkgrid = {
  name: 'control:checkgrid',
  defaults: _defineProperty({
    value: false,
    border: 'none',
    max: 10,
    group: 10,
    reduce: 0,
    direction: "horizontal",
    style: "",
    flex: "tiny",
    depth: 3
  }, "value", 0),
  render: function render(args, reg, doc) {
    var g = args.group;

    if (doc.largePrint && args.reduce > 0) {
      args.max -= args.reduce;
    }

    if (args.max < args.group) g = args.max;
    var depth = args.depth;

    if (depth == "auto") {
      if (g <= 3) {
        depth = 1;
      } else if (g <= 6) {
        depth = 2;
      } else {
        depth = 3;
      }
    } else {
      depth = parseInt(depth);
    }

    var grouplen = Math.ceil(parseFloat(g) / parseFloat(args.depth));

    if (args.direction == "horizontal") {
      args.dir = "h";
      args.w = grouplen;
      args.h = depth;
    } else {
      args.dir = "v";
      args.h = grouplen;
      args.w = depth;
    }

    var checks = [];

    for (var i = 1; i <= args.max; i++) {
      var ident = fieldIdent(args.id, i);
      var checked = i <= args.value ? ' checked' : '';

      var a = _objectSpread(_objectSpread({}, args), {}, {
        control: 'checkbox'
      });

      var cls = elementClass("field", "control", a, [], {
        control: "",
        style: ""
      });
      var check = "<div".concat(cls, "><input type='checkbox'").concat(ident.ident).concat(checked, "><label").concat(ident.for, "></label></div>");
      checks.push(check);
    }

    var groups = chunk(checks, args.group).map(function (ch) {
      var grouplen = Math.ceil(parseFloat(ch.length) / parseFloat(depth));
      var a = {
        control: 'checkgrid',
        dir: args.dir,
        w: args.w,
        h: args.h,
        style: args.style
      };
      a[args.direction == 'horizontal' ? 'w' : 'h'] = grouplen;
      var cls = elementClass("field", "control-group", a, [], {
        control: '',
        dir: '',
        w: '',
        h: '',
        style: ''
      });
      return "<div".concat(cls, ">").concat(ch.join(""), "</div>");
    });
    return groups.join("");
  }
};
var field_control_alignment = {
  name: 'control:alignment',
  defaults: _defineProperty({
    value: '',
    border: 'none',
    format: 'string'
  }, "value", ''),
  render: function render(args, reg, doc) {
    var radios = ["lg", "ln", "le", "ng", "nn", "ne", "cg", "cn", "ce"].map(function (al) {
      var radioIdent = fieldRadioIdent(args.id, al);
      var checked = args.value == al ? ' checked' : '';
      return "<div class='field__control field__control-".concat(al, "'><input type='radio'").concat(radioIdent.ident).concat(checked, "></div>");
    });
    var fieldGridCls = "";

    if (args.value) {
      fieldGridCls = "field__grid--alignment_" + args.value;
    }

    return "\n      <i class='field__grid ".concat(fieldGridCls, "'></i>\n      <i class='icon icon_good'></i>\n      <i class='icon icon_evil'></i>\n      <i class='icon icon_lawful'></i>\n      <i class='icon icon_chaotic'></i>\n\n      <label class='field__good'>").concat(__("_{Good}", doc), "</label>\n      <label class='field__evil'>").concat(__("_{Evil}", doc), "</label>\n      <label class='field__lawful'>").concat(__("_{Lawful}", doc), "</label>\n      <label class='field__chaotic'>").concat(__("_{Chaotic}", doc), "</label>\n\n      ").concat(radios.join(""), "\n    ");
  }
};
var field_control_icon = {
  name: 'control:icon',
  defaults: {
    value: '',
    border: 'none',
    icon: '',
    width: ''
  },
  render: function render(args) {
    var cls = elementClass("field", "control", args, [], {
      "control": ""
    });
    var iconcls = elementClass("icon", null, {
      icon: args.icon
    }, [], {
      "icon": "",
      "width": ""
    });
    return "<div".concat(cls, "><i").concat(iconcls, "></i></div>");
  }
};
var field_control_counter = {
  name: 'control:counter',
  defaults: {
    value: 0,
    max: 3,
    format: 'int'
  },
  render: function render(args, reg, doc) {
    var cls = elementClass("field", "control", {
      control: "counter"
    }, [], {
      control: "input"
    });
    var value = args.value;

    switch (value) {
      case "none":
      case 0:
      case false:
      case "":
        value = "0";
        break;

      default:
        value = parseInt(value);
    }

    var icon = "icon_counter-".concat(value);
    return "<div".concat(cls, ">\n      <input type='hidden'").concat(fieldIdent(args.id, "rank").ident, " class='field--control_counter__number' value='").concat(value, "'> ") + "<i class='icon field--control_counter__icon ".concat(icon, "'></i>\n    </div>");
  }
};
var field_control_proficiency = {
  name: 'control:proficiency',
  defaults: {
    value: 0,
    icon: true,
    'has-bonus': true,
    format: 'string'
  },
  render: function render(args, reg, doc) {
    switch (args.value) {
      case 'untrained':
        args.value = 0;
        break;

      case 'trained':
        args.value = 1;
        break;

      case 'expert':
        args.value = 2;
        break;

      case 'master':
        args.value = 3;
        break;

      case 'legendary':
        args.value = 4;
        break;

      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        break;

      default:
        args.value = 0;
    }

    if (args['has-bonus']) {
      args.parts = [{
        id: args.id,
        control: "proficiency-icon",
        'no-bonus': false,
        value: args.value
      }, {
        subid: 'bonus',
        control: "input",
        editable: !doc.isLoggedIn
      }];
    } else {
      args.parts = [{
        id: args.id,
        control: "proficiency-icon",
        'no-bonus': true,
        value: args.value
      }];
    }

    return renderCompoundControl(args, reg, doc);
  }
};
var field_control_proficiency_icon = {
  name: 'control:proficiency-icon',
  defaults: {
    'no-bonus': true,
    width: 'small'
  },
  render: function render(args) {
    var cls = elementClass("field", "control", {
      control: "icon",
      'no-bonus': args['no-bonus']
    }, ["no-bonus"], {
      "control": "input"
    });
    var value = args.value;

    switch (value) {
      case 'untrained':
      case 0:
      case false:
        value = "untrained";
        break;

      case 'trained':
      case 1:
        value = "trained";
        break;

      case 'expert':
      case 2:
        value = "expert";
        break;

      case 'master':
      case 3:
        value = "master";
        break;

      case 'legendary':
      case 4:
        value = "legendary";
        break;

      default:
        value = "untrained";
    }

    var icon = "icon_proficiency-".concat(value);
    return "<div".concat(cls, ">\n      <input type='hidden'").concat(fieldIdent(args.id, "rank").ident, " class='field--control_proficiency__rank' value='").concat(value, "'> ") + "<i class='icon field--control_proficiency__icon ".concat(icon, "'></i>\n    </div>");
  }
};
var field_control_action_icon = {
  name: 'control:action-icon',
  defaults: {
    value: "template",
    border: "none"
  },
  render: function render(args) {
    var cls = elementClass("field", "control", {
      control: "icon"
    }, [], {
      "control": "input"
    });
    var icon = 'action-template';

    switch (args.value) {
      case 1:
        icon = 'action';
        break;

      case 2:
        icon = 'action2';
        break;

      case 3:
        icon = 'action3';
        break;

      case 13:
        icon = 'action13';
        break;

      case '2nd':
        icon = 'action2nd';
        break;

      case '3rd':
        icon = 'action3rd';
        break;

      case 'reaction':
        icon = 'reaction';
        break;

      case 'free':
        icon = 'free-action';
        break;

      case 'template':
        icon = 'action-template';
        break;
    }

    return "<div".concat(cls, ">\n    <input type='hidden'").concat(fieldIdent(args.id).ident, " class='field--control_action-icon__icon' value='").concat(args.value, "'> ") + "<i class='icon field--control_action-icon__icon icon_".concat(icon, "'></i>\n    </div>");
  }
};
var field_control_ref_switch = {
  name: 'control:ref-switch',
  defaults: {
    value: '',
    border: 'bottom',
    format: 'int'
  },
  render: function render(args) {
    var hidden = "<input type='hidden'".concat(fieldIdent(args.id, "ref").ident, " class='field--control_ref-switch__ref'>");
    return hidden + defaultControlRender(args);
  }
};
var field_control_money = {
  name: 'control:money',
  defaults: {
    indent: 0,
    digits: 3,
    shift: 0,
    decimal: 0,
    denomination: "copper",
    value: '',
    format: 'decimal'
  },
  render: function render(args, reg, doc) {
    var unit = '';

    switch (args.denomination) {
      case 'platinum':
        unit = '_{pp}';
        break;

      case 'gold':
        unit = '_{gp}';
        break;

      case 'silver':
        unit = '_{sp}';
        break;

      case 'copper':
        unit = '_{cp}';
        break;
    }

    var suffix = "<span class='field__overlay'>".concat(__(unit, doc), "</span>");
    var ident = fieldIdent(args.id);
    var cls = elementClass("field", "control", args, [], {
      "digits": 0,
      "shift": 0,
      "decimal": 0
    });
    var value = args.value == '' ? '' : " value='".concat(args.value, "'");
    var ticks = [];

    for (var i = 1; i < args.digits; i++) {
      var decimal = i == args.decimal ? ' field__tick--decimal' : '';
      ticks.push("<label class='field__tick field__tick-".concat(i).concat(decimal, "'></label>"));
    }

    var shift = args.shift > 0 ? "<div class='field__shift field__shift--shift_".concat(args.shift, "'></div>") : '';
    return "<div".concat(cls, "><input").concat(ident.ident).concat(value, " size='").concat(args.digits, "'>").concat(ticks.join(""), "</div>").concat(shift).concat(suffix);
  }
};
var field_control_compound = {
  name: 'control:compound',
  defaults: {
    multibox: false,
    parts: []
  },
  render: renderCompoundControl
};
var field_control_ability = {
  name: 'control:ability',
  defaults: {
    parts: [// {
      //   subid: "key-ability",
      //   control: "radio"
      // },
      // {
      //   subid: "modifier",
      //   size: "huge",
      //   width: ""
      // },
      // {
      //   subid: "score",
      //   width: ""
      // }
    ]
  },
  render: renderCompoundControl
};
var field_control_progression = {
  name: 'control:progression',
  defaults: {
    max: 1,
    border: "none",
    format: 'int'
  },
  // transform(args, doc) {
  //   let parts = [];
  //   for (let i = 0; i < args.max; i++) {
  //     parts.push({
  //       control: "control:checkbox",
  //       style: "progress",
  //     });
  //   }
  //   return {
  //     type: "control:compound",
  //     parts: parts,
  //   };
  // },
  render: function render(args, reg, doc) {
    var parts = [];

    for (var i = 0; i < args.max; i++) {
      parts.push({
        control: "checkbox",
        id: args.id + "-" + i,
        style: "progress"
      });
    }

    var compound = {
      parts: parts
    };
    return renderCompoundControl(compound, reg, doc);
  } // render(args, reg, doc) {
  //   args.parts = args.parts.flatMap(part => [part, '<label class="field__separator"></label>']);
  //   args.parts.pop();
  //   return renderCompoundControl(args, reg, doc);
  // }

};
var value = {
  name: 'value',
  key: 'value',
  defaults: {
    frame: 'none',
    control: 'value',
    width: 'tiny',
    label: "",
    size: 'medium',
    flex: 'tiny'
  },
  transform: function transform(args, ctx) {
    return [_objectSpread(_objectSpread({}, args), {}, {
      type: 'field'
    })];
  }
};
var value_block = {
  name: 'value-block',
  key: 'value',
  defaults: {
    frame: 'none',
    control: 'value',
    width: 'tiny',
    size: 'medium',
    content: '',
    contents: []
  },
  transform: function transform(args, ctx) {
    var value = _objectSpread(_objectSpread({}, args), {}, {
      type: 'field'
    });

    var contents = isEmpty$1(args.contents) ? {
      type: 'p',
      content: args.content
    } : {
      type: 'g',
      contents: args.contents
    };
    var layout = 'indent-l';

    switch (args.width) {
      case 'medium':
      case 'large':
        layout = 'indent-lw';
        break;

      case 'huge':
        return [{
          type: 'row',
          contents: [value, contents, {
            type: 'spacer'
          }]
        }];
    }

    return [{
      type: 'layout',
      layout: layout,
      contents: [value, contents]
    }];
  }
};

var Registry = /*#__PURE__*/function () {
  function Registry() {
    var _this = this;

    _classCallCheck(this, Registry);

    this.registry = {};
    this.stack = []; // load all the elements

    [unit, // document,
    advancement, article, blockquote, calc, class_name, class_icon, color, each, embed$1, flag, flags, g, h1, h2, h3, h4, h5, h6, hr, tail, vr, icon, ifelem, label, large_print, layout, place, indent, level, level_marker, cost, list, join, logelem, logo, lookup, nothing, page, collate_pages, p, ul, li, dl, portrait, proficiency, action, selectable, repeat, row, ruby, ruby_round_up, ruby_round_down, section, sort, slots, spacer, span, spells_list, spells_bundle, spells_table, spells_list2, table, copy, paste, unit, zone, field, field_frame_none, field_frame_above, field_frame_left, field_frame_right, field_frame_h_label, field_frame_annotation, field_frame_circle, field_control_input, field_control_value, field_control_ref, field_control_speed, field_control_enum, field_control_alignment, field_control_boost, field_control_checkbox, field_control_radio, field_control_checkgrid, field_control_compound, field_control_ability, field_control_progression, field_control_ref_switch, field_control_money, field_control_weight, field_control_counter, field_control_proficiency, field_control_proficiency_icon, field_control_action_icon, field_control_icon, value, value_block].forEach(function (elem) {
      return _this.register(elem);
    }); // log("Registry", "Loaded registry elements", Object.keys(this.registry));
  }

  _createClass(Registry, [{
    key: "register",
    value: function register(params) {
      params = Object.assign({
        key: '',
        defaults: {},
        expect: [],
        render: function render(args) {
          return '';
        },
        transform: false
      }, params); // find expected keys

      var expect = Object.keys(params.defaults).concat(params.expect);
      expect = _toConsumableArray(new Set(expect)); // uniq

      expect.unshift("level");
      params.expect = expect;
      this.registry[params.name] = params;
    }
  }, {
    key: "get",
    value: function get(type) {
      if (has(this.registry, type)) return this.registry[type];
      return false;
    }
  }, {
    key: "render",
    value: function render(items, doc) {
      var _this2 = this;

      if (isNull(items)) {
        warn$1("Registry", "Nothing to render");
        return "";
      } // log("registry", "Render", items);


      var rendered = items.map(function (item) {
        return _this2.renderItem(item, doc);
      });
      return rendered.join("");
    }
  }, {
    key: "renderItem",
    value: function renderItem(item, doc) {
      if (item === null) return '';
      item = Object.assign({
        id: null,
        exists: true
      }, item); // check if the item actually exists

      if (isString(item.exists)) {
        item.exists = item.exists.replace(/#{.*?}/g, '');
      }

      if (!item.exists || item.exists === "false") {
        return '';
      }

      if ((doc.largePrint || doc.skipOptional) && has(item, "optional") && item.optional) {
        return '';
      }

      if (item.type == "unit") {
        item.type = item["unit-type"];
      } // log("Registry", "renderItem", item.type);


      if (has(this.registry, item.type)) {
        var _reg = this.registry[item.type]; // registered defaults

        Object.keys(item).forEach(function (key) {
          if (item[key] === null) delete item[key];
        });
        item = Object.assign({}, _reg.defaults, item);

        if (item.type == "slots") {
          log("Registry", item);
        }

        if (item['merge-bottom']) {
          item = mergeBottom(item);
        }

        var _row2 = [item.type];
        ["id", "title", "layout"].forEach(function (key) {
          if (has(item, key) && isString(item[key]) && !isEmpty$1(item[key])) {
            _row2.push(item[key]);
          }
        });
        this.stack.push(_row2.join(":")); // this.stack.push(item.type + ((item.id == null) ? '' : ":" + item.id) + ((item.title == null) ? '' : ':' + item.title));

        var output = _reg.render(item, this, doc);

        this.stack.pop();
        return output;
      } else if (item.type == "item") ;else {
        // log("Registry", "Registry elements", Object.keys(this.registry));
        warn$1("Registry", "Unknown element type:", item.type, "at:", this.stack, item);
        return '';
      }
    }
  }]);

  return Registry;
}();

var color$1 = require('color'); // increase a dull colour's saturation


function vibrantColour(baseColour) {
  var saturation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.9;
  var c = color$1(baseColour);
  var sat = c.saturationl();
  if (sat >= saturation || sat < 0.1) return baseColour;
  c = c.saturationl(saturation);
  return c.hex();
}

function replaceColours(str, documentColour) {
  var accentColour = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var intensity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var highContrast = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  str = str.replace(/#[0-9a-fA-F]{6}/g, function (c) {
    return adjustColour(c, documentColour, intensity, highContrast);
  });
  str = str.replace(/%23[0-9a-fA-F]{6}/g, function (c) {
    c = c.replace('%23', '#');
    c = adjustColour(c, documentColour, intensity, highContrast);
    c = c.replace('#', '%23');
    return c;
  });
  str = str.replace(/rgba\(.*?,.*?,.*?,(.*?)\)/g, function (c) {
    return adjustColour(c, documentColour, intensity, highContrast);
  });

  if (accentColour) {
    str = str.replace(/--c-accent/g, accentColour);
  }

  str = str.replace(/="#([0-9a-fA-F]{6})"/g, '="%23$1"');
  return str;
}

function adjustColour(c, documentColour, intensity, highContrast) {
  try {
    c = c.trim();
    if (c == "") c = "#808080";
    documentColour = documentColour.trim();
    if (documentColour == "") documentColour = "#808080";
    var base = color$1(c);
    var col = color$1(documentColour);
    var lmin = 16;
    var lmax = 100;
    var lightness = base.lightness(); // adjust the lightness based on the selected intensity

    if (lightness < 98) {
      switch (intensity) {
        case 'lightest':
          intensity = 2;
          break;

        case 'lighter':
          intensity = 1;
          break;

        case 'darker':
          intensity = -1;
          break;

        case 'darkest':
          intensity = -2;
          break;
      }

      if (!isNumber(intensity)) intensity = 0;
      if (intensity > 2) intensity = 2;
      if (intensity < -2) intensity = -2; // log("util", `Adjusting intensity: lightness = ${lightness}, intensity = ${intensity}`);

      lightness += intensity * 7;
    } // adjust the lightness if the "high contrast" option is selected


    if (highContrast) {
      if (lightness < 50) {
        lightness = lightness * 0.8;
      }
    }

    if (lightness < lmin) lightness = lmin;
    if (lightness > lmax) lightness = lmax;
    col = col.lightness(lightness); // reduce the saturation of mid-lightness colours so they don't look too odd
    // enhance the saturation of dark colours so they don't fade away

    var nd = 24;
    var nmid = 50;
    var nlow = nmid - nd;
    var nhigh = nmid + nd;
    var f = 1.3;
    var saturation = col.saturationl();
    saturation = saturation + 10;

    if (lightness > nlow && lightness <= nmid) {
      var diff = lightness - nlow;
      saturation -= diff * f;
    } else if (lightness > nmid && lightness < nhigh) {
      var _diff = nhigh - lightness;

      saturation -= _diff * f;
    }

    if (saturation < 0) saturation = 0;
    if (saturation > 100) saturation = 100;
    col = col.saturationl(saturation); // readjust the opacity

    var alpha = base.alpha();
    col.alpha(alpha);

    if (alpha != 1) {
      var red = Math.round(col.red());
      var green = Math.round(col.green());
      var blue = Math.round(col.blue());

      var _result = "rgba(".concat(red, ",").concat(green, ",").concat(blue, ",").concat(alpha, ")");

      return _result;
    }

    var result = col.hex();
    return result;
  } catch (x) {
    error$1('util', 'Colour error:', x, x.stack);
    return c;
  }
}

var systems = {};
var commonSystem = null;
var premiumSystem = null;
var promises = [];

var System = /*#__PURE__*/function () {
  function System(system) {
    var _this3 = this;

    _classCallCheck(this, System);

    this.code = system.code;
    this.name = system.name;
    this.units = {};
    system.units.forEach(function (unit) {
      _this3.units[unit.id] = unit;
    });
  }

  _createClass(System, [{
    key: "getUnit",
    value: function getUnit(code) {
      if (has(this.units, code)) {
        return this.units[code];
      }

      if (commonSystem !== null && has(commonSystem.units, code)) {
        return commonSystem.units[code];
      }

      if (premiumSystem !== null && has(premiumSystem.units, code)) {
        return premiumSystem.units[code];
      }

      warn$1("System", "Unknown unit:", code);
      return null;
    }
  }, {
    key: "getUnits",
    value: function getUnits(codes) {
      var _this4 = this;

      return codes.flatMap(function (code) {
        var unit = _this4.getUnit(code);

        return isNull(unit) ? [] : [unit];
      });
    }
  }, {
    key: "inferUnits",
    value: function inferUnits(units) {
      var _this5 = this;

      // infer required units (to a finite depth)
      var more = true;

      var _loop3 = function _loop3(i) {
        more = false; // log("System", "Checking for required units");

        var moreunits = [];
        var denyunits = [];
        var unitIds = units.map(function (unit) {
          return unit.id;
        }); // log("Character", "Unit IDs:", unitIds);

        units.forEach(function (unit) {
          if (has(unit, "require") && !isArray(unit.require)) {
            error$1("System", "Require not an array in ".concat(unit.id), unit.require);
          }

          if (has(unit, "require")) {
            unit.require.forEach(function (req) {
              if (has(req, "deny")) {
                denyunits.push(req["deny"]);
                return;
              } // log("System", `Unit ${unit.id} requires`, req);
              // check if the new unit is really new


              if (unitIds.includes(req.unit)) return; // check if the new unit has dependencies on other units

              if (has(req, "with")) {
                if (!unitIds.includes(req.with)) return;
              }

              var newunit = _this5.getUnit(req.unit);

              if (!isNull(newunit)) {
                // log("Character", `Infer units: ${unit.id} -> ${newunit.id}`);
                moreunits.push(newunit);
                more = true; // let's do this again
              }
            });
          }
        }); // log("Character", `Infer units: #${i} = ${more}`);

        units = units.concat(moreunits).filter(function (unit) {
          return !denyunits.includes(unit.id);
        });
      };

      for (var i = 0; more && i < 10; i++) {
        _loop3(i);
      }

      units = _toConsumableArray(new Set(units));
      return units;
    }
  }]);

  return System;
}();

function loadSystemData(codes) {
  codes.forEach(function (code) {
    var systemFile = __dirname + "/lib-" + code + ".json"; // log("System", `Loading: ${systemFile}`);

    var promise = new Promise(function (resolve, reject) {
      fs$1.readFile(systemFile, 'utf-8', function (err, data) {
        if (err) {
          error$1("System", "Error loading system file ".concat(systemFile, ":"), err);
          resolve();
          return;
        }

        var systemData = JSON.parse(data);
        var system = new System(systemData);
        log("System", "Loaded ".concat(system.name, " (").concat(systemData.units.length, " units)"));
        systems[code] = system;

        if (code == "common") {
          // log("System", "Found common system");
          commonSystem = system;
        } else if (code == "premium") {
          premiumSystem = system;
        }

        resolve();
      });
    });
    promises.push(promise);
  });
}

function ready(callback) {
  Promise.all(promises).then(function () {
    // log("System", "Ready");
    callback();
  });
}

function getSystem(code) {
  // log("System", `Get system: ${code}`);
  // log("System", "Systems", systems);
  return systems[code];
}

var fs = require('fs');

var LoadQueue = /*#__PURE__*/function () {
  function LoadQueue() {
    _classCallCheck(this, LoadQueue);

    this.promises = [];
  }

  _createClass(LoadQueue, [{
    key: "loadFile",
    value: function loadFile(filename) {
      var promise = new Promise(function (resolve, reject) {
        fs.readFile(filename, 'utf-8', function (err, data) {
          if (err) {
            if (err.code == 'ENOENT') {
              warn("LoadQueue", "No such file", filename);
              reject();
              return;
            }

            error$1("LoadQueue", "Error loading file", filename);
            reject();
            return;
          }

          resolve(data);
        });
      });
      this.promises.push(promise);
      return promise;
    }
  }, {
    key: "loadEmbed",
    value: function loadEmbed(filename) {
      if (filename.match(/\.(png|jpg|jpeg)$/)) {
        filename = filename + ".base64";
      }

      return this.loadFile(filename);
    }
  }, {
    key: "ready",
    value: function ready(callback) {
      Promise.all(this.promises).then(callback).catch(function (err) {
        error$1("LoadQueue", "Queue error:", err, "@", err.stack);
      });
    }
  }]);

  return LoadQueue;
}();

var MIME_SVG = 'image/svg+xml';
var MIME_PNG = 'image/png';
var MIME_JPEG = 'image/jpeg'; // const MIME_WOFF = 'application/font-woff;charset=utf-8';
// const MIME_WOFF = 'application/x-font-woff;charset=utf-8';

var MIME_WOFF = 'application/x-font-woff;charset=utf-8'; // const MIME_WOFF = 'font/woff;charset=utf-8';

var MIME_WOFF2 = 'application/font-woff2;charset=utf-8';
var MIME_SCSS = 'text/x-scss';
var MIME_HANDLEBARS = 'text/x-handlebars';

function inferMimeType(filename) {
  if (!filename.match(/\..*$/)) {
    return 'text/plain';
  }

  var ext = filename.match(/\..*$/)[0];

  switch (ext) {
    case '.svg':
      return MIME_SVG;

    case '.png':
      return MIME_PNG;

    case '.jpg':
    case '.jpeg':
      return MIME_JPEG;

    case '.woff':
      return MIME_WOFF;

    case '.woff2':
      return MIME_WOFF2;

    case '.scss':
      return MIME_SCSS;

    case '.h':
      return MIME_HANDLEBARS;

    default:
      return 'text/plain';
  }
}

function processBase64(original) {
  if (original === null) {
    return '';
  }

  var data = original;
  data = data.replace(/\n$/, '');
  data = data.replace(/[\r\n]/g, '');
  return data;
}

function processSVG(original) {
  var data = original; // log("data", "processSVG");

  data = data.replace(/<!--.*?-->/g, '');
  data = data.replace(/[\r\n]\s*/g, ' ');
  data = data.replace(/>\s*</g, '><'); // data = data.replace(/>[\s\r\n]*</g, '><');

  data = data.replace(/^(.|[\r\n])*?<svg/, '<svg');
  data = data.replace(/\s*$/, '');
  data = data.replace(/#/g, '%23');
  return data;
}

function needsBase64(filename) {
  var mime = inferMimeType(filename);

  switch (mime) {
    case MIME_SVG:
      return false;

    default:
      return true;
  }
}

function toDataURL(data, mimeType) {
  if (data === null) {
    warn$1('data', 'No data');
    return '';
  }

  switch (mimeType) {
    case MIME_SVG:
      {
        var svg = processSVG(data);
        return "data:".concat(mimeType, ",").concat(svg);
      }

    default:
      {
        var base64 = processBase64(data);
        return "data:".concat(mimeType, ";base64,").concat(base64);
      }
  }
} // Assets on disk


var assetsDirs = ["".concat(__dirname, "/assets/")];

function addAssetsDir(dir) {
  var adir = dir.match(/\/$/) ? dir : "".concat(dir, "/");
  assetsDirs.push(adir);
}

function locateAsset(name, cb) {
  try {
    var filename = needsBase64(name) ? "".concat(name, ".base64") : name; // log("data", "Locating asset:", filename, assetsDirs);

    assetsDirs.flatMap(function (dir) {
      var file = dir + filename;

      if (fs$1.existsSync(file)) {
        // log("data", "Located asset", name);
        cb(file);
      }
    });
  } catch (e) {
    error("data", "Error locating asset:", name, e);
  }
}
/**
 * Interface represents a requested item. This may be for a character, a whole party, GM tools etc.
 */


var Instance = /*#__PURE__*/function () {
  function Instance() {
    _classCallCheck(this, Instance);

    this.loadQueue = new LoadQueue();
  }

  _createClass(Instance, [{
    key: "getAsset",
    value: function getAsset(asset, callback) {
      var _this6 = this;

      if (!isNull(asset) && isString(asset) && asset != "" && has(this.data.instances, asset)) {
        // log("Character", "getAsset: known instance", asset);
        asset = this.data.instances[asset];
      }

      if (asset === null) {
        // log("Character", "getAsset: null");
        return;
      } else if (isObject(asset)) {
        // log("Character", "getAsset: object");
        var dataURL = toDataURL(asset.data, asset.mimeType);
        callback(dataURL);
      } else if (isString(asset)) {
        // log("Character", "getAsset: string", asset);
        locateAsset(asset, function (assetFile) {
          _this6.loadQueue.loadEmbed(assetFile).then(function (data) {
            var mimeType = inferMimeType(asset);
            var dataURL = toDataURL(data, mimeType);
            callback(dataURL);
          });
        });
      } else {
        warn("Character", "Unknown asset", asset);
      }
    }
  }, {
    key: "getDataUnits",
    value: function getDataUnits(isLoggedIn) {
      if (isLoggedIn) {
        return ["data/edit", "data/calc", "data/save"]; //, "data/roll" ];
      } else {
        return ["data/edit"];
      }
    }
    /**
     * Render this instance as a file or files.
     * @returns {Promise} Promise representing the character sheet(s).
     */

  }, {
    key: "render",
    value: function render() {
      error$1("Instance", "Not yet implemented!");
    }
  }]);

  return Instance;
}();

var contextStack = [];
var regex = new RegExp('^(.*?)_(.*)$', '');

function applyContext(item) {
  if (isArray(item)) {
    return item.map(applyContext);
  }

  var contentsKey = 'contents'; // log("context", "Item", item);
  // log("context", "has type:", (has(item, "type") ? "yes" : "no"));
  // apply context

  if (has(item, 'type')) {
    var type = item.type;
    var context = {};

    for (var i = contextStack.length - 1; i >= 0; i--) {
      if (has(contextStack[i], type)) {
        context = _objectSpread(_objectSpread({}, contextStack[i][type]), context);
      }
    } // log("context", "Applying context to", type, context);


    item = _objectSpread(_objectSpread({}, context), item);

    switch (type) {
      case 'table':
        contentsKey = 'template';
        break;

      case 'calc':
        contentsKey = 'inputs';
        break;

      case 'field':
        contentsKey = 'parts';
        break;
    }
  } // log("context", "has", contentsKey+":", (has(item, contentsKey) ? "yes" : "no"));


  if (has(item, contentsKey)) {
    // extract context
    var contextArgs = {};
    Object.entries(item).forEach(function (pair) {
      // log("context", "Checking arg", pair[0]);
      var match = pair[0].match(regex);

      if (match) {
        // log("context", "Found a context arg:", pair[0]);
        var _type = match[1];
        var key = match[2];
        if (!has(contextArgs, _type)) contextArgs[_type] = {};
        contextArgs[_type][key] = pair[1];
        delete item[pair[0]];
      }
    }); // log("context", "Pushing context", contextArgs);
    // recurse

    contextStack.push(contextArgs);
    item[contentsKey] = item[contentsKey].map(applyContext);
    contextStack.pop();
  }

  return item;
}

var Handlebars = require('handlebars'); // Set up the template engine for JS and CSS


Handlebars.registerHelper('embedJson', function (data, options) {
  return JSON.stringify(data);
});

var Document = /*#__PURE__*/function () {
  function Document(baseUnit, id) {
    _classCallCheck(this, Document);

    this.nextPage = 1;
    this.primary = {};
    var baseDocument = baseUnit.contents[0]; // log("Document", "Base document", baseDocument);

    this.doc = cloneDeep(baseDocument);
    this.id = id;
    this.language = 'en';
    this.measurementUnits = '';
    this.units = [baseUnit];
    this.zones = {};
    this.templates = {};
    this.delayedBlocks = [];
    this.cssParts = [];
    this.jsParts = [];
    this.browserTarget = false;
    this.largePrint = false;
    this.skipOptional = false;
    this.highContrast = false;
    this.printColour = '#808080';
    this.accentColour = '#808080';
    this.faviconURL = false;
    this.logoURL = false;
    this.portraitURL = false;
    this.animalURL = false;
    this.backgroundURL = false;
    this.vars = {};
  }

  _createClass(Document, [{
    key: "title",
    get: function get() {
      return this.doc.title;
    },
    set: function set(title) {
      this.doc.title = title;
    }
  }, {
    key: "watermark",
    get: function get() {
      return this.doc.watermark;
    },
    set: function set(watermark) {
      this.doc.watermark = watermark;
    }
  }, {
    key: "largePrint",
    get: function get() {
      return this.doc.largePrint;
    },
    set: function set(large) {
      this.doc.largePrint = large;
    }
  }, {
    key: "setMeasurementUnits",
    value: function setMeasurementUnits(units) {
      if (isEmpty$1(units)) {
        switch (this.language) {
          case 'en':
          case 'jp':
            units = "imperial";
            break;

          case 'fr':
          case 'it':
          case 'pl':
          case 'pt':
          case 'de':
          case 'es':
          case 'ru':
          case 'nl':
          case 'no':
            units = "metric";
            break;

          case 'zh':
            units = "chinese";
            break;
        }
      }

      this.measurementUnits = units;
    }
  }, {
    key: "nextPageNumber",
    value: function nextPageNumber() {
      return this.nextPage++;
    } // TODO more parameters

  }, {
    key: "hasVar",
    value: function hasVar(varname) {
      return has(this.vars, varname);
    }
  }, {
    key: "setVar",
    value: function setVar(varname, value) {
      var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "medium";

      if (!has(this.vars, varname)) {
        this.vars[varname] = [];
      }

      this.vars[varname].push({
        set: varname,
        priority: priority,
        value: value
      });
    }
  }, {
    key: "getVar",
    value: function getVar(varname) {
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!has(this.vars, varname)) {
        if (!isNull(format)) {
          switch (format) {
            case 'string':
              return '';

            case 'number':
              return 0;

            case 'boolean':
              return false;
          }
        }

        return false;
      } // separate the stored vars by priority


      var high = [],
          medium = [],
          low = [];

      var _iterator2 = _createForOfIteratorHelper(this.vars[varname]),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _include = _step2.value;
          var priority = has(_include, "priority") ? _include.priority : 'medium';

          switch (priority) {
            case 'high':
              high.push(_include.value);
              break;

            case 'medium':
              medium.push(_include.value);
              break;

            case 'low':
            default:
              low.push(_include.value);
              break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var incs = isEmpty$1(high) ? isEmpty$1(medium) ? low : medium : high; // log("Document", `get var '${varname}': ${JSON.stringify(incs)}`);

      if (isEmpty$1(incs)) return false; // TODO type hints
      // TODO combine multiple values somehow

      var is_array = false;

      var _iterator3 = _createForOfIteratorHelper(incs),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _include2 = _step3.value;
          if (isArray(_include2.value)) is_array = true;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      if (is_array) {
        var values = [];

        var _iterator4 = _createForOfIteratorHelper(incs),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var include = _step4.value;

            if (isArray(include.value)) {
              values = values.concat(include.value);
            } else {
              values.push(include.value);
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        return values;
      }

      return incs[0];
    }
  }, {
    key: "addUnit",
    value: function addUnit(unit) {
      if (unit == null) return; // log("Document", "Incorporating unit:", unit.id);

      this.units.push(unit);

      if (has(unit, "inc")) {
        var _iterator5 = _createForOfIteratorHelper(unit.inc),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var include = _step5.value;
            // log("Document", "Incorporating directive:", directive);
            this.addDirective(include);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    }
  }, {
    key: "addDirective",
    value: function addDirective(include) {
      var directive = Object.keys(include)[0];

      switch (directive) {
        case 'at':
          if (has(include, "add")) this.addAtZone(include.at, include.add, false);
          if (has(include, "replace")) this.addAtZone(include.at, include.replace, true);
          break;

        case 'set':
          if (!has(this.vars, include.set)) this.vars[include.set] = [];
          this.vars[include.set].push(include);
          break;

        case 'copy':
          // log("Document", "Copy template:", include.copy);
          this.templates[include.copy] = {
            params: include.params,
            contents: include.contents
          };
          break;

        case 'paste':
          // log("Document", "Add delayed block", include);
          this.delayedBlocks.push({
            template: include.paste,
            params: include.params
          });
          break;
      }
    }
  }, {
    key: "addAtZone",
    value: function addAtZone(zoneId, elements, replace) {
      if (zoneId.charAt(0) != '@') {
        error$1("Document", "Not a zone ID:", zoneId);
        return;
      } // log("Document", "Adding to zone:", zoneId);


      if (!has(this.zones, zoneId)) {
        this.zones[zoneId] = [];
      }

      if (isNull(elements) || isEmpty$1(elements)) {
        return;
      }

      var _iterator6 = _createForOfIteratorHelper(elements),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var element = _step6.value;
          if (isNull(element)) continue;
          if (replace) element.replace = true;
          this.zones[zoneId].push(element);
        } // log("compose", "Zone", zoneId, "contents:", zones[zoneId]);

      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "defineTemplate",
    value: function defineTemplate(templateId, defaults, elements) {
      // log("compose", "Defining template:", templateId, defaults);
      this.templates[templateId] = {
        defaults: defaults,
        elements: elements
      };
    }
  }, {
    key: "getContext",
    value: function getContext() {
      var self = this;
      return {
        isLoggedIn: this.isLoggedIn,
        isCalc: this.isLoggedIn,
        zones: this.zones,
        templates: this.templates,
        largePrint: this.largePrint,
        skipOptional: this.skipOptional,
        locale: this.language,
        measurementUnits: this.measurementUnits,
        hasVar: function hasVar(varname) {
          return self.hasVar(varname);
        },
        getVar: function getVar(varname) {
          var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
          return self.getVar(varname, format);
        }
      };
    } // the lesser form: only expand a few types, don't do full unit expansion

  }, {
    key: "completeElement",
    value: function completeElement(element, registry) {
      var _this7 = this;

      var ctx = this.getContext();

      if (isArray(element)) {
        return element.flatMap(function (el) {
          return _this7.completeElement(el, registry);
        });
      }

      if (!has(element, "type")) {
        return [element];
      }

      switch (element.type) {
        case 'zone':
        case 'sort':
        case 'slots':
        case 'if':
        case 'large-print':
          var _reg2 = registry.get(element.type);

          if (_reg2 && _reg2.transform) {
            if (has(element, "contents")) {
              element.contents = this.completeElement(element.contents, registry);
            } // log("compose", "Applying transformation to", element.type, (element.type == "zone" ? element.zone : (has(element, "id") ? element.id : '')));
            // log("Document", "Large print?", self.largePrint);


            var args = Object.assign({}, _reg2.defaults, element);

            var newelements = _reg2.transform(args, ctx, _reg2);

            if (newelements === false) return element;
            newelements = newelements.flatMap(function (el) {
              return _this7.completeElement(el, registry);
            });
            return newelements;
          }

          break;
      }

      return [element];
    } // the greater form: give all elements a chance to transform themselves

  }, {
    key: "composeElement",
    value: function composeElement(element, registry) {
      var _this8 = this;

      var ctx = this.getContext();

      if (element === null) {
        warn$1("Document", "Null element");
        return [];
      }

      if (isArray(element)) {
        // log("compose", "Composing array of", element.length, "items");
        return element.flatMap(function (e) {
          return _this8.composeElement(e, registry);
        });
      }

      if (isString(element)) {
        return [element];
      }

      if (!has(element, "type")) {
        if (has(element, "cells")) {
          // log("compose", "Table row:", element.cells);
          element.cells = element.cells.flatMap(function (e) {
            return _this8.completeElement(e, registry);
          }); // log("compose", "Table row transformed:", element.cells);
        } else {
          // warn("Document", "Untyped element", element);
          return [element];
        }
      } // if (element.type == 'table') log("Document", "Compose item", element);
      // first recurse so we have the ingredients


      switch (element.type) {
        case 'advancement':
          element.advances = this.completeElement(element.advances, registry);
          element.fields = this.completeElement(element.fields, registry);
          break;

        case 'table':
          // log("compose", "Adjusting", (element._direct ? "direct table" : "table"), (has(element, "id") ? element.id : ''), "cells", has(element, "id") ? element.id : '');
          if (has(element, "rows") && !isEmpty$1(element.rows)) {
            element.rows = this.composeElement(element.rows, registry);
          }

          if (has(element, "columns") && !isEmpty$1(element.columns)) {
            element.columns = this.completeElement(element.columns, registry);
          } // log("compose", `Adjusted ${(element._direct ? "direct table" : "table")} ${has(element, "id") ? element.id : ''}: ${has(element, "rows") ? element.rows.length : 'no'} rows, ${has(element, "columns") ? element.columns.length : 'no'} columns`);


          break;

        case 'lookup':
          element.lookup = this.completeElement(element.lookup, registry);
          break;

        case 'if':
          // log("compose", "if", element.condition)
          element.then = this.completeElement(element.then, registry);
          element.else = this.completeElement(element.else, registry);
          break;

        case 'large-print':
          element.contents = this.completeElement(element.contents, registry);
          element.else = this.completeElement(element.else, registry);
          break;
      }

      for (var _i8 = 0, _arr2 = ["contents", "placeholder", "header", "inputs", "parts"]; _i8 < _arr2.length; _i8++) {
        var item_key = _arr2[_i8];

        // log("compose", "Checking for", item_key);
        if (has(element, item_key)) {
          // log("compose", "Preparing item", item_key, element[item_key]);
          if (isArray(element[item_key])) element[item_key] = element[item_key].flatMap(function (el) {
            return _this8.composeElement(el, registry);
          });else element[item_key] = this.composeElement(element[item_key], registry);
        }
      }

      switch (element.type) {
        case 'slots':
          if (has(element, "contents")) {
            element.contents = element.contents.flatMap(function (subelement) {
              if (has(subelement, "type") && subelement.type == "reduce") {
                var reduce = has(subelement, "reduce") ? subelement.reduce : 1;
                if (isEmpty$1(reduce)) reduce = 1; // log("Document", "Reducing slots", subelement.reduce, `min = ${element.min}, max = ${element.max}`);

                element.min -= reduce; // log("Document", `min = ${element.min}, max = ${element.max}`);

                return [];
              }

              return [subelement];
            });
          }

          break;
      } // transform the element


      var reg = registry.get(element.type); // log("compose", "Registry entry for", element.type, reg);

      if (reg && reg.transform) {
        // log("compose", "Applying transformation to", element.type);
        var args = Object.assign({}, reg.defaults, element);
        var newelements = reg.transform(args, ctx, reg);
        if (newelements === false) return element; // log("compose", "Transformed", element.type, (element.type == "zone" ? element.zone : (has(element, "id") ? element.id : ((has(element, "template") && isString(element.template)) ? element.template : ''))), "into", newelements.length, "elements");

        newelements = newelements.flatMap(function (el) {
          return _this8.composeElement(el, registry);
        });
        return newelements;
      }

      return [element];
    }
  }, {
    key: "composeDocument",
    value: function composeDocument(registry) {
      var _this9 = this;

      // log("Document", "Compose document");
      // log("compose", " - Doc:", this.doc);
      // log("compose", " - Zones:", zones);
      // log("compose", " - Templates:", templates);
      // log("compose", " - Registry", registry);
      // Expand unit-level paste blocks
      var self = this;

      while (this.delayedBlocks.length > 0) {
        var blocks = this.delayedBlocks;
        this.delayedBlocks = [];
        blocks.forEach(function (block) {
          // log("Document", "Delayed block", block);
          if (!has(self.templates, block.template)) {
            warn$1("Document", "Cannot find delayed block template", block.template);
            return;
          }

          var template = self.templates[block.template];

          if (isEmpty$1(template)) {
            warn$1("Document", "Empty delayed block template", block.template);
            return;
          } // log("Document", "Delayed block template", template);


          var contents = cloneDeep(template.contents);

          if (has(block, "params") || has(template, "params")) {
            var params = _objectSpread(_objectSpread({}, template.params), block.params); // log("Document", "Interpolating parameters", params);


            contents = interpolate(contents, params, _this9);
          } // log("Document", "Block content", contents);


          contents.forEach(function (directive) {
            self.addDirective(directive);
          });
        });
      } // Fill in the element tree


      var c = this.composeElement(this.doc, registry);
      this.doc = applyContext(c[0]); // log("Document", " - Pages", this.doc.contents.map(page => `${page.id}: ${page.name}`));
    }
  }, {
    key: "getCalculations",
    value: function getCalculations(registry) {
      var fields = [];
      var dependencies = {};
      var formats = {};
      var doc = this;

      function pushDependency(ref, id) {
        if (!has(dependencies, ref)) {
          dependencies[ref] = [];
        }

        dependencies[ref].push(id);
      }

      function findCalculationFields(element) {
        function transformCalculation(id, eq) {
          var requiredFields = [];
          eq = eq.replace(/#\{(.*?)\}/g, function (match, field) {
            warn$1("Document", "Transform calculation: Unknown interpolation", field, element);
            return 0;
          });
          eq = eq.replace(/_\{(.*?)\}/g, function (match, string) {
            return "\"".concat(string, "\"");
          }); // log("Document", "Transform calculation", eq);

          eq = eq.replace('default(', 'defaultValue(');
          eq = eq.replace(/%\{(.*?)\}/g, function (match, field) {
            pushDependency(field, id); // var found = field.match(/(.*)\|(.*)/);
            // if (found !== null) {
            //   var fieldPart = found[1];
            //   var defaultPart = found[2];
            //   return `v('${fieldPart}', ${defaultPart})`;
            // }

            var found = field.match(/^[0-9]+$/);

            if (found !== null) {
              return found[0];
            }

            if (!field.match(/-misc$/)) {
              requiredFields.push("'".concat(field, "'"));
            }

            return "v('".concat(field, "')");
          });
          return "(v) => req([".concat(requiredFields.join(','), "],").concat(eq, ")");
        } // fields


        if (has(element, "type") && element.type == "field") {
          // log("Document", `Field: id = ${element.id}, ref = ${element.ref}`);
          if (!has(element, "id") && !has(element, "ref")) {
            trace(registry, "Document", "Field with no ID or reference", element);
          }

          if (has(element, "eq")) {
            if (!isString(element.eq)) {
              trace(reg, "Document", "eq value not a string", element);
            } // og("Document", `Field ${element.id} = ${element.eq}`);


            switch (element.control) {
              case 'speed':
                var subid = element.units == 'metric' ? element.id + '--m' : element.id + '--ft';
                var affix = element.units == 'metric' ? '--m' : '--ft';
                var eq = element.eq.replaceAll(/%\{(.*speed)\}/g, "%{$1" + affix + "}");
                fields.push({
                  id: subid,
                  eq: transformCalculation(subid, eq)
                });
                break;

              default:
                fields.push({
                  id: element.id,
                  eq: transformCalculation(element.id, element.eq)
                });
                break;
            }
          }

          if (has(element, "format")) {
            formats[element.id] = element.format;
          }

          if (has(element, "parts")) {
            element.parts.forEach(function (part) {
              if (has(part, "eq") && has(part, "subid")) {
                var partid = part.subid == "" ? element.id : element.id + '-' + part.subid; // log("Document", "Sub-field calculation", partid, part.eq);

                fields.push({
                  id: partid,
                  eq: transformCalculation(partid, part.eq)
                });

                if (has(part, "format")) {
                  formats[partid] = part.format;
                }
              }
            });
          }

          switch (element.control) {
            case 'speed':
              if (doc.measurementUnits == "metric") {
                fields.push({
                  id: element.id + '--sq',
                  eq: transformCalculation(element.id + '--sq', "floor(%{".concat(element.id, "--m}/1.5)"))
                });
                formats[element.id + '--m'] = 'decimal';
              } else {
                fields.push({
                  id: element.id + '--sq',
                  eq: transformCalculation(element.id + '--sq', "floor(%{".concat(element.id, "--ft}/5)"))
                });
              }

              break;
          }
        } // calculations


        if (has(element, "type") && element.type == "calc") {
          if (has(element, "output")) {
            findCalculationFields(element.output);
          }

          if (has(element, "inputs")) {
            element.inputs.forEach(function (elem) {
              return findCalculationFields(elem);
            });
          }
        } // tables


        if (has(element, "type") && element.type == "table") {
          // log("Document", "Calculation fields: table");
          element.rows.forEach(function (row) {
            if (has(row, "cells")) {
              row.cells.forEach(function (elem) {
                // log("Document", "Calculation fields: blank element");
                if (isNull(elem)) {
                  return;
                } // log("Document", `Calculation fields: table cell: ${elem.type} ${elem.id}`);


                findCalculationFields(elem);
              });
            }
          });
        } // if


        if (has(element, "type") && element.type == "if") {
          // log("Document", `Calculation fields: if ${element.condition}`);
          if (has(element, "then")) {
            element.then.forEach(function (elem) {
              return findCalculationFields(elem);
            });
          }

          if (has(element, "else")) {
            element.else.forEach(function (elem) {
              return findCalculationFields(elem);
            });
          }
        } // other


        if (has(element, "contents")) {
          element.contents.forEach(function (elem) {
            return findCalculationFields(elem);
          });
        }
      }

      findCalculationFields(this.doc); // log("Document", "Calculation fields", fields);

      var calculations = '{' + fields.map(function (field) {
        return "'".concat(field.id, "': ").concat(field.eq);
      }).join(",\n") + '}';
      Object.keys(dependencies).forEach(function (key) {
        dependencies[key] = _toConsumableArray(new Set(dependencies[key]));
      });
      delete dependencies[0];
      return {
        calculations: calculations,
        formats: formats,
        dependencies: dependencies
      };
    }
  }, {
    key: "getFavicon",
    value: function getFavicon() {
      return '';
    }
  }, {
    key: "getStylesheet",
    value: function getStylesheet() {
      var _this10 = this;

      // find both SASS-compiled and data-URL-embedded parts for each of those
      var cssParts = [];
      this.units.forEach(function (unit) {
        var css = unit.stylesheet;
        if (css == "") return; // log("Document", "CSS part for unit:", unit.id);

        var template = Handlebars.compile(css);
        var rendered = template({});
        if (unit.id != "document") rendered = replaceColours(rendered, _this10.printColour, _this10.accentColour, _this10.printIntensity, _this10.highContrast);
        cssParts.push(rendered);
      }); // put it all together
      // log("Document", "Found", cssParts.length, "stylesheet parts");
      // logo

      if (this.logoURL) {
        cssParts.push(".logo{background-image:url('".concat(this.logoURL, "');}"));
      } // portrait


      if (this.portraitURL) {
        cssParts.push(".portrait--char_personal .portrait__inner{background-image:url('".concat(this.portraitURL, "');}"));
      } // animal companion portraits


      if (this.animalURL) {
        cssParts.push(".portrait--char_animal-companion .portrait__inner{background-image:url('".concat(this.animalURL, "');}"));
      } // background


      if (this.backgroundURL) {
        cssParts.push(".page__background{background-image:url('".concat(this.backgroundURL, "'); background-size: 100% 100%;}"));
      } else if (this.backgroundColour) {
        cssParts.push(".page__background{background: ".concat(this.backgroundColour, " !important;}"));
      } // custom extras


      this.cssParts.forEach(function (css) {
        _this10.cssParts.push(css);
      });
      return cssParts.join("");
    }
  }, {
    key: "getJavascript",
    value: function getJavascript(registry) {
      var doc = this;
      var jsParts = [];

      var _this$getCalculations = this.getCalculations(registry),
          calculations = _this$getCalculations.calculations,
          formats = _this$getCalculations.formats,
          dependencies = _this$getCalculations.dependencies;

      var templateData = {
        title: this.doc.title,
        summary: this.summary,
        fieldValues: {
          level: 2,
          foo: "bar"
        },
        request: JSON.stringify(this.request),
        calculations: calculations,
        dependencies: JSON.stringify(dependencies),
        formats: JSON.stringify(formats)
      };

      function processJS(js) {
        var template = Handlebars.compile(js);
        js = template(templateData);
        return __(js, doc); // return js; // .replace(/\/\*.*?\*\//g, '');
      }

      this.units.forEach(function (unit) {
        if (!has(unit, "js") || unit.js == "") return;
        jsParts.push(processJS(unit.js));
      }); // custom extras

      this.jsParts.forEach(function (js) {
        jsParts.push(processJS(js));
      });
      return jsParts.join("\n");
    }
  }, {
    key: "renderDocument",
    value: function renderDocument(registry) {
      // log("Document", "Pages", this.doc.contents.map(page => `${page.id}: ${page.name}`));
      var documentId = this.id;
      var favicon = this.faviconURL ? "<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href='".concat(this.faviconURL, "' />") : '';
      var stylesheet = this.getStylesheet();
      var javascript = this.getJavascript(registry);
      var htmlClasses = [];

      if (this.browserTarget) {
        htmlClasses.push("html--" + this.browserTarget);
      }

      var isLoggedIn = this.isLoggedIn;
      var controlMenus = "\n<nav id='proficiency-menu' class='control-menu'><div>\n<label for='proficiency-menu-untrained'><input type='radio' name='proficiency-menu' value='untrained' id='proficiency-menu-untrained'> <i class=\"icon icon_proficiency-untrained\"></i> ".concat(__('Untrained'), "</label>\n<label for='proficiency-menu-trained'><input type='radio' name='proficiency-menu' value='trained' id='proficiency-menu-trained'> <i class=\"icon icon_proficiency-trained\"></i> ").concat(__('Trained'), "</label>\n<label for='proficiency-menu-expert'><input type='radio' name='proficiency-menu' value='expert' id='proficiency-menu-expert'> <i class=\"icon icon_proficiency-expert\"></i> ").concat(__('Expert'), "</label>\n<label for='proficiency-menu-master'><input type='radio' name='proficiency-menu' value='master' id='proficiency-menu-master'> <i class=\"icon icon_proficiency-master\"></i> ").concat(__('Master'), "</label>\n<label for='proficiency-menu-legendary'><input type='radio' name='proficiency-menu' value='legendary' id='proficiency-menu-legendary'> <i class=\"icon icon_proficiency-legendary\"></i> ").concat(__('Legendary'), "</label>\n<hr/>\n<div id='proficiency-menu__level-hint' class='row valign_center'><div class='row__inner'>\n<span>=</span><span id='proficiency-menu__ref-level'></span><label>Level</label> <span>+</span> <span id='proficiency-menu__plus'></span><span class='spacer'></span>\n</div></div>\n</div></nav>\n\n<nav id='action-menu' class='control-menu'><div>\n<label for='action-menu-template'><input type='radio' name='action-menu' value='template' id='action-menu-template'> <i class=\"icon icon_action-template\"></i> ").concat(__(''), "</label>\n<label for='action-menu-1'><input type='radio' name='action-menu' value='1' id='action-menu-1'> <i class=\"icon icon_action\"></i> ").concat(__('One action'), "</label>\n<label for='action-menu-2'><input type='radio' name='action-menu' value='2' id='action-menu-2'> <i class=\"icon icon_action2\"></i> ").concat(__('Two actions'), "</label>\n<label for='action-menu-3'><input type='radio' name='action-menu' value='3' id='action-menu-3'> <i class=\"icon icon_action3\"></i> ").concat(__('Three actions'), "</label>\n<label for='action-menu-reaction'><input type='radio' name='action-menu' value='reaction' id='action-menu-reaction'> <i class=\"icon icon_reaction\"></i> ").concat(__('Reaction'), "</label>\n<label for='action-menu-free'><input type='radio' name='action-menu' value='free' id='action-menu-free'> <i class=\"icon icon_free-action\"></i> ").concat(__('Free action'), "</label>\n</div></nav>\n\n<nav id='counter-menu' class='control-menu'><div>\n<label for='counter-menu-0'><input type='radio' name='counter-menu' value='0' id='counter-menu-0'> <i class=\"icon icon_counter-0\"></i> ").concat(__('None'), "</label>\n<label for='counter-menu-1'><input type='radio' name='counter-menu' value='1' id='counter-menu-1'> <i class=\"icon icon_counter-1\"></i> ").concat(__('1'), "</label>\n<label for='counter-menu-2'><input type='radio' name='counter-menu' value='2' id='counter-menu-2'> <i class=\"icon icon_counter-2\"></i> ").concat(__('2'), "</label>\n<label for='counter-menu-3'><input type='radio' name='counter-menu' value='3' id='counter-menu-3'> <i class=\"icon icon_counter-3\"></i> ").concat(__('3'), "</label>\n</div></nav>\n\n<nav id='ref-switch-menu' class='control-menu'><div>\n<table><tr>\n\n<td><label for='ref-switch-STR'><input type='radio' name='ref-switch' value='STR' id='ref-switch-STR'></label></td>\n<td>\n<div id=\"field-ref-switch-STR\" class=\"field field--ref field--frame_above field--width_medium\"><div class=\"field__frame\"><label for='ref-switch-STR' class=\"label align_centre\">").concat(__('STR'), "</label><div class=\"field__box\"><div class=\"field__control field__control--width_medium\"><input ref=\"STR\" readonly></div></div></div></div>\n</td>\n\n<td><label for='ref-switch-DEX'><input type='radio' name='ref-switch' value='DEX' id='ref-switch-DEX'></label></td>\n<td>\n<div id=\"field-ref-switch-DEX\" class=\"field field--ref field--frame_above field--width_medium\"><div class=\"field__frame\"><label for='ref-switch-DEX' class=\"label align_centre\">").concat(__('DEX'), "</label><div class=\"field__box\"><div class=\"field__control field__control--width_medium\"><input ref=\"DEX\" readonly></div></div></div></div>\n</td>\n\n</tr></table>\n</div></nav>\n\n<nav id='alignment-menu' class='control-menu'><div>\n<table>\n<tr><td></td>\n  <th colspan='3' class='control-menu__col-head'><i class=\"icon icon_lawful\"></i></th></tr>\n\n<tr><th rowspan='3' class='control-menu__row-head'><i class=\"icon icon_good\"></i></th>\n  <td><label for='alignment-menu-lg'><input type='radio' name='alignment-menu' value='lg' id='alignment-menu-lg'> ").concat(__('Lawful Good'), "</label></td>\n  <td><label for='alignment-menu-ln'><input type='radio' name='alignment-menu' value='ln' id='alignment-menu-ln'> ").concat(__('Lawful Neutral'), "</label></td>\n  <td><label for='alignment-menu-le'><input type='radio' name='alignment-menu' value='le' id='alignment-menu-le'> ").concat(__('Lawful Evil'), "</label></td>\n  <th rowspan='3' class='control-menu__row-head'><i class=\"icon icon_evil\"></i></th></tr>\n  \n<tr>\n  <td><label for='alignment-menu-ng'><input type='radio' name='alignment-menu' value='ng' id='alignment-menu-ng'> ").concat(__('Neutral Good'), "</label></td>\n  <td><label for='alignment-menu-nn'><input type='radio' name='alignment-menu' value='nn' id='alignment-menu-nn'> ").concat(__('True Neutral'), "</label></td>\n  <td><label for='alignment-menu-ne'><input type='radio' name='alignment-menu' value='ne' id='alignment-menu-ne'> ").concat(__('Neutral Evil'), "</label></td>\n  </tr>\n\n<tr>\n  <td><label for='alignment-menu-cg'><input type='radio' name='alignment-menu' value='cg' id='alignment-menu-cg'> ").concat(__('Chaotic Good'), "</label></td>\n  <td><label for='alignment-menu-cn'><input type='radio' name='alignment-menu' value='cn' id='alignment-menu-cn'> ").concat(__('Chaotic Neutral'), "</label></td>\n  <td><label for='alignment-menu-ce'><input type='radio' name='alignment-menu' value='ce' id='alignment-menu-ce'> ").concat(__('Chaotic Evil'), "</label></td>\n  </tr>\n\n<tr><td></td>\n  <th colspan='3' class='control-menu__col-head'><i class=\"icon icon_chaotic\"></i></th></tr>\n\n<tr><td></td>\n  <td><label for='alignment-menu-none'><input type='radio' name='alignment-menu' value='' id='alignment-menu-none'> ").concat(__('None'), "</label></td></tr>\n\n</table>\n</div></nav>\n\n<nav id='enum-menu' class='control-menu'><div id='enum-menu__holder'></div></nav>");
      return "<!DOCTYPE html>\n<html lang='".concat(this.language, "' class='").concat(htmlClasses.join(" "), "'>\n<head>\n<meta charset='utf-8'/>\n<title>").concat(esc(this.doc.title), "</title>\n").concat(favicon, "\n<style>\n").concat(stylesheet, "\n</style>\n</head>\n\n<body id='").concat(documentId, "'>\n\n<main>\n").concat(registry.render(this.doc.contents, this), "\n</main>\n\n<div class='screen-message' id='screen-message-safari'>\n<p>Backgrounds are currently unavailable on Safari and iOS devices.</p>\n<p>If printing on Safari, please deselect \"Print headers and footers\".</p>\n</div>\n<nav id='screen-buttons'>\n<button id='button--print' onclick=\"window.print();return false;\"><i></i> ").concat(__('Print'), "</button>\n").concat(isLoggedIn ? "<button id='button--save' class=\"btn button--disabled\"><i></i> ".concat(__('Save'), "</button>") : '', "\n\n</nav>\n\n").concat(controlMenus, "\n\n<script type='text/javascript'>\n").concat(javascript, "\n</script>\n</body>\n</html>");
    }
  }]);

  return Document;
}();

var EventEmitter = require('events');

var events = new EventEmitter();
/*
class EventQueue {
  constructor() {
    this.callbacks = [];
  }

  call(...args) {
    this.callbacks.forEach(callback => {
      try {
        callback.apply(null, args);
      } catch (e) {

      }
    })
  }

  on(callback) {
    this.callbacks.push(callback);
  }
}

let createEvt = new EventQueue();
let createElementTreeEvt = new EventQueue();
let errorEvt = new EventQueue();

export class Events {
  static get createEvt() {
    return createEvt;
  }
  static get createElementTreeEvt() {
    return createElementTreeEvt;
  }
  static get errorEvt() {
    return errorEvt;
  }
}
*/

var knownVars = ["inventoryStyle", "language", "miniSize", "skillActions"];

function parseCharacter(primary, request) {
  // attributes
  var attr = _objectSpread({
    name: false,
    game: 'pathfinder2',
    theme: 'adventurer',
    language: 'en',
    units: '',
    ancestry: false,
    heritage: false,
    background: false,
    class: false,
    archetypes: false,
    description: '',
    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,
    printDyslexicFont: 'sans',
    miniSize: 'medium',
    printColour: '#707070',
    accentColour: '',
    printIntensity: 0,
    printWatermark: '',
    printLogo: false,
    printPortrait: false,
    animalPortrait: false,
    printBackground: false,
    isLoggedIn: false
  }, primary.attributes); // an object to start with


  var char = {
    id: primary.id,
    name: attr.name,
    game: attr.game,
    units: ['core', 'base', 'base/character', 'theme/' + attr.theme],
    language: attr.language,
    measurementUnits: attr.units,
    description: attr.description,
    ancestry: false,
    heritage: false,
    background: false,
    classes: [],
    archetypes: [],
    feats: [],
    options: {
      'animal-companion': false,
      'party-funds': false,
      'permission': false,
      'build': false,
      'mini': false,
      'spellbook': false
    },
    spellbookStyle: 'normal',
    skillActions: attr.skillActions,
    miniSize: attr.miniSize,
    browserTarget: attr.browserTarget,
    printLarge: attr.printLarge,
    printHighContrast: attr.printHighContrast,
    printDyslexic: attr.printDyslexic,
    printDyslexicFont: attr.printDyslexicFont,
    printColour: attr.printColour,
    accentColour: attr.accentColour,
    printIntensity: attr.printIntensity,
    printLogo: attr.printLogo,
    favicon: 'favicon.svg',
    printPortrait: attr.printPortrait,
    animalPortrait: attr.animalPortrait,
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,
    isLoggedIn: attr.isLoggedIn,
    debug: primary.debug,
    instances: {}
  };
  log("Character", "Is logged in?", attr.isLoggedIn, char.isLoggedIn); // log("Character", "Request attributes", attr);
  // log("Character", "Print intensity", char.printIntensity);

  if (isEmpty$1(char.accentColour)) {
    char.accentColour = adjustColour('#707070', char.printColour, char.printIntensity);
  } // get all the flags


  Object.keys(attr).forEach(function (key) {
    var flag = toKebabCase(key);

    if (flag.match(/^option-/)) {
      var option = flag.replace(/^option-/, '');
      var ok = char.options[option] = !!attr[key]; // log("Character", "Option", option, ok);

      if (ok) {
        char.units.push('option/' + option);
      }
    }
  }); // accessibility options

  if (attr.printLarge) {
    char.units.push('large-print');
  }

  if (attr.printHighContrast) {
    char.units.push('high-contrast');
  }

  if (attr.printDyslexic) {
    log("Character", "Dyslexic font", attr.printDyslexicFont);

    switch (attr.printDyslexicFont) {
      case 'dyslexie':
        char.units.push('dyslexie');
        break;

      case 'lexend':
        char.units.push('lexend');
        break;

      default:
        char.units.push('dyslexic');
        break;
    }
  } // game-specific settings


  var system = getSystem(attr.game);

  function getUnitOptions(unitName) {
    var unit = system.getUnit(unitName);

    if (isNull(unit) || !has(unit, "form")) {
      return;
    } // log("Character", "Options for", unitName);


    unit.form.forEach(function (formOption) {
      var optionSelect = formOption.select;

      if (has(attr, optionSelect)) {
        // log("Character", "Option", optionSelect);
        if (isArray(attr[optionSelect])) {
          attr[optionSelect].forEach(function (optionValue) {
            // log("Character", "Adding multi option", optionValue);
            char.units.push(optionValue);
          });
        } else {
          // log("Character", "Adding single option", attr[optionSelect]);
          char.units.push(attr[optionSelect]);
        }
      }
    });
  } // log("Character", "System", system);


  switch (attr.game) {
    case 'pathfinder2':
      if (attr.ancestry) {
        var ancestryName = 'ancestry/' + attr.ancestry.replace(/^ancestry[\/-]/, '');
        char.units.push(ancestryName);
        char.ancestry = ancestryName;
        getUnitOptions(ancestryName);

        if (attr.heritage && attr.heritage != "none") {
          char.units.push('heritage/' + attr.heritage.replace(/^heritage[\/-]/, ''));
        }
      }

      if (attr.ancestryFeats) {
        char.ancestryFeats = parseFeats(attr.ancestryFeats);
      }

      if (attr.background) {
        char.units.push('background/' + attr.background.replace(/^background[\/-]/, ''));
      }

      if (attr.class) {
        var className = attr.class.replace(/^class[\/-]/, '');
        var classShortName = className.replace(/^.*\//, '');
        char.units.push('class/' + className);
        char.classes.push(className);
        var classPrefix = toCamelCase('class ' + classShortName); // log("Character", "Class name", className, ", prefix", classPrefix);

        getUnitOptions('class/' + className);
        var classFeatsKey = classPrefix + 'Feats';

        if (attr[classFeatsKey]) {
          char.classFeats = parseFeats(attr[classFeatsKey]);
          char.classFeats.forEach(function (feat) {
            // log("Character", "Class feat:", feat);
            char.units.push('feat/' + className + '/' + feat);
          });
        } // Object.keys(attr).forEach(key => {
        //   // log("Character", key);
        //   // let value = attr[key];
        //   if (key.startsWith(classPrefix) && !key.endsWith('Feats')) {
        //     // let selname = toKebabCase(key.replace(classPrefix, ''));
        //     let selname = key;
        //     log("Character", "Class selector", selname);
        //     if (isArray(attr[key])) {
        //       attr[key].forEach(selvalue => {
        //         // selvalue = toKebabCase(selvalue);
        //         // log("Character", "Class option", key, selname, "=", selvalue);
        //         // const unitname = classShortName + '/' + selname + '/' + selvalue;
        //         const unitname = selvalue;
        //         log("Character", "Subclass unit name", unitname);
        //         char.units.push(unitname);
        //       });
        //     } else if (isString(attr[key])) {
        //       // let selvalue = toKebabCase(attr[key]);
        //       // log("Character", "Class option", key, selname, "=", selvalue);
        //       // const unitname = classShortName + '/' + selname + '/' + selvalue;
        //       const unitname = attr[key];
        //       log("Character", "Class option unit", unitname);
        //       char.units.push(unitname);
        //     }
        //   }
        // });
        // attr.feats.forEach(key => {
        //   let flag = toKebabCase(key);
        //   if (flag.startsWith()
        // });

      } // todo select inventory size


      switch (attr.inventoryStyle) {
        case "full":
          char.units.push("option/inventory/full");
          break;

        case "both":
          char.units.push("option/inventory/half");
          char.units.push("option/inventory/full");
          break;

        case "double":
          char.units.push("option/inventory/double");
          break;

        default:
          char.units.push("option/inventory/half");
      }

      if (attr.archetypes && isArray(attr.archetypes)) {
        attr.archetypes.forEach(function (archetype) {
          if (isString(archetype)) {
            var archetypeName = 'archetype/' + archetype.replace(/^archetype[\/-]/, '');
            char.units.push(archetypeName);
            char.archetypes.push(archetypeName); // log("Character", "Archetype:", "archetype/"+archetype);

            getUnitOptions(archetypeName);
          }
        });
      }

      if (attr.feats) {
        char.feats = parseFeats(attr.feats);
        char.feats.forEach(function (feat) {
          char.units.push("feat/" + feat);
        });
      }

      if (attr.skillFeats) {
        char.skillFeats = parseFeats(attr.skillFeats);
        char.feats.forEach(function (feat) {
          char.units.push("feat/" + feat);
        });
      }

      if (char.debug) {
        char.units.push('option/debug');
      }

      break;
  } // included assets


  ["printPortrait", "animalPortrait", "printLogo", "printBackground"].forEach(function (field) {
    if (attr[field]) {
      var id = attr[field]; // log("Character", "Asset:", field, "=", id);

      var instance = request.getInstance(id);

      if (!isNull(instance)) {
        // log("Character", "Asset known:", field, "=", id);
        char.instances[id] = instance.attributes;
      }
    }
  }); // log("Character", "Parsed", char);

  return char;
}

function parseFeats(feats) {
  return feats;
}
/**
 * Class representing a character sheet for one character.
 */


var Character = /*#__PURE__*/function (_Instance) {
  _inherits(Character, _Instance);

  var _super = _createSuper(Character);

  function Character(primary, request, registry) {
    var _this11;

    _classCallCheck(this, Character);

    _this11 = _super.call(this);
    _this11.registry = registry;
    _this11.request = request;
    _this11.promise = new Promise(function (resolve, reject) {
      ready(function () {
        _this11.data = parseCharacter(primary, request);
        _this11.data.units = [].concat(_toConsumableArray(_this11.data.units), _toConsumableArray(_this11.getDataUnits(_this11.data.isLoggedIn)));
        resolve(_this11.data);
      });
    });
    return _this11;
  }
  /**
   * Turn this request into a real character sheet.
   * @returns {Promise} Promise representing the resulting character sheet.
   */


  _createClass(Character, [{
    key: "render",
    value: function render() {
      var _this12 = this;

      var self = this; // const data = this.data;

      var promise = this.promise;
      return new Promise(function (resolve, reject) {
        promise.then(function (data) {
          // log("Character", "Render character");
          // log("Character", `Name: ${this.data.name}, game: ${this.data.game}`);
          log("Character", "Units: ".concat(_this12.data.units));
          ready(function () {
            try {
              var system = getSystem(data.game);

              if (system === null) {
                error$1("Character", "System not found:", data.game);
                reject();
                return;
              } // start with a document


              var documentUnit = system.getUnit("document");
              var document = new Document(documentUnit, data.id);
              document.request = _this12.request; // language

              document.language = data.language;
              document.setMeasurementUnits(data.measurementUnits);
              document.setVar('character-name', data.name);
              document.setVar('description', data.description);

              if (data.printLarge) {
                document.largePrint = true;
              }

              if (data.printHighContrast) {
                document.highContrast = true;
              }

              if (data.printDyslexic && (data.printDyslexicFont == 'dyslexie' || data.printDyslexicFont == 'lexend')) {
                document.skipOptional = true;
              } // Load assets


              if (data.favicon) {
                self.getAsset(data.favicon, function (dataURL) {
                  if (data.favicon.match(/\.svg$/) && !isEmpty$1(data.printColour)) {
                    var colour = vibrantColour(data.printColour);
                    dataURL = replaceColours(dataURL, colour);
                  }

                  document.faviconURL = dataURL;
                });
              }

              if (data.printLogo) {
                self.getAsset(data.printLogo, function (dataURL) {
                  document.logoURL = dataURL;
                });
              }

              if (data.printPortrait) {
                self.getAsset(data.printPortrait, function (dataURL) {
                  document.portraitURL = dataURL;
                });
              }

              if (data.animalPortrait) {
                self.getAsset(self.data.animalPortrait, function (dataURL) {
                  document.animalURL = dataURL;
                });
              }

              if (data.printBackground) {
                var printBackground = data.printBackground; // log("Character", "Background:", printBackground);

                var bgColours = {
                  magnolia: '#F4E9D8'
                };

                if (has(bgColours, printBackground)) {
                  document.backgroundColour = bgColours[printBackground];
                } else if (printBackground.match(/(#[A-Za-z0-9]{6}|rgb\([0-9]+,[0-9]+,[0-9]+\))/)) {
                  document.backgroundColour = printBackground;
                } else {
                  self.getAsset(printBackground, function (dataURL) {
                    document.backgroundURL = dataURL;
                  });
                }
              } // set target


              if (has(data, "browserTarget") && data.browserTarget) {
                document.browserTarget = data.browserTarget;
                log("Character", "Browser target", data.browserTarget);
              } // TODO set character parameters


              document.printColour = data.printColour;
              document.printIntensity = data.printIntensity;
              document.accentColour = data.accentColour;
              document.watermark = data.printWatermark; // get known vars from the data
              // log("Character", "data", data);

              knownVars.forEach(function (varname) {
                if (has(data, varname)) {
                  var key = toKebabCase(varname);
                  var _value4 = data[varname]; // log("Character", `Var: ${key} = ${JSON.stringify(value)}`);

                  document.setVar(key, _value4, "high");
                }
              }); // log("Character", "Document vars", document.vars);
              // load units

              document.isLoggedIn = data.isLoggedIn;
              var units = system.getUnits(data.units);
              units = system.inferUnits(units); // log("Character", "Inferred units:", units.map(unit => unit.id).sort().join(", "));
              // infer the title from the units

              var title = __("Character");

              var summary = __("Character");

              switch (system.code) {
                case 'pathfinder2':
                  title = pathfinder2Title(units, document, data, true);
                  summary = pathfinder2Title(units, document, data, false);
                  break;
              }

              document.title = title;
              document.summary = summary; // make the element tree

              units.forEach(function (unit) {
                return document.addUnit(unit);
              });
              document.composeDocument(self.registry);
              self.loadQueue.ready(function () {
                events.emit('createElementTree', {
                  elementTree: document.doc,
                  title: document.title,
                  summary: summary,
                  request: self.request
                }); // render the document

                var data = document.renderDocument(self.registry);
                events.emit('render', {
                  data: data,
                  title: document.title,
                  summary: summary,
                  mimeType: "text/html",
                  request: self.request
                });
                resolve({
                  data: data,
                  filename: title + ".html",
                  mimeType: "text/html"
                });
              });
            } catch (err) {
              error$1("Character", "Error:", err);
              reject({
                error: err
              });
            }
          });
        });
      });
    }
  }]);

  return Character;
}(Instance);

function pathfinder2Title(units, doc, data, includeName) {
  var parts = {
    name: includeName ? data.name : '',
    ancestry: '',
    class: '',
    archetypes: ''
  };

  function getUnits(group) {
    return units.filter(function (unit) {
      return unit.in == group;
    });
  }

  var ancestry = getUnits("ancestry");

  if (!isEmpty$1(ancestry)) {
    ancestry = ancestry[0];
    parts["ancestry"] = __(ancestry.name, doc);
    var heritage = getUnits("heritage/");

    if (!isEmpty$1(heritage)) {
      heritage = heritage[0];
      parts["ancestry"] = __(heritage.name, doc);
    }
  }

  var cls = getUnits("class");

  if (!isEmpty$1(cls)) {
    cls = cls[0];
    parts["class"] = __(cls.name, doc);
  }

  var archetypes = getUnits("archetype");

  if (!isEmpty$1(archetypes)) {
    parts["archetypes"] = archetypes.map(function (arch) {
      return __(arch.name, doc);
    }).join(" "); // log("Character", "Archetypes:", parts["archetypes"]);
  }

  var template = isEmpty$1(parts.name) ? "_{#{ancestry} #{class} #{archetypes}}" : "_{#{name}, #{ancestry} #{class} #{archetypes}}";
  var title = interpolate(__(template, doc), parts);
  title = title.replace(/  +/g, ' ');
  title = title.replace(/^ +/, '');
  title = title.replace(/ +$/, '');
  if (title == "") title = "Character";
  return title;
}

function parseParty(primary, request) {
  var attr = Object.assign({
    game: 'pathfinder2',
    language: 'en',
    members: []
  }, primary.attributes);
  return attr;
}
/**
 * Class representing character sheets for a whole party.
 */


var Party = /*#__PURE__*/function (_Instance2) {
  _inherits(Party, _Instance2);

  var _super2 = _createSuper(Party);

  function Party(primary, request, registry) {
    var _this13;

    _classCallCheck(this, Party);

    _this13 = _super2.call(this);
    _this13.registry = registry;
    _this13.data = parseParty(primary);
    var characterDefaults = {
      game: _this13.data.game,
      language: _this13.data.language
    };
    _this13.members = _this13.data.members.map(function (chardesc) {
      chardesc = Object.assign({}, characterDefaults, chardesc);
      return new Character(chardesc, request, registry);
    }); // log("Party", "Members:", this.members);

    return _this13;
  }
  /**
   * Turn this party request into an array of character sheets.
   * @returns {Promise} Promise representing the resulting character sheets.
   */


  _createClass(Party, [{
    key: "render",
    value: function render() {
      var _this14 = this;

      return new Promise(function (resolve, reject) {
        log("Party", "Render");
        var files = [];
        var promises = []; // collect the character sheets

        _this14.members.forEach(function (member) {
          var promise = member.render().then(function (response) {
            files.push(response);
          });
          promises.push(promise);
        }); // 


        Promise.all(promises).then(function () {
          // log("Party", `Rendered ${files.length} members`);
          resolve(files);
        });
      });
    }
  }]);

  return Party;
}(Instance);

var GM_Instance = /*#__PURE__*/function (_Instance3) {
  _inherits(GM_Instance, _Instance3);

  var _super3 = _createSuper(GM_Instance);

  function GM_Instance(request, registry) {
    var _this15;

    _classCallCheck(this, GM_Instance);

    _this15 = _super3.call(this);
    _this15.registry = registry;
    _this15.request = request;
    return _this15;
  }

  _createClass(GM_Instance, [{
    key: "parseGM_Instance",
    value: function parseGM_Instance(primary, request) {
      var attr = _objectSpread({
        optionPermission: false,
        isLoggedIn: false
      }, primary.attributes);

      if (attr.optionPermission) {
        this.data.units.push("option/permission");
      }

      this.data.isLoggedIn = attr.isLoggedIn;
      this.data.units = [].concat(_toConsumableArray(this.data.units), _toConsumableArray(this.getDataUnits(attr.isLoggedIn)));
    }
  }, {
    key: "render",
    value: function render() {
      var _this16 = this;

      var self = this;
      var data = this.data;
      return new Promise(function (resolve, reject) {
        log("GM", "Units: ".concat(_this16.data.units));
        ready(function () {
          try {
            var system = getSystem(data.game);

            if (system === null) {
              error("Character", "System not found:", data.game);
              reject();
              return;
            } // start with a document


            var documentUnit = system.getUnit("document");
            var document = new Document(documentUnit, data.id); // language

            document.language = data.language;

            if (data.printLarge) {
              document.largePrint = true;
            }

            if (data.printHighContrast) {
              document.highContrast = true;
            }

            if (data.printDyslexic && (data.printDyslexicFont == 'dyslexie' || data.printDyslexicFont == 'lexend')) {
              document.skipOptional = true;
            } // Load assets


            if (data.favicon) {
              self.getAsset(data.favicon, function (dataURL) {
                if (data.favicon.match(/\.svg$/) && !isEmpty$1(data.printColour)) {
                  var colour = vibrantColour(data.printColour);
                  dataURL = replaceColours(dataURL, colour);
                }

                document.faviconURL = dataURL;
              });
            }

            if (data.printBackground) {
              var printBackground = data.printBackground;
              var bgColours = {
                magnolia: '#F4E9D8'
              };

              if (has(bgColours, printBackground)) {
                document.backgroundColour = bgColours[printBackground];
              } else if (printBackground.match(/(#[A-Za-z0-9]{6}|rgb\([0-9]+,[0-9]+,[0-9]+\))/)) {
                document.backgroundColour = printBackground;
              } else {
                self.getAsset(printBackground, function (dataURL) {
                  document.backgroundURL = dataURL;
                });
              }
            } // set character parameters


            document.printColour = data.printColour;
            document.printIntensity = data.printIntensity;
            document.accentColour = data.accentColour;
            document.watermark = data.printWatermark;
            self.completeDocument(document);
            document.isLoggedIn = data.isLoggedIn;
            var units = system.getUnits(data.units);
            units = system.inferUnits(units); // make the element tree

            units.forEach(function (unit) {
              return document.addUnit(unit);
            });
            document.composeDocument(self.registry);
            self.loadQueue.ready(function () {
              events.emit('createElementTree', {
                elementTree: document.doc,
                title: document.title,
                request: self.request
              }); // render the document

              var data = document.renderDocument(self.registry);
              events.emit('render', {
                data: data,
                title: document.title,
                mimeType: "text/html",
                request: self.request
              });
              resolve({
                data: data,
                filename: document.title + ".html",
                mimeType: "text/html"
              });
            });
          } catch (err) {
            error("Character", "Error:", err);
            reject({
              error: err
            });
          }
        });
      });
    }
  }]);

  return GM_Instance;
}(Instance);

function parseGM_Party(primary, request) {
  // attributes
  var attr = _objectSpread({
    game: 'pathfinder2',
    theme: 'adventurer',
    language: 'en',
    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,
    printDyslexicFont: 'sans',
    printColour: '#707070',
    accentColour: '',
    colors: [],
    printIntensity: 0,
    printWatermark: '',
    printBackground: false
  }, primary.attributes);

  var gm = {
    id: primary.id,
    game: attr.game,
    units: ['core', 'base', 'base/gm/party', 'theme/' + attr.theme],
    language: attr.language,
    printLarge: attr.printLarge,
    printHighContrast: attr.printHighContrast,
    printDyslexic: attr.printDyslexic,
    printDyslexicFont: attr.printDyslexicFont,
    printColour: attr.printColour,
    accentColour: attr.accentColour,
    colors: attr.colors,
    printIntensity: attr.printIntensity,
    printLogo: attr.printLogo,
    favicon: 'favicon.svg',
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,
    debug: primary.debug,
    instances: {}
  };

  if (isEmpty$1(gm.accentColour)) {
    gm.accentColour = adjustColour('#707070', gm.printColour, gm.printIntensity);
  } // accessibility options


  if (attr.printLarge) {
    gm.units.push('large-print');
  }

  if (attr.printHighContrast) {
    gm.units.push('high-contrast');
  }

  if (attr.printDyslexic) {
    switch (attr.printDyslexicFont) {
      case 'dyslexie':
        char.units.push('dyslexie');
        break;

      case 'lexend':
        char.units.push('lexend');
        break;

      default:
        char.units.push('dyslexic');
        break;
    }
  } // game-specific settings


  switch (attr.game) {
    case 'pathfinder2':
      ["party", "npc-party", "npc"].forEach(function (option) {
        var optionKey = "option-gm-" + option;

        if (has(attr, optionKey) && optionKey) {
          gm.units.push("option/gm/" + option);
        }
      });
      break;
  } // included assets


  ["printLogo", "printBackground"].forEach(function (field) {
    if (attr[field]) {
      var id = attr[field]; // log("Character", "Asset:", field, "=", id);

      var instance = request.getInstance(id);

      if (!isNull(instance)) {
        // log("Character", "Asset known:", field, "=", id);
        gm.instances[id] = instance.attributes;
      }
    }
  });
  return gm;
}

var GM_Party = /*#__PURE__*/function (_GM_Instance) {
  _inherits(GM_Party, _GM_Instance);

  var _super4 = _createSuper(GM_Party);

  function GM_Party(primary, request, registry) {
    var _this17;

    _classCallCheck(this, GM_Party);

    _this17 = _super4.call(this, request, registry);
    _this17.data = parseGM_Party(primary, request);

    _this17.parseGM_Instance(primary, request);

    return _this17;
  }

  _createClass(GM_Party, [{
    key: "completeDocument",
    value: function completeDocument(document) {
      document.title = "Party"; // log("GM", "Colors", this.data.colors);

      this.data.colors.forEach(function (color, i) {
        // log("GM", "Adding color", i, color);
        // TODO custom Sass compilation for color blocks
        var css = "\".color--color_".concat(i, " p, .color--color_").concat(i, " label, .color--color_").concat(i, " span { color: black; }");
        document.cssParts.push(css);
      });
    }
  }]);

  return GM_Party;
}(GM_Instance);

function parseGM_Maps(primary, request) {
  // attributes
  var attr = _objectSpread({
    game: 'pathfinder2',
    theme: 'adventurer',
    language: 'en',
    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,
    printDyslexicFont: 'sans',
    mapView: "2d",
    printColour: '#707070',
    accentColour: '',
    colors: [],
    printIntensity: 0,
    printWatermark: '',
    printBackground: false
  }, primary.attributes);

  var gm = {
    id: primary.id,
    game: attr.game,
    units: ['core', 'base', 'base/gm/maps', 'theme/' + attr.theme],
    language: attr.language,
    printLarge: attr.printLarge,
    printHighContrast: attr.printHighContrast,
    printDyslexic: attr.printDyslexic,
    printDyslexicFont: attr.printDyslexicFont,
    mapView: attr.mapView,
    printColour: attr.printColour,
    accentColour: attr.accentColour,
    colors: attr.colors,
    printIntensity: attr.printIntensity,
    printLogo: attr.printLogo,
    favicon: 'favicon.svg',
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,
    debug: primary.debug,
    instances: {}
  };

  if (isEmpty$1(gm.accentColour)) {
    gm.accentColour = adjustColour('#707070', gm.printColour, gm.printIntensity);
  } // accessibility options


  if (attr.printLarge) {
    gm.units.push('large-print');
  }

  if (attr.printHighContrast) {
    gm.units.push('high-contrast');
  }

  if (attr.printDyslexic) {
    switch (attr.printDyslexicFont) {
      case 'dyslexie':
        char.units.push('dyslexie');
        break;

      case 'lexend':
        char.units.push('lexend');
        break;

      default:
        char.units.push('dyslexic');
        break;
    }
  } // included assets


  ["printLogo", "printBackground"].forEach(function (field) {
    if (attr[field]) {
      var id = attr[field]; // log("Character", "Asset:", field, "=", id);

      var instance = request.getInstance(id);

      if (!isNull(instance)) {
        // log("Character", "Asset known:", field, "=", id);
        gm.instances[id] = instance.attributes;
      }
    }
  });

  if (gm.mapView == "3d") {
    gm.units.push('option/gm/maps-3d');
  } else {
    gm.units.push('option/gm/maps-2d');
  }

  return gm;
}

var GM_Maps = /*#__PURE__*/function (_GM_Instance2) {
  _inherits(GM_Maps, _GM_Instance2);

  var _super5 = _createSuper(GM_Maps);

  function GM_Maps(primary, request, registry) {
    var _this18;

    _classCallCheck(this, GM_Maps);

    _this18 = _super5.call(this, request, registry);
    _this18.data = parseGM_Maps(primary, request);

    _this18.parseGM_Instance(primary, request);

    return _this18;
  }

  _createClass(GM_Maps, [{
    key: "completeDocument",
    value: function completeDocument(document) {
      document.title = "Maps";
    }
  }]);

  return GM_Maps;
}(GM_Instance);

var Build = /*#__PURE__*/function () {
  function Build(primary, request, registry) {
    _classCallCheck(this, Build);

    var attr = _objectSpread({
      game: 'pathfinder2',
      theme: 'adventurer',
      language: 'en'
    }, primary.attributes);

    this.data = {
      game: attr.game,
      units: ['core', 'option/build', 'theme/' + attr.theme],
      language: attr.language
    };
    this.registry = registry;
    this.request = request;
    this.loadQueue = new LoadQueue();
  }

  _createClass(Build, [{
    key: "render",
    value: function render() {
      var _this19 = this;

      return new Promise(function (resolve, reject) {
        ready(function () {
          try {
            log("Build", "Data", _this19.data);
            var system = getSystem(_this19.data.game);
            var documentUnit = system.getUnit("document");
            var document = new Document(documentUnit);
            document.language = _this19.data.language;
            var units = system.getUnits(_this19.data.units);
            units = system.inferUnits(units);
            log("Build", "Units", units.map(function (unit) {
              return unit.name;
            }));
            units.forEach(function (unit) {
              return document.addUnit(unit);
            });
            document.composeDocument(_this19.registry);
            document.title = "Build a character"; // log("Build", "Document", document);
            // render the document

            var data = document.renderDocument(_this19.registry);
            resolve({
              data: data,
              filename: document.title + ".html",
              mimeType: "text/html"
            });
          } catch (err) {
            error$1("Build", "Error:", err);
            reject({
              error: err
            });
          }
        });
      });
    }
  }]);

  return Build;
}();

function parseCustom(primary, request) {
  var attr = _objectSpread({
    name: false,
    custom: '',
    theme: 'adventurer',
    language: 'en',
    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,
    printDyslexicFont: 'sans',
    miniSize: 'medium',
    printColour: '#707070',
    accentColour: '',
    printIntensity: 0,
    printWatermark: '',
    printLogo: false,
    printPortrait: false,
    animalPortrait: false,
    printBackground: false
  }, primary.attributes);

  var custom = _objectSpread({
    units: ['core', 'custom/' + attr.custom, 'theme/' + attr.theme]
  }, attr); // accessibility options


  if (attr.printLarge) {
    custom.units.push('large-print');
  }

  if (attr.printHighContrast) {
    custom.units.push('high-contrast');
  }

  if (attr.printDyslexic) {
    switch (attr.printDyslexicFont) {
      case 'dyslexie':
        custom.units.push('dyslexie');
        break;

      case 'lexend':
        custom.units.push('lexend');
        break;

      default:
        custom.units.push('dyslexic');
        break;
    }
  } // done
  // log("Custom", "Custom data", custom);


  return custom;
}

var Custom = /*#__PURE__*/function (_Instance4) {
  _inherits(Custom, _Instance4);

  var _super6 = _createSuper(Custom);

  function Custom(primary, request, registry) {
    var _this20;

    _classCallCheck(this, Custom);

    _this20 = _super6.call(this);
    _this20.registry = registry;
    _this20.request = request;
    _this20.promise = new Promise(function (resolve, reject) {
      ready(function () {
        _this20.request = request;
        _this20.data = parseCustom(primary);
        resolve(_this20.data);
      });
    });
    return _this20;
  }
  /**
   * Turn this request into a real character sheet.
   * @returns {Promise} Promise representing the resulting character sheet.
   */


  _createClass(Custom, [{
    key: "render",
    value: function render() {
      var _this21 = this;

      var self = this; // const data = this.data;

      var promise = this.promise;
      return new Promise(function (resolve, reject) {
        promise.then(function (data) {
          log("Custom", "Units: ".concat(_this21.data.units));
          ready(function () {
            try {
              var system = getSystem('premium');

              if (system === null) {
                error$1("Custom", "System not found:", data.game);
                reject();
                return;
              } // start with a document


              var documentUnit = system.getUnit("document");
              var document = new Document(documentUnit, data.id);
              document.request = _this21.request; // language

              document.language = data.language;
              document.setVar('character-name', data.name);
              document.setVar('description', data.description);

              if (data.printLarge) {
                document.largePrint = true;
              }

              if (data.printHighContrast) {
                document.highContrast = true;
              }

              if (data.printDyslexic && (data.printDyslexicFont == 'dyslexie' || data.printDyslexicFont == 'lexend')) {
                document.skipOptional = true;
              } // Load assets


              if (data.favicon) {
                self.getAsset(data.favicon, function (dataURL) {
                  if (data.favicon.match(/\.svg$/) && !isEmpty(data.printColour)) {
                    var colour = vibrantColour(data.printColour);
                    dataURL = replaceColours(dataURL, colour);
                  }

                  document.faviconURL = dataURL;
                });
              }

              if (data.printLogo) {
                self.getAsset(data.printLogo, function (dataURL) {
                  document.logoURL = dataURL;
                });
              }

              if (data.printPortrait) {
                self.getAsset(data.printPortrait, function (dataURL) {
                  document.portraitURL = dataURL;
                });
              }

              if (data.animalPortrait) {
                self.getAsset(self.data.animalPortrait, function (dataURL) {
                  document.animalURL = dataURL;
                });
              }

              if (data.printBackground) {
                var printBackground = data.printBackground; // log("Custom", "Background:", printBackground);

                var bgColours = {
                  magnolia: '#F4E9D8'
                };

                if (has(bgColours, printBackground)) {
                  document.backgroundColour = bgColours[printBackground];
                } else if (printBackground.match(/(#[A-Za-z0-9]{6}|rgb\([0-9]+,[0-9]+,[0-9]+\))/)) {
                  document.backgroundColour = printBackground;
                } else {
                  self.getAsset(printBackground, function (dataURL) {
                    document.backgroundURL = dataURL;
                  });
                }
              } // set target


              if (has(data, "browserTarget") && data.browserTarget) {
                document.browserTarget = data.browserTarget;
                log("Custom", "Browser target", data.browserTarget);
              } // TODO set character parameters


              document.printColour = data.printColour;
              document.printIntensity = data.printIntensity;
              document.accentColour = data.accentColour;
              document.watermark = data.printWatermark; // get known vars from the data
              // log("Custom", "data", data);
              // knownVars.forEach(varname => {
              //   if (has(data, varname)) {
              //     const key = toKebabCase(varname);
              //     const value = data[varname];
              //     // log("Custom", `Var: ${key} = ${JSON.stringify(value)}`);
              //     document.setVar(key, value, "high");
              //   }
              // });
              // log("Custom", "Document vars", document.vars);
              // load units

              data.units.push("data");
              var units = system.getUnits(data.units);
              units = system.inferUnits(units); // log("Custom", "Inferred units:", units.map(unit => unit.id).sort());
              // infer the title from the units

              var title = data.name;
              document.title = title; // make the element tree

              units.forEach(function (unit) {
                return document.addUnit(unit);
              });
              document.composeDocument(self.registry);
              self.loadQueue.ready(function () {
                events.emit('createElementTree', {
                  elementTree: document.doc,
                  title: document.title,
                  request: self.request
                }); // render the document

                var data = document.renderDocument(self.registry);
                events.emit('render', {
                  data: data,
                  title: document.title,
                  mimeType: "text/html",
                  request: self.request
                });
                resolve({
                  data: data,
                  filename: title + ".html",
                  mimeType: "text/html"
                });
              });
            } catch (err) {
              error$1("Custom", "Error:", err);
              reject({
                error: err
              });
            }
          });
        });
      });
    }
  }]);

  return Custom;
}(Instance);

function randomID() {
  return Math.random().toString(16).substring(2, 9);
}

var Request = /*#__PURE__*/function () {
  function Request(chardesc) {
    _classCallCheck(this, Request);

    this.instances = {};
    this.primary = [];
    events.emit('request', {
      request: chardesc
    });
    this.parse(chardesc);
  }

  _createClass(Request, [{
    key: "parse",
    value: function parse(request) {
      var _this22 = this;

      // log("Request", "Parsing request", request);
      // included instances go first, in case there's an ID conflict
      if (has(request, "included")) {
        if (isArray(request.included)) {
          request.included.forEach(function (instance) {
            return _this22.addInstance(instance, false);
          });
        }
      } // primary data may be one item or several


      if (isArray(request.data)) {
        request.data.forEach(function (instance) {
          return _this22.addInstance(instance, true);
        });
      } else {
        this.addInstance(request.data, true);
      }
    }
  }, {
    key: "addInstance",
    value: function addInstance(instance, primary) {
      if (!has(instance, "id")) instance.id = randomID();
      this.instances[instance.id] = instance;
      if (primary) this.primary.push(instance);
    }
  }, {
    key: "getInstance",
    value: function getInstance(id) {
      if (has(this.instances, id)) {
        // log("Request", "getInstance: found", id);
        return this.instances[id];
      } // log("Request", "getInstance: not found", id);


      return null;
    }
  }, {
    key: "getPrimaries",
    value: function getPrimaries(registry) {
      var _this23 = this;

      //   log("Request", "getPrimaries", this.primary);
      //   log("Request", "Instances", this.instances);
      // log("Request", "Known instances:", Object.keys(this.instances));
      var primaries = this.primary.map(function (primary) {
        // swap in linked instances
        if (has(primary, "relationships")) {
          Object.keys(primary.relationships).forEach(function (relkey) {
            primary.attributes[relkey] = primary.relationships[relkey].data.flatMap(function (link) {
              if (has(_this23.instances, link.id)) {
                return [_this23.instances[link.id]];
              } else {
                return [];
              }
            }); // log("Request", "Substituted relationships: ", relkey, "=", primary.attributes[relkey]);
          });
        }

        return primary;
      });
      return primaries.map(function (primary) {
        // log("Request", "Primary", primary);
        switch (primary.type) {
          case 'character':
            return new Character(primary, _this23, registry);

          case 'party':
            return new Party(primary, _this23, registry);

          case 'gm':
            switch (primary.attributes['gm']) {
              case 'characters':
                return new GM_Party(primary, _this23, registry);

              case 'maps':
                return new GM_Maps(primary, _this23, registry);

              default:
                warn$1("Request", "No valid primary in GM request");
            }

          case 'quick':
            switch (primary.attributes['quick']) {
              case 'build':
                return new Build(primary, _this23, registry);
            }

          case 'custom':
            return new Custom(primary, _this23, registry);

          default:
            warn$1("Request", "No valid primary in request");
            return null;
        }
      });
    }
  }]);

  return Request;
}();

var promises$1 = {};

function getFormData(system) {
  if (!has(promises$1, system)) {
    var promise = new Promise(function (resolve, reject) {
      ready(function () {
        var formDataFile = "".concat(__dirname, "/data-").concat(system, ".json");
        log('formdata', 'Loading file', formDataFile);
        fs$1.readFile(formDataFile, 'utf-8', function (err, data) {
          if (err) {
            error$1('formdata', "Error loading form data ".concat(formDataFile, ":"), err);
            reject(err);
          } else {
            log('formdata', 'Loaded file', formDataFile);
            var formdata = JSON.parse(data);
            resolve(formdata);
          }
        });
      });
    });
    promises$1[system] = promise;
    return promise;
  }

  return promises$1[system];
}
/**
 * Dyslexic Character Sheets module.
 * @module dyslexic-charactersheets
 */
// start this first, it's the slow bit


loadSystemData(['common', 'pathfinder2', 'premium']);
var registry = new Registry();
/**
 * Register for events emitted by the character sheet builder. Known events include 'request', 'createElementsTree', 'render' and 'error'.
 *
 * @param {string} evt - The event code
 * @param  {...any} params - A list of parameters
 */

function on(evt) {
  for (var _len5 = arguments.length, params = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    params[_key5 - 1] = arguments[_key5];
  }

  events.on.apply(events, [evt].concat(params));
}
/**
 * Event emitted when a client has requested a character sheet.
 *
 * @error CharacterSheets#request
 * @type {object}
 * @property {Object} request - The request object.
 */

/**
 * Event emitted when a character sheet request has been compiled into an element tree.
 *
 * @error CharacterSheets#createElementTree
 * @type {object}
 * @property {Object} elementTree - The compiled element tree.
 * @property {string} title - The title of the character sheet.
 * @property {Object} request - The request object.
 */

/**
 * Event emitted when a character sheet request has been rendered into an HTML document.
 *
 * @error CharacterSheets#render
 * @type {object}
 * @property {string} data - The rendered document.
 * @property {string} title - The title of the character sheet.
 * @property {string} mimeType - the MIME type of the character sheet.
 * @property {Object} request - The request object.
 */

/**
 * Event emitted when an error occurs while creating a character sheet.
 *
 * @error CharacterSheets#error
 * @type {Error}
 */

/**
 * Create a character sheet object.
 *
 * @param {Object} chardesc - A character description object.
 * @returns {Promise} A promise representing a character, party or GM object.
 * @fires CharacterSheets#request
 * @fires CharacterSheets#createElementTree
 * @fires CharacterSheets#render
 * @fires CharacterSheets#error
 */


function create(chardesc) {
  return new Promise(function (resolve, reject) {
    try {
      if (isNull(chardesc)) {
        warn("lib", "Null data");
        return null;
      }

      var request = new Request(chardesc);
      var primaries = request.getPrimaries(registry);

      var _promises = primaries.map(function (p) {
        return p.render();
      });

      Promise.all(_promises).then(function () {
        _promises[0].then(function (result) {
          resolve(result);
        });
      });
    } catch (err) {
      error$1("lib", "Error", err);
      reject(err);
    }
  });
}

exports.addAssetsDir = addAssetsDir;
exports.addTranslationData = addTranslationData;
exports.addTranslator = addTranslator;
exports.create = create;
exports.getFormData = getFormData;
exports.loadDefaultTranslations = loadDefaultTranslations;
exports.loadTranslations = loadTranslations;
exports.on = on;