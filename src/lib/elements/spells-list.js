import { isArray, isEmpty, isNumber, isString } from '../util';
import { has, interpolate } from '../util/objects';
import { log } from '../log';

function spellField(lvl, style, checks, n, annotation, value) {
  // log("spells", `Spell field: level = ${lvl}, style = ${style}, n = ${n}`);
  let frame = "none";
  let label = null;
  // let border = "bottom";
  if (annotation) {
    frame = "annotation-box";
    label = annotation;
    // border = "full";
    // log("spells", "Annotation", annotation);
  }

  switch (style) {
    case 'prepared':
      let checkboxes = [];
      for (let i = 0; i < checks; i++) {
        checkboxes.push({
            control: "checkbox",
            id: `spells-level-${lvl}-${n}-${i}`
          });
      }

      return {
        type: "field",
        id: `spells-level-${lvl}-${n}`,
        frame: frame,
        label: label,
        align: 'left',
        width: 'stretch',
        // border: border,
        control: "compound",
        parts: [
          ...checkboxes,
          {
            control: "input",
            width: 'stretch',
            value: value,
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
        value: value,
        width: "stretch"
      };

    default:
      warn("spells", "Unknown style", style);
      return {};
  }
}

function spellLevel(lvl, ord, style, checks, slots, special, special_checks, special_value) {
  // log("spells", "Spell level:", lvl);
  const level_marker = {
    type: "level-marker",
    level: ord,
    marker: '',
  };

  function makeSpecialField(special, index) {
    if (isArray(special)) {
      return special.map((s, i) => makeSpecialField(s, i));
    }
    if (isString(special)) {
      let value = special_value;
      if (isArray(value)) {
        value = value[index];
      }
      let schecks = isEmpty(special_checks) ? checks : special_checks;
      special = spellField(lvl, style, schecks, "special", special, value);
    }
    return interpolate(special, { 'level': lvl });
  }

  // number of spells
  let fields = [];
  if (special) {
    special = makeSpecialField(special, 0);

    // if (isString(special)) {
    //   // log("spells", "Adding special entry", special);
    //   special = spellField(lvl, style, checks, "special", special, special_value);
    //   // log("spells", "Special", special);
    // }
    // special = interpolate(special, { 'level': lvl });
    
    if (isArray(special)) fields = special;
    else fields.push(special);
  }

  const n = parseInt(2 * Math.ceil((slots + fields.length) / 2.0)) - fields.length;
  // log("spells", `Adding up to ${n} spell fields`);
  for (let i = 1; i <= n; i++) {
    fields.push(spellField(lvl, style, checks, i, '', ''));
  }
  // log("spells", "Spell fields", fields);

  let left = [];
  let right = [];
  for (let i = 0; i < fields.length; i++) {
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


export let spells_bundle = {
  name: 'spells-bundle',
  defaults: {
    level: '',
    slots: 4,
    checks: 3,
    cantrips: false,
    style: "prepared",
  },
  transform(args, ctx) {
    return [spellLevel(args.level, args.level, args.style, args.checks, args.slots)];
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
    "special-value": "",
    style: "prepared",
    checks: 3,
    ordinal: true,
    'merge-bottom': true,
  },
  transform(args, ctx, reg) {
    const min = args.min;
    const max = args.max;

    // number of spells at each level
    let slots = {};
    if (isArray(args.spells)) {
      let i = 0;
      for (let lvl = min; lvl <= max; lvl++) {
        slots[lvl] = args.spells[i++];
      }
    } else {
      for (let lvl = min; lvl <= max; lvl++) {
        slots[lvl] = args.spells;
      }
    }

    // objects to render
    let spell_levels = [];

    if (args.cantrips) {
      spell_levels.push(spellLevel(0, '', 'spontaneous', 1, args.cantrips, false));
    }

    let specialValues = [];
    if (args.special && isArray(args["special-value"])) {
      specialValues = args["special-value"];
    }
    let specialChecks = [];
    if (has(args, ['special-checks'])) {
      specialChecks = args['special-checks'];
    }
    // log("spells-list", "Special values", specialValues, "Checks", specialChecks);

    for (let lvl = min; lvl <= max; lvl++) {
      const ord = args.ordinal ? ordinal(lvl) : lvl;

      let special_checks = 0;
      if (isArray(specialChecks)) {
        if (specialChecks.length >= lvl - min)
        special_checks = specialChecks[lvl - min];
      } else if (isNumber(specialChecks)) {
        special_checks = specialChecks;
      }
      
      // log("spells-list", "Special value", ord, specialValues, "check", special_checks);
      spell_levels.push(spellLevel(lvl, ord, args.style, args.checks, slots[lvl], args.special, special_checks, specialValues));
    }

    return [
      {
        type: "list",
        hr: true,
        zebra: true,
        flex: args.flex,
        'avoid-shade': true,
        'merge-bottom': args['merge-bottom'],
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
    'max-spells-per-day': 6,
    'spells-today': false,
    'expanded': false,
    ordinal: true,
    flip: false,
    pad: false,
    'merge-bottom': true,
    at: [],
    'spell-level-label': "_{Spell\nLevel}",
  },
  transform(args) {
    // log("-","[spells] Expanding spells table:", args);

    let rows = [];
    let columns = [];
    let template = [];

    // Rows
    for (let lvl = args.min; lvl <= args.max; lvl++) {
      const ord = (args.ordinal && !args.flip) ? ordinal(lvl) : lvl;
      rows.push({ level: lvl, ordinal: ord });
    }

    // Spell Level
    columns.push(args['spell-level-label']);
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
        max: args['max-spells-per-day'],
        depth: 'auto',
        frame: "none",
        at: args.at.map((item) => ({ level: item.level, max: item['max-spells-per-day'] }))
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

    let table = {
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

    if (args.pad) {
      table = {
        type: "g",
        pad: true,
        contents: [table]
      };
    }
    return [table];
  }
}
