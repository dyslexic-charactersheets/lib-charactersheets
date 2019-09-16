import { interpolate, isArray, isString } from '../util';
import { log } from '../log';

function spellField(lvl, style, n, annotation) {
  // log("spells", `Spell field: level = ${lvl}, style = ${style}, n = ${n}`);
  var frame = "none";
  var label = null;
  // var border = "bottom";
  if (annotation) {
    frame = "annotation";
    label = annotation;
    // border = "full";
    // log("spells", "Annotation", annotation);
  }

  switch (style) {
    case 'prepared':
      return {
        type: "field",
        id: `spells-level-${lvl}-${n}`,
        frame: frame,
        label: label,
        // border: border,
        control: "compound",
        parts: [
          {
            control: "checkbox",
            id: `spells-level-${lvl}-${n}`
          },
          {
            control: "input",
            width: 'stretch',
          }
        ]
      };

    case 'spontaneous':
      return {
        type: "field",
        id: `spells-level-${lvl}-${n}`,
        frame: frame,
        label: label,
        // border: border,
        width: "stretch"
      };

    default:
      warn("spells", "Unknown style", style);
      return {};
  }
}

function spellLevel(lvl, ord, style, slots, special) {
  // log("spells", "Spell level:", lvl);
  var level_marker = {
    type: "level-marker",
    level: ord,
    marker: '',
  };

  // number of spells
  var fields = [];
  if (special) {
    if (isString(special)) {
      // log("spells", "Adding special entry", special);
      special = spellField(lvl, style, "special", special);
      // log("spells", "Special", special);
    }
    special = interpolate(special, { 'level': lvl });
    if (isArray(special)) fields = special;
    else fields.push(special);
  }

  var n = parseInt(2 * Math.ceil((slots + fields.length) / 2.0)) - fields.length;
  // log("spells", `Adding up to ${n} spell fields`);
  for (var i = 1; i <= n; i++) {
    fields.push(spellField(lvl, style, i, ''));
  }
  // log("spells", "Spell fields", fields);

  var left = [];
  var right = [];
  for (var i = 0; i < fields.length; i++) {
    left.push(fields[i]);
    i++;
    right.push(fields[i]);
  }

  // full level
  if (ord == "") {
    return {
      type: "layout",
      layout: "2e",
      narrow: true,
      contents: [
        {
          type: "list",
          collapse: true,
          "merge-bottom": true,
          contents: left
        },
        {
          type: "list",
          collapse: true,
          "merge-bottom": true,
          marker: '',
          contents: right
        }
      ]
    };
  }

  return {
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
  };
}

function ordinal(number) {
  switch (number) {
    case 0: return '';
    case 1: return "_{1st}";
    case 2: return "_{2nd}";
    case 3: return "_{3rd}";
    case 4: return "_{4th}";
    case 5: return "_{5th}";
    case 6: return "_{6th}";
    case 7: return "_{7th}";
    case 8: return "_{8th}";
    case 9: return "_{9th}";
    case 10: return "_{10th}";
  }
}


export let spells_list = {
  name: 'spells-list',
  key: 'style',
  defaults: {
    min: 1,
    max: 9,
    spells: 4,
    cantrips: false,
    daily: false,
    special: false,
    style: "prepared",
    ordinal: true,
  },
  transform(args, ctx) {
    var min = args.min;
    var max = args.max;

    // number of spells at each level
    var slots = {};
    if (isArray(args.spells)) {
      var i = 0;
      for (var lvl = min; lvl <= max; lvl++) {
        slots[lvl] = args.spells[i];
      }
    } else {
      for (var lvl = min; lvl <= max; lvl++) {
        slots[lvl] = args.spells;
      }
    }

    // objects to render
    var spell_levels = [];

    if (args.cantrips) {
      spell_levels.push(spellLevel(0, '', 'spontaneous', args.cantrips, false));
    }

    for (var lvl = min; lvl <= max; lvl++) {
      var ord = args.ordinal ? ordinal(lvl) : lvl;
      spell_levels.push(spellLevel(lvl, ord, args.style, slots[lvl], args.special));
    }

    return [
      {
        type: "list",
        hr: true,
        zebra: true,
        flex: args.flex,
        'avoid-shade': true,
        contents: spell_levels
      }
    ];
  }
}

export let spells_table = {
  name: 'spells-table',
  defaults: {
    min: 1,
    max: 9,
    'spells-per-day': true,
    'spells-today': false,
    'expanded': false,
    ordinal: true,
    flip: false,
    'merge-bottom': true,
  },
  transform(args) {
    // log("-","[spells] Expanding spells table:", args);

    var rows = [];
    var columns = [];
    var template = [];

    // Rows
    for (var lvl = args.min; lvl <= args.max; lvl++) {
      var ord = (args.ordinal && !args.flip) ? ordinal(lvl) : lvl;
      rows.push({ level: lvl, ordinal: ord });
    }

    // Spell Level
    columns.push("Spell\nLevel");
    template.push({
      type: "level-marker",
      level: "#{ordinal}",
      marker: ""
    });

    // Spells per day
    if (args['spells-per-day']) {
      columns.push("_{Spells\nper day}");
      template.push({
        type: "field",
        id: "spells-#{level}-per-day",
        border: args.flip ? (args['merge-bottom'] ? "right" : "bottom-right") : "bottom",
        frame: "none",
        width: args.flip ? "small" : "medium",
        'merge-right': true,
      });
    }

    if (args['spells-today']) {
      columns.push("_{Spell\ntoday}");
      template.push({
        type: "field",
        id: "spells-#{level}-today",
        control: "checkgrid",
        max: 6,
        depth: 2,
        frame: "none"
      });
    }
    if (args.expanded) {
      columns.push(args.expanded);
      template.push({
        type: "field",
        id: "spells-#{level}-expanded",
        width: "stretch",
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
    table = Object.assign({}, args, table);
    // log("-","[spells] Expanded spells table:", table);
    return [table];
  }
}
