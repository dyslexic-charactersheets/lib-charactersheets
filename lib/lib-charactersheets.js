'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

require('colors');

function log(area, message) {
  var _console;

  var prefix = "[".concat(area, "] ").padEnd(16).cyan;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  (_console = console).log.apply(_console, ["".concat(prefix).concat(message)].concat(args));
}

function error$1(area, message) {
  var _console2;

  var prefix = "[".concat(area, "] ").padEnd(16).red.bold;

  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  (_console2 = console).log.apply(_console2, ["".concat(prefix).concat(message)].concat(args));
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

var color = require('color');

function esc$1(content) {
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

  if (_.isNull(id) || id == '' || id == 'null') {
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

  if (!_.isNull(element)) {
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

  if (_.isArray(attribDefs)) {
    attribKeys = attribDefs;
    attribDefs = {};
  } else {
    attribKeys = _.keys(attribDefs);
  }

  var attribs = pickAttribs(args, attribKeys); // console.log("["+block+" class] Attribs:", attribs);

  _(attribs).toPairs().each(function (pair) {
    var key = pair[0];
    var value = pair[1];
    if (_.isNull(value)) return; // console.log("  -", key, " = ", value);
    // some default values can be skipped
    // switch (key) {
    //     case 'frame': if (value == 'normal') return;
    //     case 'control': if (value == 'input') return;
    // }

    if (_.has(attribDefs, key) && value == attribDefs[key]) return;

    switch (key) {
      // global attributes that don't need a prefix
      case 'align':
      case 'valign':
      case 'lp':
      case 'icon':
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

function interpolate$1(template, values) {
  // console.log("Interpolate:", template);
  // console.log(" - Values:", values);
  if (template === null) return null;

  if (_.isString(template)) {
    return template.replace(/#\{(.*?)\}/g, function (tag) {
      var match = tag.match(/#\{(.*?)\}/);
      var index = match[1]; // console.log("Match index:", index);

      if (_.has(values, index)) {
        // console.log(` - Replacing #{${index}} -> ${values[index]}`);
        return values[index];
      }

      return match;
    });
  }

  if (Array.isArray(template)) {
    return template.map(function (item) {
      return interpolate$1(item, values);
    });
  }

  if (_.isPlainObject(template)) {
    var pairs = _.toPairs(template); // console.log(" - value pairs", pairs);


    pairs = pairs.map(function (pair) {
      return [pair[0], interpolate$1(pair[1], values)];
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

function getLabelHeight(args) {
  // args = registryDefaultArgs(args);
  if (args.hasOwnProperty("labelHeight")) return args.labelHeight;
  if (args.context.hasOwnProperty("labelHeight")) return args.context.labelHeight;

  switch (args.type) {
    case 'field':
      switch (args.frame) {
        case 'none':
        case 'left':
        case 'right':
        case 'h-label':
          return 0;

        default:
          var labelHeight = args.label ? args.label.split(/\n/).length : 0;
          var legendHeight = args.legend ? args.legend.split(/\n/).length : 0;
          return Math.max(labelHeight, legendHeight, 1);
        // var label = "";
        // if (args.label) label = args.label;
        // if (args.legend) label = args.legend;
        // if (label == "") break;
        // return label.split(/\n/).length;
      }

      return 1;

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
  render: function render(args) {
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
      if (_.isString(part)) return {
        "type": "span",
        "content": part
      };
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
    var faviconData = getDataURL("core", "images/" + args.favicon);
    return "<!DOCTYPE html>\n<html lang='en-GB'>\n<head>\n<meta charset='utf-8'/>\n<title>".concat(esc(args.title), "</title>\n<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href='").concat(faviconData, "' />\n<style>\n").concat(CharacterSheets.stylesheet(), "\n</style>\n</head>\n\n<body>\n<nav id='nav-pages'>\n<a class=\"skip-link\" href=\"#page-core\">Go to character info</a>\n<a class=\"skip-link\" href=\"#page-combat\">Go to combat</a>\n</nav>\n\n<main>\n").concat(reg.render(args.contents), "\n</main>\n\n<nav id='screen-buttons'>\n<section id='left-buttons'>\n<button id='button--large' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--size_large';\"><i></i><span>Large font</span></button>\n<button id='button--high-contrast' class='btn' onclick=\"document.getElementsByTagName('html')[0].className += ' html--high_contrast';\"><i></i><span>High contrast</span></button>\n</section>\n<button id='button--print' onclick=\"window.print();return false;\">Print</button>\n</nav>\n</body>\n</html>");
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
    var i = 0; // log("-","[each] items", args.contents);

    return _.flatMap(args.contents, function (item) {
      i++;

      var values = _.cloneDeep(args.params);

      if (i < args.rows.length && _.isObject(args.rows[i])) // values = _.defaults(values, args.rows[i]);
        values = Object.assign(args.rows[i], values);
      values['item'] = item;
      values = Object.assign({}, item, values); // values = _.defaults(values, item);

      values[args.index] = i; // log("-","[each] template", args.template);
      // log("-","[each] interpolating", values);

      var product = interpolate$1(args.template, values); // log("-","[each] product", values);

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
    return "<".concat(h).concat(cls, ">").concat(esc$1(args.title), "</").concat(h, ">");
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
  name: 'h1',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h1')
};
var h3 = {
  name: 'h1',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h1')
};
var h4 = {
  name: 'h1',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h1')
};
var h5 = {
  name: 'h1',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h1')
};
var h6 = {
  name: 'h1',
  key: 'title',
  defaults: {
    title: "",
    align: ""
  },
  render: renderHeading('h1')
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
    return "<label".concat(cls, ">").concat(esc$1(args.label, true), "</label>");
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
    contents: []
  },
  render: function (_render) {
    function render(_x) {
      return _render.apply(this, arguments);
    }

    render.toString = function () {
      return _render.toString();
    };

    return render;
  }(function (args) {
    return render([{
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
  })
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
        return Object.assign(args, {
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

    return "<p".concat(cls, ">").concat(esc$1(args.content, true), "</p>");
  }
};
var portrait = {
  name: 'portrait',
  defaults: {
    overprint: false,
    'animal-companion': false
  },
  render: function render(args) {
    var copyright = "Image &copy; Paizo Publishing";
    var cls = elementClass('portrait', null, args, ['overprint', 'animal-companion'], []);
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
  render: function (_render2) {
    function render(_x2) {
      return _render2.apply(this, arguments);
    }

    render.toString = function () {
      return _render2.toString();
    };

    return render;
  }(function (args) {
    var icon = args.proficiency == "untrained" ? "proficiency" : "proficiency-" + args.proficiency;
    return render([{
      type: "layout",
      layout: "level",
      contents: [{
        type: "icon",
        icon: icon
      }, {
        type: "p",
        content: args.content
      }]
    }]);
  })
};
var action = {
  name: 'action',
  key: 'action',
  defaults: {
    action: 1,
    contents: []
  },
  render: function (_render3) {
    function render(_x3) {
      return _render3.apply(this, arguments);
    }

    render.toString = function () {
      return _render3.toString();
    };

    return render;
  }(function (args) {
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

    return render([{
      type: "layout",
      layout: "level",
      contents: [{
        type: "icon",
        icon: icon
      }, {
        type: "g",
        contents: args.contents
      }]
    }]);
  })
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
      var items = interpolate$1(args.contents, vars);
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
    valign: 'bottom'
  },
  render: function render(args, reg) {
    args.lp = getLabelHeight(args);
    var cls = elementClass('row', null, args, ['unlabelled'], {
      'layout': 'left',
      'valign': 'bottom',
      'lp': 0
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
    untitled: false,
    contents: []
  },
  render: function render(args, reg) {
    var cls = elementClass('section', null, args, ['primary', 'fill', 'untitled']);
    var title = args.untitled ? '' : "<h3>".concat(esc$1(args.title), "</h3>"); // var content = (args.contents.length == 1 && args.contents[0].type == "g") ? render(args.contents) : `<div class='g'>${render(args.contents)}</div>`;

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

    if (args.slot === null || args.slots == []) {
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
    slots.forEach(function (s) {
      // log("slots","Slot", s.key);
      s.contents = slotItems(s.contents);
      s.contents.forEach(function (item) {
        return item[args.key] = s.key;
      }); // log("slots","Slot", s.key, "items", s.contents);
    }); // log("slots", "Slots:", slots);

    var contents = slots.flatMap(function (s) {
      return s.contents;
    }); // log("slots","", contents);

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
    return "<span".concat(cls, ">").concat(esc$1(args.content, true), "</span>");
  }
};
var spells_list = {
  name: 'spells-list',
  defaults: {
    min: 1,
    max: 9,
    spells: 4,
    daily: false,
    special: false
  },
  render: function (_render4) {
    function render(_x4) {
      return _render4.apply(this, arguments);
    }

    render.toString = function () {
      return _render4.toString();
    };

    return render;
  }(function (args) {
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

    for (var lvl = min; lvl <= max; lvl++) {
      var level_marker = {
        type: "level-marker",
        level: lvl
      }; // number of spells

      var fields = [];

      if (args.special) {
        var special = interpolate$1(args.special, {
          'level': lvl
        });
        if (Array.isArray(special)) fields = special;else fields.push(special);
      }

      var n = parseInt(2 * Math.ceil((slots[lvl] + fields.length) / 2.0)) + fields.length; // log("-","[spells] Adding up to", n, "spell fields");

      for (var i = fields.length; i < n; i++) {
        fields.push({
          type: "field",
          id: "spells-level-".concat(lvl, "-").concat(n),
          frame: "none",
          align: "left",
          width: "stretch"
        });
      }

      var left = [];
      var right = []; // var n = Math.ceil(slots[lvl] / 2.0);

      for (var i = 0; i < fields.length; i++) {
        left.push(fields[i]);
        i++;
        right.push(fields[i]);
      } // full level


      spell_levels.push({
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
          contents: right
        }]
      });
    }

    return render([{
      type: "list",
      hr: true,
      zebra: true,
      'avoid-shade': true,
      contents: spell_levels
    }]);
  })
};
var table = {
  name: 'table',
  defaults: {
    rows: [],
    columns: [],
    repeat: 1,
    flip: false,
    template: null
  },
  render: function render(args, reg) {
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
      // log("-","Table row callback: function");
      rowCallback = args.template;
    } else if (Array.isArray(args.template)) {
      // log("-","Table row callback: elements");
      rowCallback = function rowCallback(row) {
        var templateCells = args.template.flatMap(function (cell) {
          if (_.isPlainObject(cell) && _.has(cell, "type") && cell.type == "calc") {
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

          if (_.isNull(cell)) {
            return '<td></td>';
          } else {
            if (_.isString(cell)) cell = {
              type: "label",
              label: cell
            }; // log("-","Cell:", cell);

            if (!_.has(cell, "type")) {
              return '<td></td>';
            }

            var col = args.columns[i]; // log("-","Cell:", cell, "+", col);

            var cell = _.defaults({}, cell, col, {
              type: 'label',
              label: ''
            }); // log("-","  =", cell);


            var cellCls = elementClass('td', null, cell, [], ['align']);
            return "<td".concat(cellCls, ">").concat(renderItem(cell), "</td>");
          }
        });
      };
    } else {
      // log("-","Table row callback: direct");
      rowCallback = function rowCallback(row) {
        return row.map(function (cell) {
          if (_.isString(cell)) cell = {
            type: "label",
            label: cell
          };
          if (!_.has(cell, "type")) return '<td></td>';
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
var template = {
  name: 'template',
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
    args = fieldDefaults(args);
    var id = elementID('field', args.id);
    var cls = elementClass('field', null, args, ["icon", "ref", "misc", "temp"], {
      "frame": "normal",
      "width": "medium",
      "align": "centre",
      "size": "medium",
      "control": "input",
      "shift": 0,
      "lp": 0
    });

    var frameArgs = _.defaults({
      type: 'frame:' + args.frame
    }, args);

    var frame = reg.renderItem(frameArgs);
    return "<div".concat(id).concat(cls, ">").concat(frame, "</div>");
  }
}; // field defaults are a combination of the defaults from the field's frame and control

function fieldDefaults(args) {
  args = _.defaults(args, {
    frame: 'above',
    control: 'input'
  });

  if (!_.has(CharacterSheets._registry, 'frame:' + args.frame)) {
    error('field', 'Field frame not registered:', args.frame);
    args.frame = 'above';
  }

  if (!_.has(CharacterSheets._registry, 'control:' + args.control)) {
    error('field', 'Field control not registered:', args.control);
    args.control = 'input';
  }

  var frame = CharacterSheets._registry['frame:' + args.frame];
  var control = CharacterSheets._registry['control:' + args.control];
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

  if (fieldid == '' || _.isNull(fieldid)) {
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

function fieldRadioIdent$1() {
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

function fieldInner(args) {
  args = _.defaults({
    type: 'control:' + args.control
  }, args);
  var control = renderItem(args);
  var icon = _.has(args, "icon") && !!args.icon && _.isString(args.icon) && args.control != "icon" ? "<i class='icon icon_".concat(args.icon, "'></i>") : '';
  var unit = _.has(args, "unit") && !!args.unit ? "<label class='field__unit'>".concat(args.unit, "</label>") : '';

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

function defaultFrameRender(args) {
  var ident = args.control == 'radio' ? fieldRadioIdent$1(args.id, args.value) : fieldIdent(args.id);
  var label = args.label ? "<label".concat(ident.for, ">").concat(esc(args.label, true), "</label>") : '';
  var legend = args.legend ? "<legend>".concat(esc(args.legend, true), "</legend>") : '';
  return "".concat(legend).concat(label).concat(fieldInner(args));
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
  render: function render(args) {
    var ident = fieldRadioIdent$1(args.id, args.value);
    var label = args.label ? "<label".concat(ident.for, ">").concat(esc(args.label, true), "</label>") : '';
    var legend = args.legend ? "<legend>".concat(esc(args.legend, true), "</legend>") : '';
    return "".concat(fieldInner(args)).concat(legend).concat(label);
  }
};
var field_frame_h_label = {
  name: 'frame:h-label',
  defaults: {
    label: false
  },
  render: function render(args) {
    var ident = fieldIdent(args.id);
    var label = args.label ? "<label class='field__h-label'".concat(ident.for, ">").concat(esc(args.label, true), "</label>") : ''; // WRONG! The h-label is supposed to go inside the box!

    return "".concat(label).concat(fieldInner(args));
  }
};
var field_frame_none = {
  name: 'frame:none',
  render: function render(args) {
    return fieldInner(args);
  }
}; // import { renderItem } from '../classes/Registry';

var defaultControlRender = function defaultControlRender(args) {
  args = _.defaults(args, {
    align: "center",
    width: "medium",
    editable: true,
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
  var overlay = args.overlay ? "<span class='field__overlay'>".concat(args.overlay, "</span>") : '';
  return "<div".concat(cls, ">").concat(input).concat(underlay, "</div>").concat(overlay);
};

var renderCompoundControl = function renderCompoundControl(args) {
  var parts = args.parts;
  var outputParts = parts.map(function (part) {
    if (_.isString(part)) return part;
    if (_.has(part, "type") && part.type != "field") return renderItem(part);
    part = fieldDefaults(part);
    part.type = 'control:' + part.control;
    return renderItem(part);
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
  render: function render(args) {
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


    return renderCompoundControl(args);
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
  render: function render(args) {
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
    return renderCompoundControl(args);
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
  render: function render(args) {
    args.parts = _.flatMap(args.parts, function (part) {
      return [part, '<label class="field__separator"></label>'];
    });
    args.parts.pop();
    return renderCompoundControl(args);
  }
}; // import * as _ from 'lodash';

var Registry =
/*#__PURE__*/
function () {
  function Registry() {
    var _this = this;

    _classCallCheck(this, Registry);

    this.registry = {}; // load all the elements

    [unit, article, blockquote, calc, class_icon, document, each, g, h1, h2, h3, h4, h5, h6, hr, icon, label, layout, level, level_marker, list, logo, page, p, portrait, proficiency, action, repeat, row, section, slots, spacer, span, spells_list, table, template, paste, unit, zone, field, field_frame_none, field_frame_above, field_frame_left, field_frame_right, field_frame_h_label, field_control_input, field_control_speed, field_control_alignment, field_control_boost, field_control_checkbox, field_control_radio, field_control_checkgrid, field_control_compound, field_control_progression, field_control_proficiency, field_control_proficiency_icon, field_control_icon].forEach(function (elem) {
      return _this.register(elem);
    });
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
      if (item.type == "unit") item.type = item["unit-type"]; // log("registry", `renderItem ${item.type}`);

      if (this.registry.hasOwnProperty[item.type]) {
        var reg = this.registry[item.type]; // registered defaults

        item = Object.assign({}, reg.defaults, item);
        if (item['merge-bottom']) item = mergeBottom(item);
        stack.push(item.type + (item.id == null ? '' : ":" + item.id) + (item.title == null ? '' : ':' + item.title));
        var output = reg.render(item);
        stack.pop();
        return output;
      } else {
        if (item.type == 'zone') warn("registry", "Unsatisfied zone", item.zone);else warn("registry", "Unknown element type:", item.type, "at:", stack, item);
        return '';
      }
    }
  }]);

  return Registry;
}();

var Character =
/*#__PURE__*/
function () {
  function Character(chardesc, registry) {
    _classCallCheck(this, Character);

    this.chardesc = chardesc;
    this.registry = registry;
  }

  _createClass(Character, [{
    key: "create",
    value: function create() {
      log("Character", "Create character"); // ...
    }
  }]);

  return Character;
}();

function loadSystemData(systems) {
  systems.forEach(function (system) {
    var systemFile = __dirname + "/lib-" + system + ".json";
    log("System", "Loading: ".concat(systemFile));
    fs.readFile(systemFile, 'utf-8', function (err, data) {
      if (err) {
        error$1("System", "Error loading system file ".concat(systemFile, ":"), err);
        return;
      }

      var systemData = JSON.parse(data);
      log("System", "Loaded ".concat(systemData.name, " (").concat(systemData.units.length, " units)"));
      systems[system] = systemData;
    });
  });
} // start this first, it's the slow bit


loadSystemData(["common", "pathfinder2"]);
var registry = new Registry();

function CharacterSheets$1(chardesc) {
  // TODO parse params
  return new Character(chardesc, registry);
}

module.exports = CharacterSheets$1;