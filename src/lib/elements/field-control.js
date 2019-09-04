import * as _ from 'lodash';
import { fieldIdent, fieldRadioIdent, fieldDefaults } from './field';
import { elementClass, has, isArray } from '../util';
import { __ } from '../i18n';

var defaultControlRender = (args, reg, doc) => {
  args = Object.assign({
    align: "center",
    width: "medium",
    editable: true,
    prefix: false,
    overlay: false,
    underlay: false,
  }, args);

  var ident = fieldIdent(args.id);
  var cls = elementClass("field", "control", args, [], { "align": "centre", "width": "medium" });
  var value = (args.value == '') ? '' : ` value='${__(args.value)}'`;
  var attr = (args.editable ? '' : 'readonly');
  var input = `<input${ident.ident}${value}${attr}>`;

  var underlay = args.underlay ? `<u>${__(args.underlay, doc)}</u>` : '';

  var prefix = args.prefix ? `<span class='field__overlay'>${__(args.prefix, doc)}</span>` : '';
  var overlay = args.overlay ? `<span class='field__overlay'>${__(args.overlay, doc)}</span>` : '';

  return `<div${cls}>${prefix}${input}${underlay}</div>${overlay}`;
};

var renderCompoundControl = (args, reg, doc) => {
  var parts = args.parts;

  var i = 0;
  var outputParts = parts.map(part => {
    if (typeof part == 'string')
      return part;

    if (isArray(args.value) && args.value.length > i) {
      part.value = args.value[i];
    }
    i++;

    if (has(part, "type") && part.type != "field")
      return reg.renderItem(part, doc);

    part = fieldDefaults(part, reg);
    part.type = 'control:' + part.control;

    return reg.renderItem(part, doc);
  });

  // log("control", "Parts:", outputParts);
  return outputParts.join("");
};

// Register the faux-elements

export let field_control_input = {
  name: 'control:input',
  defaults: {
    value: '',
    border: 'bottom',
  },
  render: defaultControlRender
}

export let field_control_speed = {
  name: 'control:speed',
  defaults: {
    units: "imperial",
    value: '',
    width: 'large',
  },
  render: (args, reg, doc) => {
    switch (args.units) {
      case "imperial":
        var ftIdent = fieldIdent(args.id, "ft");
        var sqIdent = fieldIdent(args.id, "sq");

        args.parts = [
          {
            type: "field",
            id: ftIdent.id,
            align: "right",
            width: "small"
          },
          {
            type: "label",
            label: "ft"
          },
          {
            type: "field",
            id: sqIdent.id,
            align: "right",
            width: "tiny"
          },
          {
            type: "label",
            label: "sq"
          },
        ];
        break;

      case "metric":
        var ftIdent = fieldIdent(args.id, "m");
        var sqIdent = fieldIdent(args.id, "sq");

        args.parts = [
          {
            type: "field",
            id: ftIdent.id,
            align: "right",
            width: "small"
          },
          {
            type: "label",
            label: "m"
          },
          {
            type: "field",
            id: sqIdent.id,
            align: "right",
            width: "tiny"
          },
          {
            type: "label",
            label: "sq"
          },
        ];
        break;
    }

    // log("field", "Speed field", args);
    return renderCompoundControl(args, reg, doc);
  }
}

export let field_control_weight = {
  name: 'control:weight',
  defaults: {
    schema: "starfinder",
    width: "huge"
  },
  render: (args, reg, doc) => {
    switch (args.schema) {
      case "starfinder":
        var bulkIdent = fieldIdent(args.id, "bulk");
        var lightIdent = fieldIdent(args.id, "light");

        args.parts = [
          {
            type: "field",
            id: bulkIdent.id,
            align: "right"
          },
          {
            type: "label",
            label: __("B", doc),
          },
          {
            type: "field",
            id: lightIdent.id,
            align: "right",
            width: "tiny"
          },
          {
            type: "label",
            label: __("L", doc),
          }
        ];
        break;
    }

    return renderCompoundControl(args, reg, doc);
  }
}

export let field_control_radio = {
  name: 'control:radio',
  defaults: {
    value: false,
    border: 'none',
  },
  render: args => {
    var ident = fieldRadioIdent(args.id, args.value);
    var cls = elementClass("field", "control", args, [], ["control"]);
    return `<div${cls}><input type='radio'${ident.ident}><label${ident.for}></label></div>`;
  }
}

export let field_control_checkbox = {
  name: 'control:checkbox',
  defaults: {
    value: false,
    border: 'none',
  },
  render: args => {
    var ident = fieldIdent(args.id);
    var cls = elementClass("field", "control", args, [], ["control"]);
    var checked = args.value ? ' checked' : '';
    return `<div${cls}><input type='checkbox'${checked}${ident.ident}><label${ident.for}></label></div>`;
  }
}

export let field_control_boost = {
  name: 'control:boost',
  defaults: {
    value: false,
    up: true,
    down: true,
    border: 'none',
  },
  render: args => {

    var up = '';
    if (args.up) {
      var upident = fieldIdent(args.id, "up");
      up = `<div class='field__control field__control--boost_up'><input type='checkbox' ${upident.ident}><label ${upident.for}></label></div>`
    }
    var down = '';
    if (args.down) {
      var downident = fieldIdent(args.id, "down");
      down = `<div class='field__control field__control--boost_down'><input type='checkbox' ${downident.ident}><label ${downident.for}></label></div>`
    }

    return `${down}${up}`;
  }
}

export let field_control_checkgrid = {
  name: 'control:checkgrid',
  defaults: {
    value: false,
    border: 'none',
    max: 10,
    group: 10,
    direction: "horizontal",
    depth: 3,
    value: 0
  },
  render: args => {
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
      var checked = (i <= args.value) ? ' checked' : '';
      var cls = elementClass("field", "control", args, [], ["control"]);
      var check = `<div${cls}><input type='checkbox'${ident.ident}${checked}><label${ident.for}></label></div>`;
      checks.push(check);
    }

    var groups = _.chunk(checks, args.group).map(ch => {
      var grouplen = Math.ceil(parseFloat(ch.length) / parseFloat(args.depth));
      var a = { dir: args.dir, w: args.w, h: args.h };
      a[args.direction == 'horizontal' ? 'w' : 'h'] = grouplen;
      // if (args.direction == "horizontal") {
      //     a.w = grouplen;
      // } else {
      //     a.h = grouplen;
      // }
      var cls = elementClass("field", "control-group", a, [], ["dir", "w", "h"]);
      return `<div${cls}>${ch.join("")}</div>`
    });

    // var groups = [];
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
}

export let field_control_alignment = {
  name: 'control:alignment',
  defaults: {
    value: '',
    border: 'none',
  },
  render: (args, reg, doc) => {
    var radios = ["lg", "ll", "le", "ng", "nn", "ne", "cg", "cn", "ce"].map(al => {
      var radioIdent = fieldRadioIdent(args.id, args.value);
      return `<div class='field__control field__control-${al}'><input type='radio'${radioIdent.ident}></div>`;
    });

    return `
            <i class='field__grid'></i>
            <i class='icon icon_good'></i>
            <i class='icon icon_evil'></i>
            <i class='icon icon_lawful'></i>
            <i class='icon icon_chaotic'></i>

            <label class='field__good'>${__("Good", doc)}</label>
            <label class='field__evil'>${__("Evil", doc)}</label>
            <label class='field__lawful'>${__("Lawful", doc)}</label>
            <label class='field__chaotic'>${__("Chaotic", doc)}</label>

            ${radios.join("")}
        `;
  }
}

export let field_control_icon = {
  name: 'control:icon',
  defaults: {
    value: '',
    border: 'none',
    icon: '',
  },
  render: args => {
    var cls = elementClass("field", "control", args, [], ["control"]);
    var iconcls = elementClass("icon", null, { icon: args.icon }, [], ["icon"]);
    return `<div${cls}><i${iconcls}></i></div>`;
  }
}

export let field_control_proficiency = {
  name: 'control:proficiency',
  defaults: {
    value: 0,
    icon: true,
  },
  render: (args, reg, doc) => {
    switch (args.value) {
      case 'untrained': args.value = 0; break;
      case 'trained': args.value = 1; break;
      case 'expert': args.value = 2; break;
      case 'master': args.value = 3; break;
      case 'legendary': args.value = 4; break;
      case 0: case 1: case 2: case 3: case 4: break;
      default: args.value = 0;
    }

    args.parts = [
      {
        type: "field",
        control: "proficiency-icon",
        value: args.value,
        id: args.id
      },
      {
        control: "input",
        id: args.id + "-bonus"
      }
    ];

    return renderCompoundControl(args, reg, doc);
  }
}

export let field_control_proficiency_icon = {
  name: 'control:proficiency-icon',
  render: args => {
    var cls = elementClass("field", "control", { control: "icon" }, [], { "control": "input" });

    // TODO checkboxes? radio buttons?
    return `
            <div${cls}>
            <input type='checkbox'${fieldIdent(args.id, "trained").ident} class='field--proficiency__trained'${args.value > 0 ? ' checked="checked"' : ''}>
            <input type='checkbox'${fieldIdent(args.id, "expert").ident} class='field--proficiency__expert'${args.value > 1 ? ' checked="checked"' : ''}>
            <input type='checkbox'${fieldIdent(args.id, "master").ident} class='field--proficiency__master'${args.value > 2 ? ' checked="checked"' : ''}>
            <input type='checkbox'${fieldIdent(args.id, "legendary").ident} class='field--proficiency__legendary'${args.value > 3 ? ' checked="checked"' : ''}>
            <i class='icon field--proficiency__icon'></i>
            </div>`;
  }
}

export let field_control_money = {
  name: 'control:money',
  defaults: {
    indent: 0,
    digits: 3,
    shift: 0,
    decimal: 0,
    denomination: "copper",
    value: '',
  },
  render: (args, reg, doc) => {
    var unit = '';
    switch (args.denomination) {
      case 'platinum': unit = 'pp'; break;
      case 'gold': unit = 'gp'; break;
      case 'silver': unit = 'sp'; break;
      case 'copper': unit = 'cp'; break;
    }
    var overlay = `<span class='field__overlay'>${__(unit, doc)}</span>`;

    var ident = fieldIdent(args.id);
    var cls = elementClass("field", "control", args, [], { "digits": 0, "shift": 0, "decimal": 0 });
    var value = (args.value == '') ? '' : ` value='${args.value}'`;

    var ticks = [];
    for (var i = 1; i < args.digits; i++) {
      var decimal = (i == args.decimal) ? ' field__tick--decimal' : '';
      ticks.push(`<label class='field__tick field__tick-${i}${decimal}'></label>`);
    }
    var shift = args.shift > 0 ? `<div class='field__shift field__shift--shift_${args.shift}'></div>` : '';

    return `<div${cls}><input${ident.ident}${value} size='${args.digits}'>${ticks.join("")}</div>${shift}${overlay}`;
  }
}

export let field_control_compound = {
  name: 'control:compound',
  defaults: {
    parts: [],
  },
  render: renderCompoundControl
}

export let field_control_progression = {
  name: 'control:progression',
  defaults: {
    parts: [],
    border: "none",
  },
  render: (args, reg, doc) => {
    args.parts = args.parts.flatMap(part => [part, '<label class="field__separator"></label>']);
    args.parts.pop();
    return renderCompoundControl(args, reg, doc);
  }
}
