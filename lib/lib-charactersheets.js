'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ = require('lodash');

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

var color = require('color'); // polyfill for Array.flat and Array.flatMap, which aren't well supported even with Babel
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
      // return Array.prototype.map.apply(this, arguments).flat();
      var parts = Array.prototype.map.apply(this, arguments); // console.log(parts);

      return parts.flat();
    },
    writable: true
  });
} // Escape strings for HTML


function esc(content) {
  var newlines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  content = _.escape(content);
  content = content.replace(/’/g, '&rsquo;').replace(/‘/g, '&lsquo;');
  content = content.replace(/—/g, '&mdash;');
  content = content.replace(/&amp;(.+);/, '&$1;');

  if (newlines) {
    content = content.replace(/[\n\r]+/g, '<br>');
  }

  return content;
}

function elementID(element) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (id === null || id == '' || id == 'null') {
    return '';
  }

  return " id='".concat(element, "-").concat(id, "'");
}

function pickMods(args, keys) {
  return _.flatMap(args, function (v, k) {
    if (isString(v)) v = v.replace(/#\{.*?\}/g, '');
    return v && keys.includes(k) && !isEmpty(v) && v != 'false' ? [k] : [];
  });
}

function pickAttribs(args, keys) {
  return _.pick(args, keys);
} // Convert string case


function splitAnyCase(str) {
  var words = str.split(/[ _/-]+/);
  words = words.flatMap(function (word) {
    return word.split(/([A-Z][a-z]+)/);
  });
  words = words.map(function (word) {
    return word.toLowerCase();
  });
  words = words.filter(function (word) {
    return word != "";
  });
  return words;
}

function toKebabCase(str) {
  // convert-a-string-to-kebab-case
  var words = splitAnyCase(str);
  return words.join("-");
}

function toCamelCase(str) {
  // convertAStringToCamelCase
  var words = splitAnyCase(str);
  words = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
  words[0] = words[0].toLowerCase();
  return words.join("");
}

function toTitleCase(str) {
  // Convert A String To Title Case
  var words = str.split(" ");
  words = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
  return words.join(" ");
}

function clone(original) {
  if (isArray(original)) {
    return Array.from(original);
  }

  if (isObject(original)) {
    return Object.assign({}, original);
  }

  return original;
}

function elementClass(block) {
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var modKeys = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var attribDefs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var cls = [];
  var prefix = block;

  if (element !== null) {
    prefix = "".concat(block, "__").concat(element);
  } // console.log("["+block+" class] Prefix:", prefix);
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
  } // mods are single-word adjectives, eg


  var mods = pickMods(args, modKeys); // console.log("["+block+" class] Mods:", mods);

  mods.forEach(function (mod) {
    switch (mod) {
      // global mods that don't need a prefix
      // case 'align':
      //     cls.push(``)
      //     break;
      case 'shade':
      case 'lp':
        cls.push(mod);
        break;

      default:
        cls.push("".concat(prefix, "--").concat(mod));
    }
  }); // attribs are key-values, eg align=left

  var attribKeys;

  if (Array.isArray(attribDefs)) {
    attribKeys = attribDefs;
    attribDefs = {};
  } else {
    attribKeys = _.keys(attribDefs);
  }

  var attribs = pickAttribs(args, attribKeys); // console.log("["+block+" class] Attribs:", attribs);

  Object.entries(attribs).forEach(function (pair) {
    var key = pair[0];
    var value = pair[1];
    if (value === null || isEmpty(value)) return; // console.log("  -", key, " = ", value);
    // some default values can be skipped
    // switch (key) {
    //     case 'frame': if (value == 'normal') return;
    //     case 'control': if (value == 'input') return;
    // }

    if (has(attribDefs, key) && value == attribDefs[key]) return;

    switch (key) {
      // global attributes that don't need a prefix
      case 'align':
      case 'valign':
      case 'lp':
      case 'icon':
      case 'flex':
        cls.push("".concat(key, "_").concat(value));
        break;

      default:
        cls.push("".concat(prefix, "--").concat(key, "_").concat(value));
        break;
    }
  }); // the class attr, if needed

  if (isEmpty(cls)) {
    return '';
  }

  return " class='".concat(cls.join(" "), "'");
}

function has(container, property) {
  return container !== null && container.hasOwnProperty(property) && container[property] !== null && container[property] !== undefined;
}

function isNull(val) {
  return val === null || val === undefined;
}

function isEmpty(val) {
  if (val === null || val === undefined) return true;
  if (isString(val)) return val == '';
  if (isArray(val)) return val.length == 0;
  if (isObject(val)) return !Object.entries(val || {}).length;
  return false;
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

function interpolate(template, values) {
  var document = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  // console.log("Interpolate:", template);
  // console.log(" - Values:", values);
  if (template === null) return null;

  if (isString(template)) {
    return template.replace(/#\{(.*?)\}/g, function (tag) {
      var match = tag.match(/#\{(.*?)\}/);
      var index = match[1]; // console.log("Match index:", index);

      if (has(values, index)) {
        // console.log(` - Replacing #{${index}} -> ${values[index]}`);
        return values[index];
      } else if (!isNull(document) && document.hasVar(index)) {
        return document.getVar(index);
      }

      return match[0];
    });
  }

  if (isArray(template)) {
    return template.map(function (item) {
      return interpolate(item, values, document);
    });
  }

  if (isObject(template)) {
    var pairs = _.toPairs(template); // console.log(" - value pairs", pairs);


    pairs = pairs.map(function (pair) {
      return [pair[0], interpolate(pair[1], values, document)];
    }); // console.log(" - processed pairs", pairs);
    // check if the whole object needs replacing

    var first = pairs[0][0];

    if (first == 'param') {
      var paramkey = pairs[0][1];

      if (has(values, paramkey)) {
        return values[paramkey];
      } else if (!isNull(document) && document.hasVar(paramkey)) {
        return document.getVar(paramkey);
      }
    } else if (first == 'item' && has(values, 'item')) {
      return values['item'];
    }

    var obj = _.fromPairs(pairs);

    return obj;
  }

  return template;
}

function replaceColours(str, documentColour, accentColour) {
  // var accentColour = '#a6085e'; // CharacterSheets._current.accentColour
  str = str.replace(/#[0-9a-fA-F]{6}/g, function (c) {
    return adjustColour(c, documentColour);
  });
  str = str.replace(/%23[0-9a-fA-F]{6}/g, function (c) {
    c = c.replace('%23', '#');
    c = adjustColour(c, documentColour);
    c = c.replace('#', '%23');
    return c;
  });
  str = str.replace(/rgba\(.*?,.*?,.*?,(.*?)\)/g, function (c) {
    return adjustColour(c, documentColour);
  }); // (c, opacity) => adjustColourRGBA(c, opacity));

  str = str.replace(/--c-accent/g, accentColour);
  str = str.replace(/="#([0-9a-fA-F]{6})"/g, '="%23$1"');
  return str;
}

function adjustColour(c, documentColour) {
  // var documentColour = '#102820'; // CharacterSheets._current.documentColour
  try {
    var base = color(c);
    var col = color(documentColour);
    var lmin = 16;
    var lightness = base.lightness();
    if (lightness < lmin) lightness = lmin;
    col = col.lightness(lightness); // console.log("Color:", col.hex());
    // console.log(" - lightness:", lightness);
    // reduce the saturation of mid-lightness colours so they don't look too odd
    // enhance the saturation of dark colours so they don't fade away

    var nd = 24;
    var nmid = 50;
    var nlow = nmid - nd;
    var nhigh = nmid + nd;
    var f = 1.3;
    var saturation = col.saturationl(); // console.log(" - saturation:", saturation);

    saturation = saturation + 10;

    if (lightness > nlow && lightness <= nmid) {
      var diff = lightness - nlow;
      saturation -= diff * f;
    } else if (lightness > nmid && lightness < nhigh) {
      var diff = nhigh - lightness;
      saturation -= diff * f;
    }

    if (saturation < 0) saturation = 0;
    if (saturation > 100) saturation = 100; // console.log(" - adjust:", saturation);

    col = col.saturationl(saturation); // readjust the opacity

    var alpha = base.alpha();
    col.alpha(alpha);

    if (alpha != 1) {
      // console.log("Alpha:", alpha);
      var red = Math.round(col.red());
      var green = Math.round(col.green());
      var blue = Math.round(col.blue());
      var result = "rgba(".concat(red, ",").concat(green, ",").concat(blue, ",").concat(alpha, ")"); // console.log(" Alpha colour:", result);

      return result;
    }

    var result = col.hex(); // console.log(" - adjusted:", result);

    return result;
  } catch (x) {
    error("util", "Colour error:", x, x.stack);
    return c;
  }
}

function getLabelHeight(args) {
  if (args === null) return 1;
  if (has(args, "labelHeight")) return args.labelHeight;
  if (has(args, "context") && args.context !== null && has(args.context, "labelHeight")) return args.context.labelHeight;

  switch (args.type) {
    case 'field':
      switch (args.frame) {
        case 'none':
        case 'left':
        case 'right':
        case 'h-label':
        case 'circle':
          return 0;

        default:
          var labelHeight = args.label ? args.label.split(/\n/).length : 0;
          var legendHeight = args.legend ? args.legend.split(/\n/).length : 0;
          return Math.max(labelHeight, legendHeight, 0);
      }

    case 'calc':
      var height = getLabelHeight(args.output);
      args.inputs.forEach(function (field) {
        var h = getLabelHeight(field);
        if (h > height) height = h;
      });
      return height;

    case 'row':
      var height = 0;
      args.contents.forEach(function (field) {
        var h = getLabelHeight(field);
        if (h > height) height = h;
      });
      return height;

    case 'g':
      var height = getLabelHeight(args.contents[0]);
      return height;
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
var advancement = {
  name: 'advancement',
  key: 'id',
  defaults: {
    id: "advancement",
    title: "Advancement",
    start: 1,
    end: 20,
    index: "Level",
    labels: [],
    fields: []
  },
  transform: function transform(args) {
    var columns = [{
      type: "label",
      label: args.index
    }];
    var template = [{
      type: "level-marker",
      marker: '',
      level: '#{level}'
    }]; // if (!isEmpty(args.labels)) {

    columns.push({
      type: "label",
      label: args.title,
      align: "left"
    });
    template.push({
      type: "p",
      content: "#{label}",
      align: "left"
    }); // }

    args.fields.forEach(function (field) {
      var align = has(field, "align") && !isEmpty(field.align) ? field.align : '';
      columns.push({
        type: "label",
        label: field.label,
        align: align,
        shade: has(field, "shade") && field.shade
      });

      if (has(field, "values")) {
        template.push({
          type: "p",
          align: align,
          content: "#{" + field.id + "}"
        });
      } else if (has(field, "template")) {
        field.template.exists = "#{" + field.id + "}";
        template.push(field.template);
      } else {
        template.push({
          type: "field",
          id: args.id + '-#{level}-' + field.id,
          frame: "none",
          control: "checkbox",
          width: "small",
          exists: "#{" + field.id + "}"
        });
      }
    });
    var rows = [];

    var _loop = function _loop() {
      var i = lv - args.start;
      var row = {
        level: lv
      };

      if (i < args.labels.length) {
        row.label = args.labels[i];
      } else {
        row.label = "";
      }

      args.fields.forEach(function (field) {
        if (has(field, "values")) {
          if (i < field.values.length) {
            row[field.id] = field.values[i];
          } else {
            row[field.id] = '';
          }
        } else {
          if (field.levels.includes(lv)) {
            row[field.id] = true;
          } else {
            row[field.id] = false;
          }
        }
      });
      rows.push(row);
    };

    for (var lv = args.start; lv <= args.end; lv++) {
      _loop();
    } // log("advancement", "Rows", rows);


    var table = {
      type: 'table',
      zebra: true,
      collapse: true,
      narrow: true,
      rows: rows,
      columns: columns,
      template: template
    };
    return [table];
  }
};
var article = {
  name: 'article',
  key: 'id',
  defaults: {
    id: '',
    title: false,
    header: [],
    contents: [],
    content: '',
    shade: false,
    'merge-bottom': true,
    annotation: false,
    cat: false,
    level: false,
    'show-cat': false,
    'show-level': false,
    lines: 2
  },
  transform: function transform(args) {
    if (isEmpty(args.header) && isEmpty(args.contents)) {
      var header = [];

      if (args.title) {
        header.push({
          type: 'h6',
          title: args.title
        });
      } else {
        header.push({
          type: 'field',
          id: args.id,
          frame: 'none',
          // size: 'large',
          width: 'stretch'
        });
      }

      if (args.cat || args['show-cat']) {
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
            size: 'large',
            width: 'small'
          });
        }
      }

      var contents = [];

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
          repeat: args.lines,
          width: 'stretch',
          'merge-bottom': args['merge-bottom']
        });
      }

      var _article = {
        type: 'article',
        id: args.id,
        header: [{
          type: 'row',
          contents: header
        }],
        contents: contents,
        shade: false,
        'merge-bottom': true
      };
      return [_article];
    }

    return false;
  },
  render: function render(args, reg, doc) {
    var id = elementID('section', args.id);
    var cls = elementClass('section', null, args, ['shade']);
    var headerElements = args.header;

    if (_.isEmpty(args.header) && args.title != '') {
      headerElements = [{
        type: 'h6',
        title: args.title
      }];
    }

    var header = "<header>".concat(reg.render(args.header, doc), "</header>");
    var dl = ''; // var contents = mergeBottom(args.contents);

    return "<article".concat(id).concat(cls, ">\n            ").concat(header).concat(dl, "\n            <div class='g'>").concat(reg.render(args.contents, doc), "</div>\n            </article>");
  }
};
var blockquote = {
  name: 'blockquote',
  render: function render(args, reg, doc) {
    return "<blockquote>".concat(reg.render(args.contents, doc), "</blockquote>");
  }
};
var calc = {
  name: 'calc',
  // key: 'output',
  defaults: {
    output: {},
    layout: 'left',
    inline: false,
    inputs: []
  },
  render: function render(args, reg, doc) {
    args.labelHeight = getLabelHeight(args);
    args.calc = true;
    var cls = elementClass('row', null, args, ["calc", "inline", "labelHeight"], {
      'layout': 'center'
    }); // parts of the calculation

    var output = Object.assign({
      border: "full"
    }, args.output); // var output = _.defaults(args.output, { "border": "full" });
    // log("-","Output:", output);

    var parts = [output, {
      "type": "span",
      "content": "="
    }].concat(args.inputs.map(function (part) {
      if (typeof part == 'string') {
        return {
          "type": "span",
          "content": part
        };
      }

      return part;
    })); // log("-","Calculation contents", parts);
    // contextual args

    if (args.inline) args.field_frame = "inline";
    return "<div".concat(cls, "><div class='row__inner'>").concat(reg.render(parts, doc), "<div class='spacer'></div></div></div>");
  }
};
var class_icon = {
  name: 'class-icon',
  key: 'icon',
  defaults: {
    icon: '',
    size: 'medium'
  },
  render: function render(args) {
    var cls = elementClass('class-icon', null, args, [], {
      'icon': '',
      'size': 'medium'
    });
    return "<div".concat(cls, "></div>");
  }
};
var each = {
  name: 'each',
  key: '',
  defaults: {
    template: '',
    index: 'i',
    rows: [],
    params: {},
    contents: []
  },
  transform: function transform(args) {
    var i = 0; // log("each", "Items", args.contents);

    return args.contents.flatMap(function (item) {
      i++;

      var values = _.cloneDeep(args.params);

      if (i < args.rows.length && isObject(args.rows[i])) // values = _.defaults(values, args.rows[i]);
        values = Object.assign(args.rows[i], values);
      values['item'] = item;
      values = Object.assign({}, item, values); // values = _.defaults(values, item);

      values[args.index] = i; // log("each", "Template", args.template);
      // log("each", "Interpolating", values);

      var product = interpolate(args.template, values); // log("each", "Product", values);

      return product;
    });
  }
};
var g = {
  name: 'g',
  key: '',
  defaults: {
    contents: [],
    valign: 'center'
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('g', null, args, [], {
      'valign': 'center'
    });
    return "<div".concat(cls, ">").concat(reg.render(args.contents, doc), "</div>");
  }
};

function renderHeading(h) {
  return function (args) {
    // log("headings", "elementClass:", args);
    var cls = elementClass(h, null, args, ['fade', 'bold'], {
      'align': ''
    });
    return "<".concat(h).concat(cls, ">").concat(esc(args.title, true), "</").concat(h, ">");
  };
}

var h1 = {
  name: 'h1',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h1')
};
var h2 = {
  name: 'h2',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h2')
};
var h3 = {
  name: 'h3',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h3')
};
var h4 = {
  name: 'h4',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h4')
};
var h5 = {
  name: 'h5',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h5')
};
var h6 = {
  name: 'h6',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h6')
};
var hr = {
  name: 'hr',
  defaults: {
    swash: false
  },
  render: function render(args) {
    var cls = elementClass('hr', null, args, ['swash']);
    return "<hr".concat(cls, ">");
  }
};
var tail = {
  name: 'tail',
  render: function render(args) {
    args.tail = true;
    var cls = elementClass('hr', null, args, ['tail']);
    return "<hr".concat(cls, ">");
  }
};
var vr = {
  name: 'vr',
  render: function render() {
    return '<span class="vr"></span>';
  }
};
var icon = {
  name: 'icon',
  key: 'icon',
  defaults: {
    icon: ""
  },
  render: function render(args) {
    var cls = elementClass('icon', null, args, [], ["icon", "size"]);
    return "<i".concat(cls, "></i>");
  }
};
var label = {
  name: 'label',
  key: 'label',
  defaults: {
    label: ""
  },
  render: function render(args) {
    var cls = elementClass('label', null, args, [], ["align"]);
    return "<label".concat(cls, ">").concat(esc(args.label, true), "</label>");
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
    contents: []
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('layout', null, args, ['no-flex'], {
      'layout': '',
      'gutter': '',
      'flex': false
    }); // pick a column number

    var columns = args.columns;

    if (columns == 0) {
      switch (args.layout) {
        case '1n':
          columns = 1;
          break;

        case '2e':
        case '2l':
        case '2r':
        case 'alignment':
          columns = 2;
          break;

        case '3e':
          columns = 3;
          break;

        case '5e':
          columns = 5;
          break;

        case '6e':
          columns = 6;
          break;
      }
    } // chunk the contents


    var parts = [];

    if (columns == 0) {
      parts.push(args.contents);
    } else {
      parts = _.chunk(args.contents, columns);
    }

    return parts.map(function (contents) {
      return "<div".concat(cls, ">").concat(reg.render(contents, doc), "</div>");
    }).join("");
  }
};
var level = {
  name: 'level',
  key: 'level',
  defaults: {
    level: 1,
    narrow: true,
    marker: "Level",
    contents: []
  },
  transform: function transform(args) {
    return [{
      type: "layout",
      layout: "level",
      contents: [{
        type: "g",
        contents: [{
          type: "level-marker",
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
    marker: "Level"
  },
  render: function render(args) {
    var level = ("" + args.level).replace(/^\s*/, '').replace(/\s*$/, '');

    if (level == "") {
      return "<div class='level-marker'></div>";
    }

    var marker = args.marker ? "<label>".concat(args.marker, "</label>") : '';
    return "<div class='level-marker'>".concat(marker, "<div class='level-marker__level'>").concat(level, "</div></div>");
  }
};
var list = {
  name: 'list',
  defaults: {
    contents: [],
    columns: 1,
    flowv: true,
    zebra: false,
    flex: false,
    sort: true,
    hr: false,
    vr: false,
    'merge-bottom': false,
    'avoid-shade': false
  },
  render: function render(args, reg, doc) {
    if (args.zebra && args['avoid-shade']) {
      args['zebra-inverse'] = args.contents.length % 2 == 0;
    }

    var cls = elementClass('list', null, args, ["zebra", "zebra-inverse", "collapse", "flex", "vr", "hr", "merge-bottom"], []);
    return "<div".concat(cls, ">").concat(reg.render(args.contents, doc), "</div>");
  },
  transform: function transform(args) {
    if (args.columns == 1) return false; // log("-",`[zone] Split into ${element.columns} columns`);
    // log("-",`[zone] Contents:`, element.contents);

    var cols = [];

    if (args.flowv) {
      for (var i = 0; i < args.columns; i++) {
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

      for (var i = 0; i < args.columns; i++) {
        var contents = args.contents.slice(i * split, (i + 1) * split);
        cols.push(contents);
      }
    }

    return [{
      type: "layout",
      layout: args.columns + "e",
      flex: args.flex,
      contents: cols.map(function (col) {
        return Object.assign({}, args, {
          columns: 1,
          contents: col
        });
      })
    }];
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
var logo = {
  name: 'logo',
  key: 'source',
  defaults: {
    source: ''
  },
  render: function render(args) {
    return "<h1 class='logo'></h1>";
  }
};
var nothing = {
  name: 'nothing',
  transform: function transform(args) {
    return [];
  }
};
var paizoCopyrightAttribution = "<div class='copyright-attribution'><p>\n<b>&copy; Marcus Downing &nbsp; <a href='https://www.dyslexic-charactersheets.com/'>dyslexic-charactersheets.com</a></b>\n<span>This character sheet uses trademarks and/or copyrights owned by Paizo Publishing, LLC, which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This character sheet is not published, endorsed, or specifically approved by Paizo Publishing. For more information about Paizo's Community Use Policy, please visit <a href='http://paizo.com/communityuse'>paizo.com/communityuse</a>. For more information about Paizo Publishing and Paizo products, please visit <a href='http://paizo.com'>paizo.com</a>.</span>        \n</p></div>";
var page = {
  name: 'page',
  key: 'id',
  defaults: {
    name: '',
    order: 10,
    numbered: true,
    flex: false,
    landscape: false
  },
  render: function render(args, reg, doc) {
    var id = elementID('page', args.id);
    var cls = elementClass('page', null, args, ['flex', 'landscape', 'no-bg']);
    var pageNumber = args.numbered ? "<div class='page-number'>".concat(doc.nextPageNumber(), "</div>") : '';
    var copyrightAttribution = paizoCopyrightAttribution;
    if (args.id == 'permission') copyrightAttribution = '';
    var watermark = doc.watermark ? "<div class='page__watermark'><div class='page__watermark__inner'>".concat(doc.watermark, "</div></div>") : '';
    return "<div".concat(id).concat(cls, ">\n      ").concat(copyrightAttribution).concat(pageNumber).concat(watermark, "\n      <div class='page__contents'>").concat(reg.render(args.contents, doc), "</div>\n      </div>\n      ");
  }
};
var p = {
  name: 'p',
  key: 'content',
  defaults: {
    prose: false,
    content: '',
    align: 'left'
  },
  render: function render(args) {
    var cls = elementClass('p', null, args, ['prose'], ['align', 'size']); // var paras = args.content.split(/[\n\r]/);

    return "<p".concat(cls, ">").concat(esc(args.content, true), "</p>");
  }
};
var ul = {
  name: 'ul',
  render: function render(args, reg, doc) {
    return "<ul>".concat(reg.render(args.contents, doc), "</ul>");
  }
};
var li = {
  name: 'li',
  key: 'content',
  defaults: {
    content: ''
  },
  render: function render(args) {
    return "<li>".concat(esc(args.content, true), "</li>");
  }
};
var portrait = {
  name: 'portrait',
  key: 'char',
  defaults: {
    overprint: false,
    char: 'personal'
  },
  render: function render(args) {
    // TODO get the right copyright attribution from the data
    var copyright = "Image &copy; Paizo Publishing";
    var cls = elementClass('portrait', null, args, ['overprint'], {
      'char': ''
    });
    return "<figure".concat(cls, "><div class='portrait__inner'></div><figcaption>").concat(copyright, "</figcaption></figure>");
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
      layout: "level",
      contents: [{
        type: "icon",
        icon: icon
      }, contents]
    }];
  }
};
var action = {
  name: 'action',
  key: 'action',
  defaults: {
    action: 1,
    contents: []
  },
  transform: function transform(args) {
    var icon = 'action';

    switch (args.action) {
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

    return [{
      type: "layout",
      layout: "level",
      contents: [{
        type: "icon",
        icon: icon
      }, {
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
    contents: []
  },
  transform: function transform(args) {
    return [{
      type: "layout",
      layout: "level",
      contents: [{
        type: "g",
        contents: [{
          type: "field",
          id: args.id,
          control: 'checkbox',
          frame: 'none'
        }]
      }, {
        type: "g",
        contents: args.contents
      }]
    }];
  }
};
var repeat = {
  name: 'repeat',
  key: 'repeat',
  defaults: {
    repeat: 1,
    index: "i",
    rows: []
  },
  transform: function transform(args) {
    var contents = [];

    for (var i = 1; i <= args.repeat; i++) {
      var vars = {};

      if (i <= args.rows.length) {
        vars = args.rows[i - 1];
      }

      vars[args.index] = i;
      var items = interpolate(args.contents, vars);
      contents = contents.concat(items);
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
    narrow: false
  },
  render: function render(args, reg, doc) {
    args.lp = getLabelHeight(args);
    var cls = elementClass('row', null, args, ['unlabelled', 'narrow'], {
      'layout': 'left',
      'valign': 'bottom',
      'lp': ''
    });
    return "<div".concat(cls, "><div class='row__inner'>").concat(reg.render(args.contents, doc), "</div></div>");
  }
};
var section = {
  name: 'section',
  key: 'title',
  defaults: {
    title: '',
    fill: false,
    flex: 'medium',
    untitled: false,
    contents: []
  },
  render: function render(args, reg, doc) {
    var cls = elementClass('section', null, args, ['primary', 'fill', 'untitled'], {
      flex: 'medium'
    });
    var title = args.untitled ? '' : "<h3>".concat(esc(args.title), "</h3>"); // var content = (args.contents.length == 1 && args.contents[0].type == "g") ? render(args.contents) : `<div class='g'>${render(args.contents)}</div>`;

    var content = "<div class='section__inner'>".concat(reg.render(args.contents, doc), "</div>");
    return "<section".concat(cls, ">").concat(title, "\n            ").concat(content, "\n            </section>");
  }
};
var slots = {
  name: 'slots',
  key: 'slots',
  defaults: {
    slots: [],
    key: 'level',
    placeholder: null,
    max: false,
    min: false,
    contents: []
  },
  transform: function transform(args, ctx) {
    // log("slots", "Slots:", args.slots);
    var placeholder = args.placeholder;
    if (!Array.isArray(placeholder)) placeholder = [placeholder];

    function slotItems(items) {
      // log("slots", "Items", items);
      if (args.min && items.length < args.min) {
        var n = args.min - items.length;

        for (var i = 0; i < n; i++) {
          // log("slots","Placeholder", args.placeholder);
          items = items.concat(_.cloneDeep(args.placeholder));
        }
      }

      if (args.max && items.length > args.max) {
        items = items.slice(0, args.max);
      }

      return items;
    }

    if (args.slots === null || args.slots == []) {
      // log("slots", "Slots item:", args);
      // log("slots","Single slot");
      return slotItems(args.contents);
    }

    var slots = {};
    args.slots.forEach(function (s) {
      slots[s] = {
        key: s,
        contents: []
      };
      slots[s][args.key] = s;
    }); // log("slots","Filled", slots);

    args.contents.forEach(function (item) {
      if (!has(item, args.key)) return;

      if (has(slots, item[args.key])) {
        slots[item[args.key]].contents.push(item);
      }
    });

    var _loop2 = function _loop2() {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          n = _Object$entries$_i[0],
          s = _Object$entries$_i[1];

      // log("slots","Slot", s.key);
      s.contents = slotItems(s.contents);
      s.contents.forEach(function (item) {
        return item[args.key] = s.key;
      }); // log("slots","Slot", s.key, "items", s.contents);
    };

    for (var _i = 0, _Object$entries = Object.entries(slots); _i < _Object$entries.length; _i++) {
      _loop2();
    } // log("slots", "Final slots:", slots);


    var contents = Object.values(slots).flatMap(function (s) {
      return s.contents;
    }); // log("slots", contents);

    return contents;
  }
};
var spacer = {
  name: 'spacer',
  render: function render(args) {
    return "<div class='spacer'></div>";
  }
};
var span = {
  name: 'span',
  key: 'content',
  defaults: {
    content: '',
    'field-separator': false,
    'article-cat': false
  },
  render: function render(args) {
    var cls = elementClass('span', null, args, ['field-separator', 'article-cat']);
    return "<span".concat(cls, ">").concat(esc(args.content, true), "</span>");
  }
};

function spellLevel(lvl, style, slots, special) {
  var level_marker = {
    type: "level-marker",
    level: lvl,
    marker: ''
  }; // number of spells

  var fields = [];

  if (special) {
    special = interpolate(special, {
      'level': lvl
    });
    if (Array.isArray(special)) fields = special;else fields.push(special);
  }

  var n = parseInt(2 * Math.ceil((slots + fields.length) / 2.0)) + fields.length; // log("spells", "Adding up to", n, "spell fields");

  for (var i = fields.length; i < n; i++) {
    switch (style) {
      case 'prepared':
        fields.push({
          type: "field",
          id: "spells-level-".concat(lvl, "-").concat(n),
          frame: "none",
          control: "compound",
          parts: [{
            control: "checkbox",
            id: "spells-level-".concat(lvl, "-").concat(n)
          }, {
            control: "input",
            align: 'left',
            width: 'stretch'
          }]
        });
        break;

      case 'spontaneous':
        fields.push({
          type: "field",
          id: "spells-level-".concat(lvl, "-").concat(n),
          frame: "none",
          align: "left",
          width: "stretch"
        });
        break;
    }
  }

  var left = [];
  var right = [];

  for (var i = 0; i < fields.length; i++) {
    left.push(fields[i]);
    i++;
    right.push(fields[i]);
  } // full level


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
    style: "prepared"
  },
  render: function render(args, reg, doc) {
    var min = args.min;
    var max = args.max; // number of spells at each level

    var slots = {};

    if (Array.isArray(args.spells)) {
      var i = 0;

      for (var lvl = min; lvl <= max; lvl++) {
        slots[lvl] = args.spells[i];
      }
    } else {
      for (var lvl = min; lvl <= max; lvl++) {
        slots[lvl] = args.spells;
      }
    } // objects to render


    var spell_levels = [];

    if (args.cantrips) {
      spell_levels.push(spellLevel(0, 'spontaneous', args.cantrips, false));
    }

    for (var lvl = min; lvl <= max; lvl++) {
      spell_levels.push(spellLevel(lvl, args.style, slots[lvl], args.special));
    }
    /*
    for (var lvl = min; lvl <= max; lvl++) {
        var level_marker = {
            type: "level-marker",
            level: lvl,
        };
         // number of spells
        var fields = [];
        if (args.special) {
            var special = interpolate(args.special, { 'level': lvl });
            if (Array.isArray(special)) fields = special;
            else fields.push(special);
        }
         var n = parseInt(2 * Math.ceil((slots[lvl] + fields.length) / 2.0)) + fields.length;
        // log("-","[spells] Adding up to", n, "spell fields");
        for (var i = fields.length; i < n; i++) {
            switch (args.style) {
                case 'prepared':
                    fields.push({
                        type: "field",
                        id: `spells-level-${lvl}-${n}`,
                        frame: "none",
                        control: "compound",
                        parts: [
                            {
                                control: "checkbox",
                                id: `spells-level-${lvl}-${n}`
                            },
                            {
                                control: "input",
                                align: 'left',
                                width: 'stretch',
                            }
                        ]
                    });
                    break;
                 case 'spontaneous':
                    fields.push({
                        type: "field",
                        id: `spells-level-${lvl}-${n}`,
                        frame: "none",
                        align: "left",
                        width: "stretch"
                    });
                    break;                        
            }
        }
         var left = [];
        var right = [];
        // var n = Math.ceil(slots[lvl] / 2.0);
        for (var i = 0; i < fields.length; i++) {
            left.push(fields[i]);
            i++;
            right.push(fields[i]);
        }
         // full level
        spell_levels.push({
            type: "layout",
            layout: "spells-list",
            narrow: true,
            contents: [
                {
                    type: "list",
                    collapse: true,
                    "merge-bottom": true,
                    contents: left
                },
                level_marker,
                {
                    type: "list",
                    collapse: true,
                    "merge-bottom": true,
                    marker: '',
                    contents: right
                }
            ]
        });
    }
    */


    return reg.render([{
      type: "list",
      hr: true,
      zebra: true,
      'avoid-shade': true,
      contents: spell_levels
    }], doc);
  }
};
var spells_table = {
  name: 'spells-table',
  defaults: {
    'max-level': 9,
    'spells-per-day': true,
    flip: false
  },
  transform: function transform(args) {
    // log("-","[spells] Expanding spells table:", args);
    var rows = [];
    var columns = [];
    var template = []; // Rows

    for (var lvl = 1; lvl < args['max-level']; lvl++) {
      rows.push({
        level: lvl
      });
    } // Spell Level


    columns.push("Spell\nLevel");
    template.push({
      type: "level-marker",
      level: "#{level}",
      marker: ""
    }); // Spells per day

    if (args['spells-per-day']) {
      columns.push("Spells\nper day");
      template.push({
        type: "field",
        id: "spells-#{level}-per-day",
        frame: "none"
      });
    }

    var table = {
      type: "table",
      // flip: args.flip,
      rows: rows,
      columns: columns,
      template: template
    };
    table = _.defaults(table, args); // log("-","[spells] Expanded spells table:", table);

    return [table];
    /*
    return [
        {
            type: "row",
            narrow: true,
            contents: [
                { type: 'g', contents: [
                    { type: "level-marker", level: 1, marker: "Spell Level" },
                    { type: "field", id: "spells-1-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 2, marker: "Spell Level" },
                    { type: "field", id: "spells-2-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 3, marker: "Spell Level" },
                    { type: "field", id: "spells-3-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 4, marker: "Spell Level" },
                    { type: "field", id: "spells-4-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 5, marker: "Spell Level" },
                    { type: "field", id: "spells-5-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 6, marker: "Spell Level" },
                    { type: "field", id: "spells-6-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 7, marker: "Spell Level" },
                    { type: "field", id: "spells-7-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 8, marker: "Spell Level" },
                    { type: "field", id: "spells-8-per-day", width: "small", frame: "none" },
                ]},
                { type: 'g', contents: [
                    { type: "level-marker", level: 9, marker: "Spell Level" },
                    { type: "field", id: "spells-9-per-day", width: "small", frame: "none" },
                ]}
            ]
        }
    ];
    */
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
    // if (Array.isArray(args.spells)) {
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
};
var table = {
  name: 'table',
  defaults: {
    rows: [{}],
    columns: [],
    repeat: 1,
    flip: false,
    template: []
  },
  render: function render(args, reg, doc) {
    // Standard table
    function renderTableBasic(headings, rows) {
      // headings
      var thead = '';

      if (!isNull(headings)) {
        var tcols = headings.map(function (col) {
          var elem = reg.renderItem(col, doc);
          var cs = has(col, 'colspan') ? col.colspan : 1;
          var colspan = cs > 1 ? " colspan='".concat(col.colspan, "'") : '';
          return "<th".concat(colspan, ">").concat(elem, "</th>");
        });
        thead = "<thead>".concat(tcols.join("\n"), "</thead>\n");
      } // cells
      // log("table", "Rows", rows);


      var trows = rows.map(function (row) {
        var cells = row.map(function (cell, h) {
          if (h < headings.length) {
            if (has(headings[h], "shade") && headings[h].shade) cell.shade = true;
          }

          var cellCls = elementClass('td', null, cell, ['shade'], {
            'align': '',
            'valign': 'bottom'
          });
          return "<td".concat(cellCls, ">").concat(reg.renderItem(cell, doc), "</td>");
        });
        return "<tr>".concat(cells.join("\n"), "</tr>\n");
      }); // put it all together

      var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed'], ['width', 'layout']);
      return "<table".concat(cls, ">").concat(thead, "<tbody>").concat(trows.join("\n"), "</tbody></table>");
    } // Column-oriented table


    function renderTableFlipped(headings, cols) {
      // log("table", "Flipped", headings, cols);
      // find the size of the table and make an empty grid of cells
      var hasHeading = false;
      var ncols = cols.length;
      var nrows = 0;
      headings = headings.map(function (heading) {
        if (isNull(heading)) heading = {
          type: 'label',
          label: ''
        };else hasHeading = true;
        if (!has(heading, "rowspan")) heading.rowspan = 1;
        nrows += heading.rowspan;
        return heading;
      });
      cols.forEach(function (col) {
        if (col.length > nrows) nrows = col.length;
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
        var row = 0;
        headings.forEach(function (heading) {
          cells[row][0] = heading;
          row += heading.rowspan;
        });
      }

      cols.forEach(function (col, c) {
        if (hasHeading) c++; // log("table", "Column", c, col);

        col.forEach(function (cell, r) {
          // log("table", "Cell at:", r, c, "=", cell);
          cells[r][c] = cell;
        });
      }); // log("table", "Cells", cells);
      // render it

      var trows = cells.map(function (row) {
        var th = '';

        if (hasHeading) {
          var head = row.shift();
          var rowspan = head.rowspan > 1 ? " rowspan=\"".concat(head.rowspan, "\"") : '';
          var th = "<th scope=\"row\"".concat(rowspan, ">").concat(isNull(head) ? '' : reg.renderItem(head, doc), "</th>");
        }

        var tds = row.map(function (elem) {
          return "<td>".concat(isNull(elem) ? '' : reg.renderItem(elem, doc), "</td>");
        });
        return "<tr>".concat(th).concat(tds.join(""), "</tr>");
      }); // put it all together

      var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed'], ['width', 'layout']);
      return "<table".concat(cls, "><tbody>").concat(trows.join("\n"), "</tbody></table>");
    } // get headings


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

    if (isNull(args) || args.rows == []) {
      // log("table", "Filling in empty rows");
      args.rows = [{}];
    } // individual rows repeat


    var rows = args.rows;
    rows = rows.flatMap(function (row) {
      var rep = has(row, "repeat") ? row.repeat : 1;

      if (rep > 1) {
        // log("table", "Repeating row", rep, "times:", row);
        return Array.from({
          length: rep
        }, function (e) {
          return Array.from(row);
        });
      }

      return [row];
    }); // repeat the whole set

    if (has(args, "repeat") && args.repeat > 1) {
      var rows2 = Array(rows.length * args.repeat);

      for (var i = 0; i < args.repeat; i += rows.length) {
        for (var j = 0; j < rows.length; j++) {
          rows2[i + j] = clone(rows[j]);
        }
      }

      rows = rows2; // log("table", "Repeating row", args.repeat, "times:", rows);
    } // number rows


    for (var _i2 = 0; _i2 < rows.length; _i2++) {
      rows[_i2].i = _i2 + 1;
    } // apply the row template


    if (Array.isArray(args.template) && args.template.length > 0) {
      var templateCells = args.template.flatMap(function (cell) {
        if (isObject(cell) && has(cell, "type") && cell.type == "calc") {
          var fields = _toConsumableArray(cell.inputs);

          fields.unshift({
            type: "span",
            content: "="
          });
          var output = Object.assign({
            output: true
          }, cell.output);
          fields.unshift(output);
          return fields;
        }

        return [cell];
      });
      rows = rows.map(function (row) {
        return templateCells.map(function (cell, i) {
          cell = interpolate(cell, row);

          if (cell === null) {
            return null;
          } else {
            if (isString(cell)) cell = {
              type: "label",
              label: cell
            }; // log("-","Cell:", cell);

            if (!has(cell, "type")) {
              return null;
            }

            var col = Object.assign({}, headings[i], {
              label: '',
              legend: ''
            });
            return Object.assign({}, {
              type: 'label',
              label: ''
            }, col, cell);
          }
        });
      });
    } else {
      rows = args.rows.map(function (row) {
        return row.map(function (cell) {
          if (isString(cell)) return {
            type: "label",
            label: cell
          };
          if (!has(cell, "type")) return null;
          return cell;
        });
      });
    } // render
    // return renderTableBasic(headings, rows);


    if (args.flip) {
      return renderTableFlipped(headings, rows);
    } else {
      return renderTableBasic(headings, rows);
    }
  }
};
var paste = {
  name: 'paste',
  key: 'template',
  defaults: {
    params: {}
  },
  render: function render(args) {
    return '';
  }
};
var define = {
  name: 'define',
  key: 'template',
  defaults: {
    template: '',
    params: {},
    contents: []
  },
  render: function render(args) {
    return '';
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
    // log("zone", "Zone", args.zone);
    var existing = has(args, "contents") && args.contents ? args.contents : [];
    var insert = has(ctx.zones, args.zone) ? _.cloneDeep(ctx.zones[args.zone]) : [];
    var replace = insert.reduce(function (repl, element) {
      return repl || element.replace;
    }, false);

    if (replace) {
      existing = [];
    }

    var contents = existing.concat(insert); // log("-","[zone] Contents", contents);
    // sort the contents

    if (args.sort) {
      // log("-","[zone] Sorting");
      var contents = contents.map(function (subelement) {
        return Object.assign({
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
    editable: true,
    flex: false,
    'merge-bottom': false,
    label: false,
    value: null
  },
  expect: ['icon'],
  render: function render(args, reg, doc) {
    args = fieldDefaults(args, reg, doc);

    if (args.value === null) {
      args.value = doc.getVar(args.id); // if (args.value) log("field", "Value:", args.id, "=", args.value);
    }

    var id = elementID('field', args.id);
    var cls = elementClass('field', null, args, ["icon", "ref", "misc", "temp"], {
      "frame": "normal",
      "width": "medium",
      "align": "centre",
      "size": "medium",
      "control": "input",
      "shift": 0,
      "lp": 0,
      "border": "bottom",
      "flex": false
    });

    var frameArgs = _.defaults({
      type: 'frame:' + args.frame
    }, args);

    var frame = reg.renderItem(frameArgs, doc);
    return "<div".concat(id).concat(cls, ">").concat(frame, "</div>");
  }
}; // field defaults are a combination of the defaults from the field's frame and control

function fieldDefaults(args, reg, doc) {
  args = _.defaults(args, {
    frame: 'above',
    control: 'input'
  });
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

  args = _.defaults(args, frame.defaults, control.defaults, {
    border: args.output ? 'full' : 'bottom',
    align: args.width == "stretch" ? "left" : "centre",
    width: "medium",
    icon: false
  });
  args.lp = getLabelHeight(args);
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
    var ident = " id='".concat(fieldid, "' name='").concat(fieldid, "'");
    var forid = " for='".concat(fieldid, "'");
    return {
      id: fieldid,
      name: fieldid,
      for: forid,
      ident: ident
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
  var ident = " id='".concat(id, "' name='").concat(fieldid, "'");
  var forid = " for='".concat(id, "'");
  return {
    id: id,
    name: fieldid,
    for: forid,
    ident: ident
  };
}

function fieldInner(args, reg, doc) {
  args = _.defaults({
    type: 'control:' + args.control
  }, args);
  var icon = has(args, "icon") && !!args.icon && _.isString(args.icon) && args.control != "icon" ? "<i class='icon icon_".concat(args.icon, "'></i>") : '';
  var unit = has(args, "unit") && !!args.unit ? "<label class='field__unit'>".concat(args.unit, "</label>") : '';

  var boxargs = _.pick(args, ['icon', 'border']);

  var inner;

  if (args.repeat > 1) {
    var boxes = [];
    var values = isArray(args.value) ? args.value : [args.value];

    for (var i = 0; i < args.repeat; i++) {
      var value = i >= values.length ? null : values[i];
      var controlArgs = Object.assign({}, args, {
        value: value
      });
      var control = reg.renderItem(controlArgs, doc);
      if (i == args.repeat - 1 && args['merge-bottom']) boxargs['border'] = 'none';
      var boxcls = elementClass('field', 'box', boxargs, ["icon"], {
        "border": "bottom"
      });
      var box = "<div".concat(boxcls, ">").concat(icon).concat(control).concat(unit, "</div>");
      boxes.push(box);
    }

    inner = boxes.join("");
  } else {
    var control = reg.renderItem(args, doc);
    if (args['merge-bottom']) boxargs['border'] = 'none';
    var boxcls = elementClass('field', 'box', boxargs, ["icon"], {
      "border": "bottom"
    });
    inner = "<div".concat(boxcls, ">").concat(icon).concat(control).concat(unit, "</div>");
  }

  var framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
  return "<div".concat(framecls, ">").concat(inner, "</div>");
}

function defaultFrameRender(args, reg) {
  var ident = args.control == 'radio' ? fieldRadioIdent(args.id, args.value) : fieldIdent(args.id);
  var label = args.label ? "<label".concat(ident.for, ">").concat(esc(args.label, true), "</label>") : '';
  var legend = args.legend ? "<legend>".concat(esc(args.legend, true), "</legend>") : '';
  return "".concat(legend).concat(label).concat(fieldInner(args, reg));
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
  render: function render(args, reg) {
    var ident = fieldRadioIdent(args.id, args.value);
    var label = args.label ? "<label".concat(ident.for, ">").concat(esc(args.label, true), "</label>") : '';
    var legend = args.legend ? "<legend>".concat(esc(args.legend, true), "</legend>") : '';
    return "".concat(fieldInner(args, reg)).concat(legend).concat(label);
  }
};
var field_frame_h_label = {
  name: 'frame:h-label',
  defaults: {
    label: false
  },
  render: function render(args, reg) {
    var ident = fieldIdent(args.id);
    var label = args.label ? "<label class='field__h-label'".concat(ident.for, ">").concat(esc(args.label, true), "</label>") : ''; // WRONG! The h-label is supposed to go inside the box!

    return "".concat(label).concat(fieldInner(args, reg));
  }
};
var field_frame_none = {
  name: 'frame:none',
  render: function render(args, reg) {
    return fieldInner(args, reg);
  }
};
var field_frame_circle = {
  name: 'frame:circle',
  defaults: {
    border: 'full'
  },
  render: defaultFrameRender
};

var defaultControlRender = function defaultControlRender(args) {
  args = Object.assign({
    align: "center",
    width: "medium",
    editable: true,
    prefix: false,
    overlay: false,
    underlay: false
  }, args);
  var ident = fieldIdent(args.id);
  var cls = elementClass("field", "control", args, [], {
    "align": "centre",
    "width": "medium"
  });
  var value = args.value == '' ? '' : " value='".concat(args.value, "'");
  var attr = args.editable ? '' : 'readonly';
  var input = "<input".concat(ident.ident).concat(value).concat(attr, ">");
  var underlay = args.underlay ? "<u>".concat(args.underlay, "</u>") : '';
  var prefix = args.prefix ? "<span class='field__overlay'>".concat(args.prefix, "</span>") : '';
  var overlay = args.overlay ? "<span class='field__overlay'>".concat(args.overlay, "</span>") : '';
  return "<div".concat(cls, ">").concat(prefix).concat(input).concat(underlay, "</div>").concat(overlay);
};

var renderCompoundControl = function renderCompoundControl(args, reg, doc) {
  var parts = args.parts;
  var i = 0;
  var outputParts = parts.map(function (part) {
    if (typeof part == 'string') return part;

    if (Array.isArray(args.value) && args.value.length > i) {
      part.value = args.value[i];
    }

    i++;
    if (has(part, "type") && part.type != "field") return reg.renderItem(part, doc);
    part = fieldDefaults(part, reg);
    part.type = 'control:' + part.control;
    return reg.renderItem(part, doc);
  }); // log("control", "Parts:", outputParts);

  return outputParts.join("");
}; // Register the faux-elements


var field_control_input = {
  name: 'control:input',
  defaults: {
    value: '',
    border: 'bottom'
  },
  render: defaultControlRender
};
var field_control_speed = {
  name: 'control:speed',
  defaults: {
    units: "imperial",
    value: '',
    width: 'large'
  },
  render: function render(args, reg, doc) {
    switch (args.units) {
      case "imperial":
        var ftIdent = fieldIdent(args.id, "ft");
        var sqIdent = fieldIdent(args.id, "sq");
        args.parts = [{
          type: "field",
          id: ftIdent.id,
          align: "right",
          width: "small"
        }, {
          type: "label",
          label: "ft"
        }, {
          type: "field",
          id: sqIdent.id,
          align: "right",
          width: "tiny"
        }, {
          type: "label",
          label: "sq"
        }];
        break;

      case "metric":
        var ftIdent = fieldIdent(args.id, "m");
        var sqIdent = fieldIdent(args.id, "sq");
        args.parts = [{
          type: "field",
          id: ftIdent.id,
          align: "right",
          width: "small"
        }, {
          type: "label",
          label: "m"
        }, {
          type: "field",
          id: sqIdent.id,
          align: "right",
          width: "tiny"
        }, {
          type: "label",
          label: "sq"
        }];
        break;
    } // log("field", "Speed field", args);


    return renderCompoundControl(args, reg, doc);
  }
};
var field_control_weight = {
  name: 'control:weight',
  defaults: {
    schema: "starfinder",
    width: "huge"
  },
  render: function render(args, reg, doc) {
    switch (args.schema) {
      case "starfinder":
        var bulkIdent = fieldIdent(args.id, "bulk");
        var lightIdent = fieldIdent(args.id, "light");
        args.parts = [{
          type: "field",
          id: bulkIdent.id,
          align: "right"
        }, {
          type: "label",
          label: "B"
        }, {
          type: "field",
          id: lightIdent.id,
          align: "right",
          width: "tiny"
        }, {
          type: "label",
          label: "L"
        }];
        break;
    }

    return renderCompoundControl(args, reg, doc);
  }
};
var field_control_radio = {
  name: 'control:radio',
  defaults: {
    value: false,
    border: 'none'
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
    border: 'none'
  },
  render: function render(args) {
    var ident = fieldIdent(args.id);
    var cls = elementClass("field", "control", args, [], ["control"]);
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
    border: 'none'
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
    direction: "horizontal",
    depth: 3
  }, "value", 0),
  render: function render(args) {
    var g = args.group;
    if (args.max < args.group) g = args.max;
    var grouplen = Math.ceil(parseFloat(g) / parseFloat(args.depth));

    if (args.direction == "horizontal") {
      args.dir = "h";
      args.w = grouplen;
      args.h = args.depth;
    } else {
      args.dir = "v";
      args.h = grouplen;
      args.w = args.width;
    }

    var checks = [];

    for (var i = 1; i <= args.max; i++) {
      var ident = fieldIdent(args.id, i);
      var checked = i <= args.value ? ' checked' : '';
      var cls = elementClass("field", "control", args, [], ["control"]);
      var check = "<div".concat(cls, "><input type='checkbox'").concat(ident.ident).concat(checked, "><label").concat(ident.for, "></label></div>");
      checks.push(check);
    }

    var groups = _.chunk(checks, args.group).map(function (ch) {
      var grouplen = Math.ceil(parseFloat(ch.length) / parseFloat(args.depth));
      var a = {
        dir: args.dir,
        w: args.w,
        h: args.h
      };
      a[args.direction == 'horizontal' ? 'w' : 'h'] = grouplen; // if (args.direction == "horizontal") {
      //     a.w = grouplen;
      // } else {
      //     a.h = grouplen;
      // }

      var cls = elementClass("field", "control-group", a, [], ["dir", "w", "h"]);
      return "<div".concat(cls, ">").concat(ch.join(""), "</div>");
    }); // var groups = [];
    // for (var i = 0; i < args.max; i += args.group) {
    //     var n = args.max - i;
    //     if (n > args.group) n = group;
    //     args.w = Math.ceil(parseFloat(g) / parseFloat(args.depth));
    //     var checks = [];
    //     for (var j = 1; j <= n; j++) {
    //         var ident = fieldIdent(args.id, i+j);
    //         var checked = (i <= args.value) ? ' checked' : '';
    //         var cls = elementClass("field", "control", args, [], [ "control" ]);
    //         var check = `<div${cls}><input type='checkbox'${ident.ident}${checked}><label${ident.for}></label></div>`;
    //         checks.push(check);
    //     }
    //     var cls = elementClass("field", "control-group", args, [], [ "dir", "w", "h" ]);
    //     var group = `<div${cls}>${checks.join("")}</div>`;
    //     groups.push(group);
    // }


    return groups.join("");
  }
};
var field_control_alignment = {
  name: 'control:alignment',
  defaults: {
    value: '',
    border: 'none'
  },
  render: function render(args) {
    var radios = ["lg", "ll", "le", "ng", "nn", "ne", "cg", "cn", "ce"].map(function (al) {
      var radioIdent = fieldRadioIdent(args.id, args.value);
      return "<div class='field__control field__control-".concat(al, "'><input type='radio'").concat(radioIdent.ident, "></div>");
    });
    return "\n            <i class='field__grid'></i>\n            <i class='icon icon_good'></i>\n            <i class='icon icon_evil'></i>\n            <i class='icon icon_lawful'></i>\n            <i class='icon icon_chaotic'></i>\n\n            <label class='field__good'>Good</label>\n            <label class='field__evil'>Evil</label>\n            <label class='field__lawful'>Lawful</label>\n            <label class='field__chaotic'>Chaotic</label>\n\n            ".concat(radios.join(""), "\n        ");
  }
};
var field_control_icon = {
  name: 'control:icon',
  defaults: {
    value: '',
    border: 'none',
    icon: ''
  },
  render: function render(args) {
    var cls = elementClass("field", "control", args, [], ["control"]);
    var iconcls = elementClass("icon", null, {
      icon: args.icon
    }, [], ["icon"]);
    return "<div".concat(cls, "><i").concat(iconcls, "></i></div>");
  }
};
var field_control_proficiency = {
  name: 'control:proficiency',
  defaults: {
    value: 0,
    icon: true
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

    args.parts = [{
      type: "field",
      control: "proficiency-icon",
      value: args.value,
      id: args.id
    }, {
      control: "input",
      id: args.id + "-bonus"
    }];
    return renderCompoundControl(args, reg, doc);
  }
};
var field_control_proficiency_icon = {
  name: 'control:proficiency-icon',
  render: function render(args) {
    var cls = elementClass("field", "control", {
      control: "icon"
    }, [], {
      "control": "input"
    }); // TODO checkboxes? radio buttons?

    return "\n            <div".concat(cls, ">\n            <input type='checkbox'").concat(fieldIdent(args.id, "trained").ident, " class='field--proficiency__trained'").concat(args.value > 0 ? ' checked="checked"' : '', ">\n            <input type='checkbox'").concat(fieldIdent(args.id, "expert").ident, " class='field--proficiency__expert'").concat(args.value > 1 ? ' checked="checked"' : '', ">\n            <input type='checkbox'").concat(fieldIdent(args.id, "master").ident, " class='field--proficiency__master'").concat(args.value > 2 ? ' checked="checked"' : '', ">\n            <input type='checkbox'").concat(fieldIdent(args.id, "legendary").ident, " class='field--proficiency__legendary'").concat(args.value > 3 ? ' checked="checked"' : '', ">\n            <i class='icon field--proficiency__icon'></i>\n            </div>");
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
    value: ''
  },
  render: function render(args) {
    var unit = '';

    switch (args.denomination) {
      case 'platinum':
        unit = 'pp';
        break;

      case 'gold':
        unit = 'gp';
        break;

      case 'silver':
        unit = 'sp';
        break;

      case 'copper':
        unit = 'cp';
        break;
    }

    var overlay = "<span class='field__overlay'>".concat(unit, "</span>");
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
    return "<div".concat(cls, "><input").concat(ident.ident).concat(value, " size='").concat(args.digits, "'>").concat(ticks.join(""), "</div>").concat(shift).concat(overlay);
  }
};
var field_control_compound = {
  name: 'control:compound',
  defaults: {
    parts: []
  },
  render: renderCompoundControl
};
var field_control_progression = {
  name: 'control:progression',
  defaults: {
    parts: [],
    border: "none"
  },
  render: function render(args, reg, doc) {
    args.parts = args.parts.flatMap(function (part) {
      return [part, '<label class="field__separator"></label>'];
    });
    args.parts.pop();
    return renderCompoundControl(args, reg, doc);
  }
};

var Registry =
/*#__PURE__*/
function () {
  function Registry() {
    var _this = this;

    _classCallCheck(this, Registry);

    this.registry = {};
    this.stack = []; // load all the elements

    [unit, // document,
    advancement, article, blockquote, calc, class_icon, each, g, h1, h2, h3, h4, h5, h6, hr, tail, vr, icon, label, layout, level, level_marker, list, join, logo, nothing, page, p, ul, li, portrait, proficiency, action, selectable, repeat, row, section, slots, spacer, span, spells_list, spells_table, spells_list2, table, define, paste, unit, zone, field, field_frame_none, field_frame_above, field_frame_left, field_frame_right, field_frame_h_label, field_frame_circle, field_control_input, field_control_speed, field_control_alignment, field_control_boost, field_control_checkbox, field_control_radio, field_control_checkgrid, field_control_compound, field_control_progression, field_control_money, field_control_weight, field_control_proficiency, field_control_proficiency_icon, field_control_icon].forEach(function (elem) {
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

      // log("registry", "Render", items);
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
      }, item);
      if (!item.exists || item.exists === "false") return '';
      if (item.type == "unit") item.type = item["unit-type"]; // log("Registry", "renderItem", item.type);

      if (has(this.registry, item.type)) {
        var reg = this.registry[item.type]; // registered defaults

        Object.keys(item).forEach(function (key) {
          if (item[key] === null) delete item[key];
        });
        item = Object.assign({}, reg.defaults, item);
        if (item.type == "slots") log("Registry", item);
        if (item['merge-bottom']) item = mergeBottom(item);
        this.stack.push(item.type + (item.id == null ? '' : ":" + item.id) + (item.title == null ? '' : ':' + item.title));
        var output = reg.render(item, this, doc);
        this.stack.pop();
        return output;
      } else {
        // log("Registry", "Registry elements", Object.keys(this.registry));
        warn$1("Registry", "Unknown element type:", item.type, "at:", this.stack, item);
        return '';
      }
    }
  }]);

  return Registry;
}();

function mergeBottom(element) {
  if (Array.isArray(element)) {
    element[element.length - 1] = mergeBottom(element[element.length - 1]);
  } else if (_typeof(element) == 'object') {
    switch (element.type) {
      // horizontal elements don't
      case 'calc':
      case 'row':
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

var systems = {};
var commonSystem = null;
var premiumSystem = null;
var promises = [];

var System =
/*#__PURE__*/
function () {
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
          reject();
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

var contextStack = [];
var regex = new RegExp('^(.*?)_(.*)$', '');

function applyContext(item) {
  if (Array.isArray(item)) {
    return item.map(applyContext);
  }

  var contentsKey = "contents"; // log("context", "Item", item);
  // log("context", "has type:", (has(item, "type") ? "yes" : "no"));
  // apply context

  if (has(item, "type")) {
    var type = item.type;
    var context = {};

    for (var i = contextStack.length - 1; i >= 0; i--) {
      if (has(contextStack[i], type)) {
        context = _.defaults(context, contextStack[i][type]);
      }
    } // log("context", "Applying context to", type, context);


    item = _.defaults(item, context);

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
        var type = match[1];
        var key = match[2];
        if (!has(contextArgs, type)) contextArgs[type] = {};
        contextArgs[type][key] = pair[1];
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

var Handlebars = require('handlebars');

var Document =
/*#__PURE__*/
function () {
  function Document(baseUnit) {
    _classCallCheck(this, Document);

    this.nextPage = 1;
    var baseDocument = baseUnit.contents[0]; // log("Document", "Base document", baseDocument);

    this.doc = clone(baseDocument);
    this.language = 'en';
    this.units = [baseUnit];
    this.zones = {};
    this.templates = {};
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
    key: "getVar",
    value: function getVar(varname) {
      var typeHint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!has(this.vars, varname)) return false; // TODO combine multiple values somehow

      var isArray = false;
      this.vars[varname].forEach(function (include) {
        if (Array.isArray(include.value)) isArray = true;
      });

      if (isArray) {
        var values = [];
        this.vars[varname].forEach(function (include) {
          if (Array.isArray(include.value)) {
            values = values.concat(include.value);
          } else {
            values.push(include.value);
          }
        });
        return values;
      }

      return this.vars[varname][0].value;
    }
  }, {
    key: "addUnit",
    value: function addUnit(unit) {
      var _this5 = this;

      if (unit == null) return; // log("Document", "Incorporating unit:", unit.id);

      this.units.push(unit);

      if (has(unit, "inc")) {
        unit.inc.forEach(function (include) {
          var key = Object.keys(include)[0];

          switch (key) {
            case 'at':
              if (has(include, "add")) _this5.addAtZone(include.at, include.add, false);
              if (has(include, "replace")) _this5.addAtZone(include.at, include.replace, true);
              break;

            case 'set':
              if (!has(_this5.vars, include.set)) _this5.vars[include.set] = [];

              _this5.vars[include.set].push(include);

              break;
          }
        });
      }
    }
  }, {
    key: "addAtZone",
    value: function addAtZone(zoneId, elements, replace) {
      var _this6 = this;

      if (zoneId.charAt(0) != '@') {
        error("Document", "Not a zone ID:", zoneId);
        return;
      } // log("Document", "Adding to zone:", zoneId);


      if (!has(this.zones, zoneId)) this.zones[zoneId] = [];
      elements.forEach(function (element) {
        if (replace) element.replace = true;

        _this6.zones[zoneId].push(element);
      }); // log("compose", "Zone", zoneId, "contents:", zones[zoneId]);
    }
  }, {
    key: "defineTemplate",
    value: function defineTemplate(templateId, defaults, elements) {
      log("compose", "Defining template:", templateId, defaults);
      this.templates[templateId] = {
        defaults: defaults,
        elements: elements
      };
    }
  }, {
    key: "composeDocument",
    value: function composeDocument(registry) {
      // log("Document", "Compose document");
      // log("compose", " - Doc:", this.doc);
      // log("compose", " - Zones:", zones);
      // log("compose", " - Templates:", templates);
      // log("compose", " - Registry", registry);
      var self = this;

      function compose(element) {
        if (element === null) {
          warn$1("Document", "Null element");
          return [];
        }

        if (!has(element, "type")) {
          warn$1("Document", "Untyped element", element);
          return [element];
        } // if (element.type == 'table') log("Document", "Compose item", element);
        // first recurse so we have the ingredients


        ["contents", "placeholder", "header", "inputs"].forEach(function (item_key) {
          // log("compose", "Checking for", item_key);
          if (has(element, item_key)) {
            // log("compose", "Preparing item", item_key, element[item_key]);
            if (Array.isArray(element[item_key])) element[item_key] = element[item_key].flatMap(compose);else element[item_key] = compose(element[item_key]);
          }
        }); // transform the element

        var reg = registry.get(element.type); // log("compose", "Registry entry for", element.type, reg);

        if (reg && reg.transform) {
          // log("compose", "Applying transformation to", element.type);
          var newelements = reg.transform(_.defaults(element, reg.defaults), {
            zones: self.zones,
            templates: self.templates
          });
          if (newelements === false) return element;
          newelements = newelements.flatMap(compose);
          return newelements;
        }

        return [element];
      }

      var c = compose(this.doc);
      this.doc = c[0];
      this.doc = applyContext(this.doc);
    }
  }, {
    key: "getFavicon",
    value: function getFavicon() {
      return '';
    }
  }, {
    key: "getStylesheet",
    value: function getStylesheet() {
      var _this7 = this;

      // find both SASS-compiled and data-URL-embedded parts for each of those
      var cssParts = [];
      this.units.forEach(function (unit) {
        var css = unit.stylesheet;
        if (css == "") return;
        var template = Handlebars.compile(css);
        var rendered = template({});
        if (unit.id != "document") rendered = replaceColours(rendered, _this7.printColour, _this7.accentColour);
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
        cssParts.push(".page{background-image:url('".concat(this.backgroundURL, "'); background-size: 100% 100%;}"));
      }

      return cssParts.join("");
    }
  }, {
    key: "renderDocument",
    value: function renderDocument(registry) {
      var favicon = this.faviconURL ? "<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href='".concat(this.faviconURL, "' />") : '';
      var stylesheet = this.getStylesheet();
      return "<!DOCTYPE html>\n<html lang='".concat(this.language, "'>\n<head>\n<meta charset='utf-8'/>\n<title>").concat(esc(this.doc.title), "</title>\n").concat(favicon, "\n<style>\n").concat(stylesheet, "\n</style>\n</head>\n\n<body>\n<nav id='nav-pages'>\n<a class=\"skip-link\" href=\"#page-core\">Go to character info</a>\n<a class=\"skip-link\" href=\"#page-combat\">Go to combat</a>\n</nav>\n\n<main>\n").concat(registry.render(this.doc.contents, this), "\n</main>\n\n<nav id='screen-buttons'>\n<!--\n<section id='left-buttons'>\n<button id='button--large' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--size_large';\"><i></i><span>Large font</span></button>\n<button id='button--high-contrast' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--high_contrast';\"><i></i><span>High contrast</span></button>\n</section>\n-->\n<button id='button--print' onclick=\"window.print();return false;\">Print</button>\n</nav>\n</body>\n</html>");
    }
  }, {
    key: "title",
    set: function set(title) {
      this.doc.title = title;
    },
    get: function get() {
      return this.doc.title;
    }
  }, {
    key: "watermark",
    get: function get() {
      return this.doc.watermark;
    },
    set: function set(watermark) {
      this.doc.watermark = watermark;
    }
  }]);

  return Document;
}();

var fs = require('fs');

var LoadQueue =
/*#__PURE__*/
function () {
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

            error("LoadQueue", "Error loading file", filename);
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
        error("load", "Queue error", err, err.stack);
      });
    }
  }]);

  return LoadQueue;
}();

var EventQueue =
/*#__PURE__*/
function () {
  function EventQueue() {
    _classCallCheck(this, EventQueue);

    this.callbacks = [];
  }

  _createClass(EventQueue, [{
    key: "call",
    value: function call() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      this.callbacks.forEach(function (callback) {
        try {
          callback.apply(null, args);
        } catch (e) {}
      });
    }
  }, {
    key: "on",
    value: function on(callback) {
      this.callbacks.push(callback);
    }
  }]);

  return EventQueue;
}();

var createEvt = new EventQueue();
var createElementTreeEvt = new EventQueue();
var errorEvt = new EventQueue();

var Events =
/*#__PURE__*/
function () {
  function Events() {
    _classCallCheck(this, Events);
  }

  _createClass(Events, null, [{
    key: "createEvt",
    get: function get() {
      return createEvt;
    }
  }, {
    key: "createElementTreeEvt",
    get: function get() {
      return createElementTreeEvt;
    }
  }, {
    key: "errorEvt",
    get: function get() {
      return errorEvt;
    }
  }]);

  return Events;
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
  if (!filename.match(/\..*$/)) return 'text/plain';
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
      return "text/plain";
  }
}

function processBase64(data) {
  if (data === null) return '';
  data = data.replace(/\n$/, '');
  data = data.replace(/[\r\n]/g, '');
  return data;
}

function processSVG(data) {
  // log("data", "processSVG");
  data = data.replace(/<!--.*?-->/g, '');
  data = data.replace(/[\r\n]\s*/g, ' ');
  data = data.replace(/>\s*</g, '><'); // data = data.replace(/>[\s\r\n]*</g, '><');

  data = data.replace(/^(.|[\r\n])*?<svg/, '<svg');
  data = data.replace(/\s*$/, ''); // data = replaceColours(data); // DON'T DO THIS UNTIL THE BUILD PHASE

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
    warn("data", 'No data for file:', filename);
    return '';
  } // var mime = mimeType(filename);


  switch (mimeType) {
    case MIME_SVG:
      data = processSVG(data);
      return 'data:' + mimeType + ',' + data;

    default:
      data = processBase64(data);
      return 'data:' + mimeType + ';base64,' + data;
  }
} // Assets on disk


var assetsDirs = [__dirname + '/assets/'];

function addAssetsDir(dir) {
  if (!dir.match(/\/$/)) dir = dir + '/';
  assetsDirs.push(dir);
}

function locateAsset(filename, cb) {
  // log("data", "Locating asset:", filename, assetsDirs);
  assetsDirs.flatMap(function (dir) {
    var name = dir + filename;
    var file = needsBase64(filename) ? name + '.base64' : name;

    if (fs$1.existsSync(file)) {
      // log("data", "Located asset", name);
      cb(name);
      return;
    }
  });
}

function parseCharacter(primary, request) {
  // attributes
  var attr = Object.assign({
    name: false,
    game: 'pathfinder2',
    theme: 'pathfinder',
    language: 'en',
    ancestry: false,
    heritage: false,
    background: false,
    class: false,
    archetypes: false,
    printColour: '#707070',
    accentColour: '#707070',
    printWatermark: '',
    printLogo: false,
    printPortrait: false,
    animalPortrait: false,
    printBackground: false
  }, primary.attributes); // an object to start with

  var char = {
    name: attr.name,
    game: attr.game,
    units: ['core', 'base', 'theme/' + attr.theme],
    language: attr.language,
    classes: [],
    archetypes: [],
    options: {
      'animal-companion': false,
      'party-funds': false,
      'permission': false,
      'build': false,
      'mini': false,
      'spellbook': false
    },
    spellbookStyle: 'normal',
    miniSize: 'medium',
    printColour: attr.printColour,
    accentColour: attr.accentColour,
    printLogo: attr.printLogo,
    favicon: 'favicon16.png',
    printPortrait: attr.printPortrait,
    animalPortrait: attr.animalPortrait,
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,
    instances: {}
  }; // get all the flags

  Object.keys(attr).forEach(function (key) {
    if (key.match(/^option/)) {
      var flag = toKebabCase(key.replace(/^option/, '')); // log("Character", "Option", flag, attr[key]);

      var ok = char.options[flag] = !!attr[key];
      if (ok) char.units.push('option/' + flag);
    }
  }); // game-specific settings

  switch (attr.game) {
    case 'pathfinder2':
      if (attr.ancestry) {
        char.units.push('ancestry/' + attr.ancestry.replace(/^ancestry-/, ''));
        char.ancestry = attr.ancestry.replace(/^ancestry-/, '');
      }

      if (attr.heritage) char.units.push('heritage/' + attr.heritage.replace(/^heritage-/, ''));

      if (attr.ancestryFeats) {
        char.ancestryFeats = parseFeats(attr.ancestryFeats);
      }

      if (attr.background) char.units.push('background/' + attr.background.replace(/^background-/, ''));

      if (attr.class) {
        var className = attr.class.replace(/^class-/, '');
        char.units.push('class/' + className);
        char.classes.push(className);
        var classPrefix = toCamelCase('class ' + className); // log("Character", "Class name", className, ", prefix", classPrefix);

        var classFeatsKey = classPrefix + 'Feats';

        if (attr[classFeatsKey]) {
          char.classFeats = parseFeats(attr[classFeatsKey]);
        }

        Object.keys(attr).forEach(function (key) {
          // log("Character", key);
          // let value = attr[key];
          if (key.startsWith(classPrefix) && !key.endsWith('Feats')) {
            var selname = toKebabCase(key.replace(classPrefix, ''));
            var selvalue = toKebabCase(attr[key]);
            log("Character", "Class option", key, selname, "=", selvalue);
            var unitname = className + '/' + selname + '/' + selvalue; // log("Character", "Class option unit", unitname);

            char.units.push(unitname);
          }
        });
      } // todo selectables


      char.units.push("option/inventory/half");

      if (attr.archetypes) {
        attr.archetypes.forEach(function (archetype) {
          char.archetypes.push(archetype);
          char.units.push('archetype/' + archetype);
        });
      }

      if (attr.feats) {
        char.feats = parseFeats(attr.feats);
      }

      if (attr.skillFeats) {
        char.skillFeats = parseFeats(attr.skillFeats);
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

var Character =
/*#__PURE__*/
function () {
  function Character(primary, request, registry) {
    _classCallCheck(this, Character);

    this.registry = registry;
    this.request = request;
    this.data = parseCharacter(primary, request);
    this.loadQueue = new LoadQueue();
  }

  _createClass(Character, [{
    key: "getAsset",
    value: function getAsset(asset, callback) {
      var _this8 = this;

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
          _this8.loadQueue.loadEmbed(assetFile).then(function (data) {
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
    key: "render",
    value: function render(callback) {
      var _this9 = this;

      // log("Character", "Render character");
      // log("Character", `Name: ${this.data.name}, game: ${this.data.game}`);
      // log("Character", `Units: ${this.data.units}`);
      ready(function () {
        try {
          var system = getSystem(_this9.data.game);

          if (system === null) {
            error$1("Character", "System not found:", _this9.data.game);
            return;
          } // start with a document


          var documentUnit = system.getUnit("document");
          var document = new Document(documentUnit); // TODO get title parts from inside units

          var titleParts = [];

          if (_this9.data.ancestry) {
            titleParts.push(toTitleCase(_this9.data.ancestry));
          }

          _this9.data.classes.forEach(function (cls) {
            titleParts.push(toTitleCase(cls));
          });

          _this9.data.archetypes.forEach(function (archetype) {
            titleParts.push(toTitleCase(archetype));
          });

          var title = titleParts.join(" ");

          if (_this9.data.name) {
            title = "".concat(_this9.data.name, ", ").concat(title);
          }

          document.title = title; // Load assets

          if (_this9.data.favicon) {
            _this9.getAsset(_this9.data.favicon, function (dataURL) {
              document.faviconURL = dataURL;
            });
          }

          if (_this9.data.printLogo) {
            _this9.getAsset(_this9.data.printLogo, function (dataURL) {
              document.logoURL = dataURL;
            });
          }

          if (_this9.data.printPortrait) {
            _this9.getAsset(_this9.data.printPortrait, function (dataURL) {
              document.portraitURL = dataURL;
            });
          }

          if (_this9.data.animalPortrait) {
            _this9.getAsset(_this9.data.animalPortrait, function (dataURL) {
              document.animalURL = dataURL;
            });
          }

          if (_this9.data.printBackground) {
            _this9.getAsset(_this9.data.printBackground, function (dataURL) {
              document.backgroundURL = dataURL;
            });
          } // TODO set character parameters


          document.printColour = _this9.data.printColour;
          document.accentColour = _this9.data.accentColour;
          document.watermark = _this9.data.printWatermark; // load units

          var units = system.getUnits(_this9.data.units); // infer required units (to a finite depth)

          var more = true;

          for (var i = 0; more && i < 10; i++) {
            more = false; // log("Character", "Checking for required units");

            var moreunits = [];
            var unitIds = units.map(function (unit) {
              return unit.id;
            });
            units.forEach(function (unit) {
              if (has(unit, "require")) {
                unit.require.forEach(function (req) {
                  // log("Character", `Unit ${unit.id} requires`, req);
                  // check if the new unit is really new
                  if (unitIds.includes(req.unit)) return; // check if the new unit has dependencies on other units

                  if (has(req, "with")) {
                    if (!unitIds.includes(req.with)) return;
                  }

                  var newunit = system.getUnit(req.unit);

                  if (!isNull(newunit)) {
                    moreunits.push(newunit);
                    more = true; // let's do this again
                  }
                });
              }
            });
            units = units.concat(moreunits);
          }

          log("Character", "Units:", units.map(function (unit) {
            return unit.id;
          })); // make the element tree

          units.forEach(function (unit) {
            return document.addUnit(unit);
          });
          document.composeDocument(_this9.registry);

          _this9.loadQueue.ready(function () {
            log("Character", "Ready");
            Events.createElementTreeEvt.call(document.doc, document.title, _this9.request); // fs.writeFile(__dirname + '/../test/out/test.json', JSON.stringify(document.doc, null, 2), (err) => {
            //   if (err)
            //     error("Character", "Could not write JSON file:", err);
            // });
            // render the document

            var data = document.renderDocument(_this9.registry);
            callback({
              data: data,
              filename: title + ".html",
              mimeType: "text/html"
            });
          });
        } catch (err) {
          error$1("Character", "Error:", err);
          callback({
            error: err
          });
        }
      });
    }
  }]);

  return Character;
}();

function parseParty(primary, request) {
  var attr = Object.assign({
    game: 'pathfinder2',
    language: 'en',
    members: []
  }, primary.attributes);
  return attr;
}

var Party =
/*#__PURE__*/
function () {
  function Party(primary, request, registry) {
    _classCallCheck(this, Party);

    this.registry = registry;
    this.data = parseParty(primary);
    var characterDefaults = {
      game: this.data.game,
      language: this.data.language
    };
    this.members = this.data.members.map(function (chardesc) {
      chardesc = Object.assign({}, characterDefaults, chardesc);
      return new Character(chardesc, request, registry);
    }); // log("Party", "Members:", this.members);
  }

  _createClass(Party, [{
    key: "render",
    value: function render(callback) {
      log("Party", "Render");
      var files = [];
      var promises = [];
      this.members.forEach(function (member) {
        var promise = new Promise(function (resolve, reject) {
          member.render(function (response) {
            if (response.err) {
              reject(response.err);
            } else {
              files.push(response);
              resolve();
            }
          });
        });
        promises.push(promise);
      });
      Promise.all(promises).then(function () {
        log("Party", "Rendered ".concat(files.length, " members"));
        callback(files);
      });
    }
  }]);

  return Party;
}();

function randomID() {
  return Math.random().toString(16).substring(2, 9);
}

var Request =
/*#__PURE__*/
function () {
  function Request(chardesc) {
    _classCallCheck(this, Request);

    this.instances = {};
    this.primary = [];
    Events.createEvt.call(chardesc);
    this.parse(chardesc);
  }

  _createClass(Request, [{
    key: "parse",
    value: function parse(request) {
      var _this10 = this;

      // log("Request", "Parsing request", request);
      // included instances go first, in case there's an ID conflict
      if (has(request, "included")) {
        if (Array.isArray(request.included)) {
          request.included.forEach(function (instance) {
            return _this10.addInstance(instance, false);
          });
        }
      } // primary data may be one item or several


      if (Array.isArray(request.data)) {
        request.data.forEach(function (instance) {
          return _this10.addInstance(instance, true);
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
      var _this11 = this;

      //   log("Request", "getPrimaries", this.primary);
      //   log("Request", "Instances", this.instances);
      // log("Request", "Known instances:", Object.keys(this.instances));
      var primaries = this.primary.map(function (primary) {
        // swap in linked instances
        if (has(primary, "relationships")) {
          Object.keys(primary.relationships).forEach(function (relkey) {
            primary.attributes[relkey] = primary.relationships[relkey].data.flatMap(function (link) {
              if (has(_this11.instances, link.id)) {
                return [_this11.instances[link.id]];
              } else {
                return [];
              }
            }); // log("Request", "Substituted relationships: ", relkey, "=", primary.attributes[relkey]);
          });
        }

        return primary;
      });
      return primaries.map(function (primary) {
        switch (primary.type) {
          case 'character':
            return new Character(primary, _this11, registry);

          case 'party':
            return new Party(primary, _this11, registry);

          default:
            return null;
        }
      });
    }
  }]);

  return Request;
}(); // start this first, it's the slow bit


loadSystemData(["common", "pathfinder2", "premium"]);
var registry = new Registry();

function create(chardesc) {
  var request = new Request(chardesc);
  var primary = request.getPrimaries(registry);
  return primary[0];
}

function addAssetsDir$1(dir) {
  addAssetsDir(dir);
}

function onCreate(callback) {
  Events.createEvt.on(callback);
}

function onCreateElementTree(callback) {
  Events.createElementTreeEvt.on(callback);
}

function onError(callback) {
  Events.errorEvt.on(callback);
}

exports.addAssetsDir = addAssetsDir$1;
exports.create = create;
exports.onCreate = onCreate;
exports.onCreateElementTree = onCreateElementTree;
exports.onError = onError;