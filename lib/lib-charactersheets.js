'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _ = require('lodash');

var fs$1 = require('fs');

require('colors');

function log$1(area, message) {
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
}

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
    return v && keys.includes(k) ? [k] : [];
  });
}

function pickAttribs(args, keys) {
  return _.pick(args, keys);
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

  _.each(mods, function (mod) {
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
    if (value === null) return; // console.log("  -", key, " = ", value);
    // some default values can be skipped
    // switch (key) {
    //     case 'frame': if (value == 'normal') return;
    //     case 'control': if (value == 'input') return;
    // }

    if (attribDefs.hasOwnProperty(key) && value == attribDefs[key]) return;

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

  if (_.isEmpty(cls)) {
    return '';
  }

  return " class='".concat(cls.join(" "), "'");
}

function interpolate(template, values) {
  // console.log("Interpolate:", template);
  // console.log(" - Values:", values);
  if (template === null) return null;

  if (_.isString(template)) {
    return template.replace(/#\{(.*?)\}/g, function (tag) {
      var match = tag.match(/#\{(.*?)\}/);
      var index = match[1]; // console.log("Match index:", index);

      if (values.hasOwnProperty(index)) {
        // console.log(` - Replacing #{${index}} -> ${values[index]}`);
        return values[index];
      }

      return match;
    });
  }

  if (Array.isArray(template)) {
    return template.map(function (item) {
      return interpolate(item, values);
    });
  }

  if (_.isPlainObject(template)) {
    var pairs = _.toPairs(template); // console.log(" - value pairs", pairs);


    pairs = pairs.map(function (pair) {
      return [pair[0], interpolate(pair[1], values)];
    }); // console.log(" - processed pairs", pairs);
    // check if the whole object needs replacing

    var first = pairs[0][0];

    if (first == 'param') {
      var paramkey = pairs[0][1];
      if (values.hasOwnProperty(paramkey)) return values[paramkey];
    } else if (first == 'item' && values.hasOwnProperty('item')) {
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
  if (args.hasOwnProperty("labelHeight")) return args.labelHeight;
  if (args.hasOwnProperty("context") && args.context !== null && args.context.hasOwnProperty("labelHeight")) return args.context.labelHeight;

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

var article = {
  name: 'article',
  key: 'title',
  defaults: {
    title: '',
    header: [],
    contents: [],
    shade: false,
    'merge-bottom': true
  },
  render: function render(args, reg) {
    var id = elementID('section', args.id);
    var cls = elementClass('section', null, args, ['shade']);
    var headerElements = args.header;

    if (_.isEmpty(args.header) && args.title != '') {
      headerElements = [{
        type: 'h6',
        title: args.title
      }];
    }

    var header = "<header>".concat(reg.render(headerElements), "</header>");
    var dl = ''; // var contents = mergeBottom(args.contents);

    return "<article".concat(id).concat(cls, ">\n            ").concat(header).concat(dl, "\n            <div class='g'>").concat(reg.render(args.contents), "</div>\n            </article>");
  }
};
var blockquote = {
  name: 'blockquote',
  render: function render(args, reg) {
    return "<blockquote>".concat(reg.render(args.contents), "</blockquote>");
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
  render: function render(args, reg) {
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
    return "<div".concat(cls, "><div class='row__inner'>").concat(reg.render(parts), "<div class='spacer'></div></div></div>");
  }
};
var class_icon = {
  name: 'class-icon',
  key: 'icon',
  defaults: {
    output: {},
    inline: false,
    inputs: []
  },
  render: function render(args) {
    var cls = elementClass('class-icon', null, args, [], ['icon']);
    return "<div".concat(cls, "></div>");
  }
};
var document = {
  name: 'document',
  key: 'title',
  defaults: {
    title: 'Dyslexic Character Sheets',
    favicon: 'favicon.png',
    sort: true
  },
  render: function render(args, reg) {
    // TODO load favicon
    // var faviconData = getDataURL("core", "images/"+args.favicon);
    var faviconData = ''; // TODO load stylesheet

    var stylesheet = '';
    return "<!DOCTYPE html>\n<html lang='en-GB'>\n<head>\n<meta charset='utf-8'/>\n<title>".concat(esc(args.title), "</title>\n<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href='").concat(faviconData, "' />\n<style>\n").concat(stylesheet, "\n</style>\n</head>\n\n<body>\n<nav id='nav-pages'>\n<a class=\"skip-link\" href=\"#page-core\">Go to character info</a>\n<a class=\"skip-link\" href=\"#page-combat\">Go to combat</a>\n</nav>\n\n<main>\n").concat(reg.render(args.contents), "\n</main>\n\n<nav id='screen-buttons'>\n<section id='left-buttons'>\n<button id='button--large' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--size_large';\"><i></i><span>Large font</span></button>\n<button id='button--high-contrast' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--high_contrast';\"><i></i><span>High contrast</span></button>\n</section>\n<button id='button--print' onclick=\"window.print();return false;\">Print</button>\n</nav>\n</body>\n</html>");
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

      if (i < args.rows.length && _.isObject(args.rows[i])) // values = _.defaults(values, args.rows[i]);
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
  render: function render(args, reg) {
    var cls = elementClass('g', null, args, [], {
      'valign': 'center'
    });
    return "<div".concat(cls, ">").concat(reg.render(args.contents), "</div>");
  }
};

function renderHeading(h) {
  return function (args) {
    var cls = elementClass(h, null, args, [], {
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
    columns: 0,
    gutter: 'medium',
    contents: []
  },
  render: function render(args, reg) {
    var cls = elementClass('layout', null, args, ['flex', 'no-flex'], {
      'layout': '',
      'gutter': ''
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
      return "<div".concat(cls, ">").concat(reg.render(contents), "</div>");
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
  },
  render: function render(args, reg) {
    return reg.render([{
      type: "layout",
      layout: "level",
      contents: [{
        type: "g",
        contents: [{
          type: "level-marker",
          level: args.level
        }]
      }, {
        type: "g",
        contents: args.contents
      }]
    }]);
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
  render: function render(args, reg) {
    if (args.zebra && args['avoid-shade']) {
      args['zebra-inverse'] = args.contents.length % 2 == 0;
    }

    var cls = elementClass('list', null, args, ["zebra", "zebra-inverse", "collapse", "flex", "vr", "hr", "merge-bottom"], []);
    return "<div".concat(cls, ">").concat(reg.render(args.contents), "</div>");
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
      contents: cols.map(function (col) {
        return Object.assign({}, args, {
          columns: 1,
          contents: col
        });
      })
    }];
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
var paizoCopyrightAttribution = "<div class='copyright-attribution'><p>\n<b>&copy; Marcus Downing &nbsp; <a href='https://www.dyslexic-charactersheets.com/'>dyslexic-charactersheets.com</a></b>\n<span>This character sheet uses trademarks and/or copyrights owned by Paizo Publishing, LLC, which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This character sheet is not published, endorsed, or specifically approved by Paizo Publishing. For more information about Paizo's Community Use Policy, please visit <a href='http://paizo.com/communityuse'>paizo.com/communityuse</a>. For more information about Paizo Publishing and Paizo products, please visit <a href='http://paizo.com'>paizo.com</a>.</span>        \n</p></div>";
var nextPageNumber = 1;
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
  render: function render(args, reg) {
    var id = elementID('page', args.id);
    var cls = elementClass('page', null, args, ['flex', 'landscape', 'no-bg']);
    var pageNumber = args.numbered ? "<div class='page-number'>".concat(nextPageNumber++, "</div>") : '';
    var copyrightAttribution = paizoCopyrightAttribution;
    if (args.id == 'permission') copyrightAttribution = '';
    return "\n            <div".concat(id).concat(cls, ">\n            ").concat(copyrightAttribution).concat(pageNumber, "\n            <div class='page__contents'>").concat(reg.render(args.contents), "</div>\n            </div>\n            ");
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
  render: function render(args, reg) {
    return "<ul>".concat(reg.render(args.contents), "</ul>");
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
    content: ""
  },
  transform: function transform(args) {
    if (args.proficiency === null) args.proficiency = "untrained";
    var icon = args.proficiency == "untrained" ? "proficiency" : "proficiency-" + args.proficiency;
    return [{
      type: "layout",
      layout: "level",
      contents: [{
        type: "icon",
        icon: icon
      }, {
        type: "p",
        content: args.content
      }]
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
  render: function render(args, reg) {
    args.lp = getLabelHeight(args);
    var cls = elementClass('row', null, args, ['unlabelled', 'narrow'], {
      'layout': 'left',
      'valign': 'bottom',
      'lp': ''
    });
    return "<div".concat(cls, "><div class='row__inner'>").concat(reg.render(args.contents), "</div></div>");
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
  render: function render(args, reg) {
    var cls = elementClass('section', null, args, ['primary', 'fill', 'untitled'], {
      flex: 'medium'
    });
    var title = args.untitled ? '' : "<h3>".concat(esc(args.title), "</h3>"); // var content = (args.contents.length == 1 && args.contents[0].type == "g") ? render(args.contents) : `<div class='g'>${render(args.contents)}</div>`;

    var content = "<div class='section__inner'>".concat(reg.render(args.contents), "</div>");
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
      if (!item.hasOwnProperty(args.key)) return;

      if (slots.hasOwnProperty(item[args.key])) {
        slots[item[args.key]].contents.push(item);
      }
    });

    var _loop = function _loop() {
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
      _loop();
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
    'field-separator': false
  },
  render: function render(args) {
    var cls = elementClass('span', '', args, ['field-separator']);
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

  var n = parseInt(2 * Math.ceil((slots + fields.length) / 2.0)) + fields.length;
  log("spells", "Adding up to", n, "spell fields");

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
  render: function render(args, reg) {
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
    }]);
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

    /*
    var rows = [];
    var columns = [];
    var template = [];
     // Rows
    for (var lvl = 1; lvl < args['max-level']; lvl++) {
        rows.push({ level: lvl });
    }
     // Spell Level
    columns.push("Spell\nLevel");
    template.push({
        type: "level-marker",
        level: "#{level}",
        marker: ""
    });
     // Spells per day
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
    table = _.defaults(table, args);
    // log("-","[spells] Expanded spells table:", table);
    return [ table ];
    */
    return [{
      type: "table",
      collapse: true,
      columns: [{
        type: "level-marker",
        level: 1
      }, {
        type: "level-marker",
        level: 2
      }, {
        type: "level-marker",
        level: 3
      }, {
        type: "level-marker",
        level: 4
      }, {
        type: "level-marker",
        level: 5
      }, {
        type: "level-marker",
        level: 6
      }, {
        type: "level-marker",
        level: 7
      }, {
        type: "level-marker",
        level: 8
      }, {
        type: "level-marker",
        level: 9
      }],
      rows: [[{
        type: "field",
        id: "spells-1-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-2-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-3-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-4-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-5-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-6-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-7-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-8-per-day",
        width: "small",
        frame: "none"
      }, {
        type: "field",
        id: "spells-9-per-day",
        width: "small",
        frame: "none"
      }]]
    }];
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
    rows: [],
    columns: [],
    repeat: 1,
    flip: false,
    template: []
  },
  render: function render(args, reg) {
    // log("table", "Table", args);
    var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed'], ['width', 'layout']); // columns headings

    var tcols = args.columns.map(function (col) {
      if (col === null) col = {
        type: 'label',
        label: ''
      };else if (_.isString(col)) col = {
        type: 'label',
        label: col,
        misc: col == "Misc"
      };
      var elem = reg.renderItem(col);
      var colspan = col.hasOwnProperty('colspan') && col.colspan > 1 ? " colspan='".concat(col.colspan, "'") : '';
      return "<th".concat(colspan, ">").concat(elem, "</th>");
    });
    var thead = '';

    if (tcols.length != 0) {
      thead = "<thead>".concat(tcols.join("\n"), "</thead>");
    } // rows template


    var rowCallback;

    if (_.isFunction(args.template)) {
      rowCallback = args.template;
    } else if (Array.isArray(args.template)) {
      rowCallback = function rowCallback(row) {
        // log("table", "Template cells", args.template);
        var templateCells = args.template.flatMap(function (cell) {
          if (_.isPlainObject(cell) && cell.hasOwnProperty("type") && cell.type == "calc") {
            var fields = _.clone(cell.inputs);

            fields.unshift({
              "type": "span",
              "content": "="
            });

            var output = _.defaults(cell.output, {
              "output": true
            });

            fields.unshift(output);
            return fields;
          }

          return [cell];
        });
        return templateCells.map(function (cell, i) {
          cell = interpolate(cell, row);

          if (cell === null) {
            return '<td></td>';
          } else {
            if (_.isString(cell)) cell = {
              type: "label",
              label: cell
            }; // log("-","Cell:", cell);

            if (!cell.hasOwnProperty("type")) {
              return '<td></td>';
            }

            var col = _.defaults({
              label: '',
              legend: ''
            }, args.columns[i]); // log("-","Cell:", cell, "+", col);


            var cell = _.defaults({}, cell, col, {
              type: 'label',
              label: ''
            }); // log("-","  =", cell);


            var cellCls = elementClass('td', null, cell, [], ['align']);
            return "<td".concat(cellCls, ">").concat(reg.renderItem(cell), "</td>");
          }
        });
      };
    } else {
      rowCallback = function rowCallback(row) {
        // log("table", "Table row", row);
        return row.map(function (cell) {
          if (_.isString(cell)) cell = {
            type: "label",
            label: cell
          };
          if (!cell.hasOwnProperty("type")) return '<td></td>';
          return "<td>".concat(reg.renderItem(cell), "</td>");
        });
      };
    }

    var rows = args.rows;

    if (args.repeat > 1) {
      if (_.isEmpty(rows)) {
        rows = [{}];
      } // log("-","Repeating row:", rows, "x", args.repeat);


      var repeatedRows = [];

      for (var i = 0; i < args.repeat; i++) {
        repeatedRows = repeatedRows.concat(rows);
      }

      rows = repeatedRows;
    } // log("-","Rows:", rows);


    var trows = rows.map(function (row) {
      return "<tr>".concat(rowCallback(row).join("\n"), "</tr>");
    });
    return "<table".concat(cls, ">").concat(thead, "<tbody>").concat(trows.join("\n"), "</tbody></table>");
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
    var existing = args.hasOwnProperty("contents") && args.contents ? args.contents : [];
    var insert = ctx.zones.hasOwnProperty(args.zone) ? _.cloneDeep(ctx.zones[args.zone]) : [];

    var replace = _.reduce(insert, function (repl, element) {
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
        return _.defaults(subelement, {
          level: 1,
          order: 1
        });
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
    'merge-bottom': false,
    label: false
  },
  expect: ['icon'],
  render: function render(args, reg) {
    args = fieldDefaults(args, reg);
    var id = elementID('field', args.id);
    var cls = elementClass('field', null, args, ["icon", "ref", "misc", "temp"], {
      "frame": "normal",
      "width": "medium",
      "align": "centre",
      "size": "medium",
      "control": "input",
      "shift": 0,
      "lp": 0,
      "border": "bottom"
    });

    var frameArgs = _.defaults({
      type: 'frame:' + args.frame
    }, args);

    var frame = reg.renderItem(frameArgs);
    return "<div".concat(id).concat(cls, ">").concat(frame, "</div>");
  }
}; // field defaults are a combination of the defaults from the field's frame and control

function fieldDefaults(args, reg) {
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

function fieldInner(args, reg) {
  args = _.defaults({
    type: 'control:' + args.control
  }, args);
  var control = reg.renderItem(args);
  var icon = args.hasOwnProperty("icon") && !!args.icon && _.isString(args.icon) && args.control != "icon" ? "<i class='icon icon_".concat(args.icon, "'></i>") : '';
  var unit = args.hasOwnProperty("unit") && !!args.unit ? "<label class='field__unit'>".concat(args.unit, "</label>") : '';

  var boxargs = _.pick(args, ['icon', 'border']);

  var inner;

  if (args.repeat > 1) {
    var boxes = [];

    for (var i = 1; i <= args.repeat; i++) {
      if (i == args.repeat && args['merge-bottom']) boxargs['border'] = 'none';
      var boxcls = elementClass('field', 'box', boxargs, ["icon"], {
        "border": "bottom"
      });
      var box = "<div".concat(boxcls, ">").concat(icon).concat(control).concat(unit, "</div>");
      boxes.push(box);
    }

    inner = boxes.join("");
  } else {
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
} // export function registerFieldFrame(element, props) {
//     props = _.defaults(props, {
//         defaults: {},
//         render: args => ''
//     });
//     CharacterSheets.register('frame:'+element, props, false);
// };
// Register the faux-elements


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
}; // import { renderItem } from '../classes/Registry';

var defaultControlRender = function defaultControlRender(args) {
  args = _.defaults(args, {
    align: "center",
    width: "medium",
    editable: true,
    prefix: false,
    overlay: false,
    underlay: false
  });
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

var renderCompoundControl = function renderCompoundControl(args, reg) {
  var parts = args.parts;
  var outputParts = parts.map(function (part) {
    if (typeof part == 'string') return part;
    if (part.hasOwnProperty("type") && part.type != "field") return reg.renderItem(part);
    part = fieldDefaults(part, reg);
    part.type = 'control:' + part.control;
    return reg.renderItem(part);
  }); // log("control", "Parts:", outputParts);

  return outputParts.join("");
}; // CharacterSheets.registerFieldControl = function (element, props) {
//     props = _.defaults(props, {
//         defaults: {},
//         render: args => '',
//     });
//     CharacterSheets.register('control:'+element, props, false);
// };
// Register the faux-elements


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
  render: function render(args, reg) {
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


    return renderCompoundControl(args, reg);
  }
};
var field_control_weight = {
  name: 'control:weight',
  defaults: {
    schema: "starfinder",
    width: "huge"
  },
  render: function render(args, reg) {
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

    return renderCompoundControl(args, reg);
  }
};
var field_control_radio = {
  name: 'control:radio',
  defaults: {
    checked: false,
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
    checked: false,
    border: 'none'
  },
  render: function render(args) {
    var ident = fieldIdent(args.id);
    var cls = elementClass("field", "control", args, [], ["control"]);
    return "<div".concat(cls, "><input type='checkbox'").concat(ident.ident, "><label").concat(ident.for, "></label></div>");
  }
};
var field_control_boost = {
  name: 'control:boost',
  defaults: {
    checked: false,
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
  defaults: {
    checked: false,
    border: 'none',
    max: 10,
    group: 10,
    direction: "horizontal",
    depth: 3,
    value: 0
  },
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
  render: function render(args, reg) {
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
    return renderCompoundControl(args, reg);
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
  render: function render(args, reg) {
    args.parts = _.flatMap(args.parts, function (part) {
      return [part, '<label class="field__separator"></label>'];
    });
    args.parts.pop();
    return renderCompoundControl(args, reg);
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

    [unit, document, article, blockquote, calc, class_icon, each, g, h1, h2, h3, h4, h5, h6, hr, tail, vr, icon, label, layout, level, level_marker, list, logo, page, p, ul, li, portrait, proficiency, action, repeat, row, section, slots, spacer, span, spells_list, spells_table, spells_list2, table, define, paste, unit, zone, field, field_frame_none, field_frame_above, field_frame_left, field_frame_right, field_frame_h_label, field_frame_circle, field_control_input, field_control_speed, field_control_alignment, field_control_boost, field_control_checkbox, field_control_radio, field_control_checkgrid, field_control_compound, field_control_progression, field_control_money, field_control_weight, field_control_proficiency, field_control_proficiency_icon, field_control_icon].forEach(function (elem) {
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
      if (this.registry.hasOwnProperty(type)) return this.registry[type];
      return false;
    }
  }, {
    key: "render",
    value: function render(items) {
      var _this2 = this;

      // log("registry", "Render", items);
      var rendered = items.map(function (item) {
        return _this2.renderItem(item);
      });
      return rendered.join("");
    }
  }, {
    key: "renderItem",
    value: function renderItem(item) {
      if (item === null) return '';
      item = Object.assign({
        id: null,
        exists: true
      }, item);
      if (!item.exists || item.exists === "false") return '';
      if (item.type == "unit") item.type = item["unit-type"]; // log("Registry", "renderItem", item.type);

      if (this.registry.hasOwnProperty(item.type)) {
        var reg = this.registry[item.type]; // registered defaults

        Object.keys(item).forEach(function (key) {
          if (item[key] === null) delete item[key];
        });
        item = Object.assign({}, reg.defaults, item);
        if (item.type == "slots") log$1("Registry", item);
        if (item['merge-bottom']) item = mergeBottom(item);
        this.stack.push(item.type + (item.id == null ? '' : ":" + item.id) + (item.title == null ? '' : ':' + item.title));
        var output = reg.render(item, this);
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
      if (this.units.hasOwnProperty(code)) {
        return this.units[code];
      }

      if (commonSystem !== null && commonSystem.units.hasOwnProperty(code)) {
        return commonSystem.units[code];
      }

      warn$1("System", "Unknown unit:", code);
      return null;
    }
  }, {
    key: "getUnits",
    value: function getUnits(codes) {
      var _this4 = this;

      return codes.map(function (code) {
        return _this4.getUnit(code);
      });
    }
  }]);

  return System;
}();

function loadSystemData(codes) {
  codes.forEach(function (code) {
    var systemFile = __dirname + "/lib-" + code + ".json";
    log$1("System", "Loading: ".concat(systemFile));
    var promise = new Promise(function (resolve, reject) {
      fs$1.readFile(systemFile, 'utf-8', function (err, data) {
        if (err) {
          error$1("System", "Error loading system file ".concat(systemFile, ":"), err);
          reject();
          return;
        }

        var systemData = JSON.parse(data);
        var system = new System(systemData);
        log$1("System", "Loaded ".concat(system.name, " (").concat(systemData.units.length, " units)"));
        systems[code] = system;

        if (code == "common") {
          // log("System", "Found common system");
          commonSystem = system;
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
  // log("context", "has type:", (item.hasOwnProperty("type") ? "yes" : "no"));
  // apply context

  if (item.hasOwnProperty("type")) {
    var type = item.type;
    var context = {};

    for (var i = contextStack.length - 1; i >= 0; i--) {
      if (contextStack[i].hasOwnProperty(type)) {
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
  } // log("context", "has", contentsKey+":", (item.hasOwnProperty(contentsKey) ? "yes" : "no"));


  if (item.hasOwnProperty(contentsKey)) {
    // extract context
    var contextArgs = {};
    Object.entries(item).forEach(function (pair) {
      // log("context", "Checking arg", pair[0]);
      var match = pair[0].match(regex);

      if (match) {
        // log("context", "Found a context arg:", pair[0]);
        var type = match[1];
        var key = match[2];
        if (!contextArgs.hasOwnProperty(type)) contextArgs[type] = {};
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

    var baseDocument = baseUnit.contents[0]; // log("Document", "Base document", baseDocument);

    this.doc = _.cloneDeep(baseDocument);
    this.units = [baseUnit];
    this.zones = {};
    this.templates = {};
    this.documentColour = '#808080';
    this.accentColour = '#808080';
    this.faviconURL = false;
    this.logoURL = false;
    this.portraitURL = false;
    this.animalURL = false;
    this.backgroundURL = false;
  }

  _createClass(Document, [{
    key: "addUnit",
    // TODO more parameters
    value: function addUnit(unit) {
      var _this5 = this;

      if (unit == null) return;
      log("Document", "Incorporating unit:", unit.id);
      this.units.push(unit);

      if (unit.hasOwnProperty("inc")) {
        unit.inc.forEach(function (include) {
          // log("Character", "At:", include);
          if (include.hasOwnProperty("at")) {
            if (include.hasOwnProperty("add")) _this5.addAtZone(include.at, include.add, false);
            if (include.hasOwnProperty("replace")) _this5.addAtZone(include.at, include.replace, true);
          }
        });
      } // TODO set variables

    }
  }, {
    key: "addAtZone",
    value: function addAtZone(zoneId, elements, replace) {
      var _this6 = this;

      if (zoneId.charAt(0) != '@') {
        err("Document", "Not a zone ID:", zoneId);
        return;
      }

      log("Document", "Adding to zone:", zoneId);
      if (!this.zones.hasOwnProperty(zoneId)) this.zones[zoneId] = [];
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
      // log("compose", " - Doc:", doc);
      // log("compose", " - Zones:", zones);
      // log("compose", " - Templates:", templates);
      // log("compose", " - Registry", registry);
      var self = this;

      function compose(element) {
        if (!element.hasOwnProperty("type")) return [element]; // if (element.type == 'table') log("Document", "Compose item", element);
        // first recurse so we have the ingredients

        ["contents", "placeholder", "header", "inputs"].forEach(function (item_key) {
          // log("compose", "Checking for", item_key);
          if (element.hasOwnProperty(item_key)) {
            // log("compose", "Preparing item", item_key, element[item_key]);
            if (Array.isArray(element[item_key])) element[item_key] = _.flatMap(element[item_key], compose);else element[item_key] = compose(element[item_key]);
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
          newelements = _.flatMap(newelements, compose);
          return newelements;
        } // if (element.type == "article") log("compose", "Composed element:", element);
        // if (element.hasOwnProperty('merge-bottom') && !!element['merge-bottom']) {
        //     // log("compose", "Merge bottom:", element);
        //     element = mergeBottom(element);
        //     if (element.type == 'article') log("compose", "Result:", element);
        // }


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
        if (unit.id != "document") rendered = replaceColours(rendered, _this7.documentColour, _this7.accentColour);
        cssParts.push(rendered);
      }); // put it all together

      log("stylesheet", "Found", cssParts.length, "stylesheet parts"); // logo

      if (this.logoURL) {
        // var logoURL = getDataURL(characterSheet.game+"/base", characterSheet.logo);
        cssParts.push(".logo{background-image:url('".concat(this.logoURL, "');}"));
      } // portrait


      if (this.portraitURL) {
        // var portraitURL = getDataURL(characterSheet.game+"/base", characterSheet.portrait);
        cssParts.push(".portrait--char_personal .portrait__inner{background-image:url('".concat(this.portraitURL, "');}"));
      } // animal companion portraits


      if (this.animalURL) {
        cssParts.push(".portrait--char_animal-companion .portrait__inner{background-image:url('".concat(this.animalURL, "');}"));
      } // background


      if (this.backgroundURL) {
        // var backgroundURL = getDataURL("core", characterSheet.background);
        cssParts.push(".page{background-image:url('".concat(this.backgroundURL, "'); background-size: 100% 100%;}"));
      }

      return cssParts.join("");
    }
  }, {
    key: "renderDocument",
    value: function renderDocument(registry) {
      // TODO load favicon
      // var faviconData = getDataURL("core", "images/"+args.favicon);
      var favicon = this.faviconURL ? "<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href='".concat(this.faviconURL, "' />") : ''; // TODO load stylesheet

      var stylesheet = this.getStylesheet();
      return "<!DOCTYPE html>\n<html lang='en-GB'>\n<head>\n<meta charset='utf-8'/>\n<title>".concat(esc(this.doc.title), "</title>\n").concat(favicon, "\n<style>\n").concat(stylesheet, "\n</style>\n</head>\n\n<body>\n<nav id='nav-pages'>\n<a class=\"skip-link\" href=\"#page-core\">Go to character info</a>\n<a class=\"skip-link\" href=\"#page-combat\">Go to combat</a>\n</nav>\n\n<main>\n").concat(registry.render(this.doc.contents), "\n</main>\n\n<nav id='screen-buttons'>\n<section id='left-buttons'>\n<button id='button--large' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--size_large';\"><i></i><span>Large font</span></button>\n<button id='button--high-contrast' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--high_contrast';\"><i></i><span>High contrast</span></button>\n</section>\n<button id='button--print' onclick=\"window.print();return false;\">Print</button>\n</nav>\n</body>\n</html>");
    }
  }, {
    key: "title",
    set: function set(title) {
      this.doc.title = title;
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

var MIME_SVG = 'image/svg+xml';
var MIME_PNG = 'image/png';
var MIME_JPEG = 'image/jpeg'; // const MIME_WOFF = 'application/font-woff;charset=utf-8';
// const MIME_WOFF = 'application/x-font-woff;charset=utf-8';

var MIME_WOFF = 'application/x-font-woff;charset=utf-8'; // const MIME_WOFF = 'font/woff;charset=utf-8';

var MIME_WOFF2 = 'application/font-woff2;charset=utf-8';
var MIME_SCSS = 'text/x-scss';
var MIME_HANDLEBARS = 'text/x-handlebars';

function mimeType(filename) {
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

function toDataURL(data, filename) {
  if (data === null) {
    warn("data", 'No data for file:', filename);
    return '';
  }

  var mime = mimeType(filename);

  switch (mime) {
    case MIME_SVG:
      data = processSVG(data);
      return 'data:' + mime + ',' + data;

    default:
      data = processBase64(data);
      return 'data:' + mime + ';base64,' + data;
  }
}

function parseCharacter(options) {
  // TODO: parse full character JSON
  options = _.defaults(options, {
    game: "pathfinder2",
    documentColour: '#505050',
    accentColour: '#505050',
    logo: 'logos/pathfinder2e.png',
    favicon: 'favicon16.png',
    portrait: 'portraits/wizard-ezren-runes.png',
    animal: false,
    background: 'backgrounds/paper3.png'
  });
  return options;
}

var Character =
/*#__PURE__*/
function () {
  function Character(chardesc, registry) {
    _classCallCheck(this, Character);

    this.registry = registry;
    this.chardesc = parseCharacter(chardesc);
  }

  _createClass(Character, [{
    key: "create",
    value: function create(callback) {
      var _this8 = this;

      var self = this;
      log$1("Character", "Create character");
      log$1("Character", "Name: ".concat(this.chardesc.name, ", game: ").concat(this.chardesc.game));
      log$1("Character", "Units: ".concat(this.chardesc.units));
      ready(function () {
        try {
          var system = getSystem(_this8.chardesc.game);

          if (system === null) {
            error$1("Character", "System not found:", _this8.chardesc.game);
            return;
          } // start with a document


          var documentUnit = system.getUnit("document");
          var document = new Document(documentUnit); // Load assets

          var loadQueue = new LoadQueue();

          if (_this8.chardesc.favicon) {
            loadQueue.loadEmbed(__dirname + '/assets/' + _this8.chardesc.favicon).then(function (data) {
              document.faviconURL = toDataURL(data, _this8.chardesc.favicon);
            });
          }

          if (_this8.chardesc.logo) {
            loadQueue.loadEmbed(__dirname + '/assets/' + _this8.chardesc.logo).then(function (data) {
              document.logoURL = toDataURL(data, _this8.chardesc.logo);
            });
          }

          if (_this8.chardesc.portrait) {
            loadQueue.loadEmbed(__dirname + '/assets/' + _this8.chardesc.portrait).then(function (data) {
              document.portraitURL = toDataURL(data, _this8.chardesc.portrait);
            });
          }

          if (_this8.chardesc.animal) {
            loadQueue.loadEmbed(__dirname + '/assets/' + _this8.chardesc.animal).then(function (data) {
              document.animalURL = toDataURL(data, _this8.chardesc.animal);
            });
          }

          if (_this8.chardesc.background) {
            loadQueue.loadEmbed(__dirname + '/assets/' + _this8.chardesc.background).then(function (data) {
              document.backgroundURL = toDataURL(data, _this8.chardesc.background);
            });
          } // TODO set character parameters


          document.title = _this8.chardesc.name;
          document.documentColour = _this8.chardesc.documentColour;
          document.accentColour = _this8.chardesc.accentColour;
          var units = system.getUnits(self.chardesc.units);
          units.forEach(function (unit) {
            return document.addUnit(unit);
          });
          document.composeDocument(_this8.registry);
          loadQueue.ready(function () {
            log$1("Character", "Ready"); // write the document out for debug

            fs$1.writeFile(__dirname + '/../test/prototype8.json', JSON.stringify(document.doc, null, 2), function (err) {
              if (err) error$1("Character", "Could not write JSON file:", err);
            }); // render the document

            var data = document.renderDocument(_this8.registry);
            callback(data);
          });
        } catch (err) {
          error$1("Character", "Error:", err);
        }
      });
    }
  }]);

  return Character;
}(); // start this first, it's the slow bit


loadSystemData(["common", "pathfinder2"]);
var registry = new Registry();

function CharacterSheets(chardesc) {
  return new Character(chardesc, registry);
}

module.exports = CharacterSheets;