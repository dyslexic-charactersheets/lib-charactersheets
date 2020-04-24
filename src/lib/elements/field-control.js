import * as _ from 'lodash';
import { fieldIdent, fieldRadioIdent, fieldDefaults } from './field';
import { elementClass, has, isArray } from '../util';
import { __, _e } from '../i18n';

function defaultControlRender (args, reg, doc) {
  args = Object.assign({
    align: "center",
    width: "medium",
    editable: true,
    prefix: false,
    suffix: false,
    underlay: false,
  }, args);

  const ident = fieldIdent(args.id);
  const cls = elementClass("field", "control", args, [], { "align": "centre", "width": "" });
  const value = (args.value == '') ? '' : ` value='${_e(args.value, doc)}'`;
  const attr = (args.editable ? '' : 'readonly');
  const input = `<input${ident.ident}${value}${attr}>`;

  const underlay = args.underlay ? `<u>${__(args.underlay, doc)}</u>` : '';

  const prefix = args.prefix ? `<span class='field__overlay'>${__(args.prefix, doc)}</span>` : '';
  const suffix = args.suffix ? `<span class='field__overlay'>${__(args.suffix, doc)}</span>` : '';

  return `${prefix}<div${cls}>${input}${underlay}</div>${suffix}`;
};

function renderCompoundControl(args, reg, doc) {
  const parts = args.parts;

  let i = 0;
  const outputParts = parts.map(part => {
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

export let field_control_value = {
  name: 'control:value',
  defaults: {
    value: '',
    border: 'none',
  },
  render(args, reg, doc) {
    const cls = elementClass("field", "control", args, [], { "control": "", "align": "centre", "width": "" });

    const prefix = args.prefix ? `<span class='field__overlay'>${__(args.prefix, doc)}</span>` : '';
    const suffix = args.suffix ? `<span class='field__overlay'>${__(args.suffix, doc)}</span>` : '';
    const underlay = args.underlay ? `<u>${__(args.underlay, doc)}</u>` : '';

    const value = `<span>${_e(args.value, doc)}</span>`;

    return `${prefix}<div${cls}>${value}${underlay}</div>${suffix}`;
  }
};

export let field_control_ref = {
  name: 'control:ref',
  defaults: {
    icon: "book",
    width: "huge"
  },
  render(args, reg, doc) {
    let id = args.id;
    args.parts = [
      {
        type: "field",
        id: `${id}-book`,
        width: "large"
      },
      {
        type: "span",
        content: "_{p}"
      },
      {
        type: "field",
        id: `${id}-page`,
        width: "large",
        align: "left"
      }
    ];
    return renderCompoundControl(args, reg, doc);
  }
}

export let field_control_speed = {
  name: 'control:speed',
  defaults: {
    units: "imperial",
    value: '',
    width: 'large',
  },
  render(args, reg, doc) {
    switch (args.units) {
      case "imperial": {
        const ftIdent = fieldIdent(args.id, "ft");
        const sqIdent = fieldIdent(args.id, "sq");

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
      }

      case "metric": {
        const ftIdent = fieldIdent(args.id, "m");
        const sqIdent = fieldIdent(args.id, "sq");

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
    }

    // log("field", "Speed field", args);
    return renderCompoundControl(args, reg, doc);
  }
}

export let field_control_weight = {
  name: 'control:weight',
  defaults: {
    schema: "bulk",
    width: "huge"
  },
  render(args, reg, doc) {
    switch (args.schema) {
      case "bulk": {
        const bulkIdent = fieldIdent(args.id, "bulk");
        const lightIdent = fieldIdent(args.id, "light");

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
  render(args) {
    const ident = fieldRadioIdent(args.id, args.value);
    const cls = elementClass("field", "control", args, [], ["control"]);
    return `<div${cls}><input type='radio'${ident.ident}><label${ident.for}></label></div>`;
  }
}

export let field_control_checkbox = {
  name: 'control:checkbox',
  defaults: {
    value: false,
    border: 'none',
    width: 'tiny',
  },
  render(args) {
    const ident = fieldIdent(args.id);
    const cls = elementClass("field", "control", args, [], ["control"]);

    if (args.value == "false") {
      args.value = false;
    }
    const checked = args.value ? ' checked' : '';
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
  render(args) {
    let up = '';
    if (args.up) {
      const upident = fieldIdent(args.id, "up");
      up = `<div class='field__control field__control--boost_up'><input type='checkbox' ${upident.ident}><label ${upident.for}></label></div>`
    }
    let down = '';
    if (args.down) {
      const downident = fieldIdent(args.id, "down");
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
  render(args) {
    let g = args.group;
    if (args.max < args.group) g = args.max;
    const grouplen = Math.ceil(parseFloat(g) / parseFloat(args.depth));
    if (args.direction == "horizontal") {
      args.dir = "h";
      args.w = grouplen;
      args.h = args.depth;
    } else {
      args.dir = "v";
      args.h = grouplen;
      args.w = args.width;
    }

    let checks = [];
    for (let i = 1; i <= args.max; i++) {
      const ident = fieldIdent(args.id, i);
      const checked = (i <= args.value) ? ' checked' : '';
      const cls = elementClass("field", "control", args, [], ["control"]);
      const check = `<div${cls}><input type='checkbox'${ident.ident}${checked}><label${ident.for}></label></div>`;
      checks.push(check);
    }

    const groups = _.chunk(checks, args.group).map(ch => {
      const grouplen = Math.ceil(parseFloat(ch.length) / parseFloat(args.depth));
      let a = { dir: args.dir, w: args.w, h: args.h };
      a[args.direction == 'horizontal' ? 'w' : 'h'] = grouplen;
      const cls = elementClass("field", "control-group", a, [], ["dir", "w", "h"]);
      return `<div${cls}>${ch.join("")}</div>`
    });

    return groups.join("");
  }
}

export let field_control_alignment = {
  name: 'control:alignment',
  defaults: {
    value: '',
    border: 'none',
  },
  render(args, reg, doc) {
    const radios = ["lg", "ll", "le", "ng", "nn", "ne", "cg", "cn", "ce"].map(al => {
      const radioIdent = fieldRadioIdent(args.id, args.value);
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
    width: '',
  },
  render(args) {
    const cls = elementClass("field", "control", args, [], {"control": ""});
    const iconcls = elementClass("icon", null, { icon: args.icon }, [], {"icon": "", "width": ""});
    return `<div${cls}><i${iconcls}></i></div>`;
  }
}

export let field_control_proficiency = {
  name: 'control:proficiency',
  defaults: {
    value: 0,
    icon: true,
    'has-bonus': true,
  },
  render(args, reg, doc) {
    switch (args.value) {
      case 'untrained': args.value = 0; break;
      case 'trained': args.value = 1; break;
      case 'expert': args.value = 2; break;
      case 'master': args.value = 3; break;
      case 'legendary': args.value = 4; break;
      case 0: case 1: case 2: case 3: case 4: break;
      default: args.value = 0;
    }


    if (args['has-bonus']) {
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
    } else {
      args.parts = [
        {
          type: "field",
          control: "proficiency-icon",
          value: args.value,
          id: args.id
        }
      ]
    }

    return renderCompoundControl(args, reg, doc);
  }
}

export let field_control_proficiency_icon = {
  name: 'control:proficiency-icon',
  render(args) {
    const cls = elementClass("field", "control", { control: "icon" }, [], { "control": "input" });

    // TODO checkboxes? radio buttons?
    return `<div${cls}>
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
  render(args, reg, doc) {
    let unit = '';
    switch (args.denomination) {
      case 'platinum': unit = 'pp'; break;
      case 'gold': unit = 'gp'; break;
      case 'silver': unit = 'sp'; break;
      case 'copper': unit = 'cp'; break;
    }
    const suffix = `<span class='field__overlay'>${__(unit, doc)}</span>`;

    const ident = fieldIdent(args.id);
    const cls = elementClass("field", "control", args, [], { "digits": 0, "shift": 0, "decimal": 0 });
    const value = (args.value == '') ? '' : ` value='${args.value}'`;

    let ticks = [];
    for (let i = 1; i < args.digits; i++) {
      const decimal = (i == args.decimal) ? ' field__tick--decimal' : '';
      ticks.push(`<label class='field__tick field__tick-${i}${decimal}'></label>`);
    }
    const shift = args.shift > 0 ? `<div class='field__shift field__shift--shift_${args.shift}'></div>` : '';

    return `<div${cls}><input${ident.ident}${value} size='${args.digits}'>${ticks.join("")}</div>${shift}${suffix}`;
  }
}

export let field_control_compound = {
  name: 'control:compound',
  defaults: {
    multibox: false,
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
  render(args, reg, doc) {
    args.parts = args.parts.flatMap(part => [part, '<label class="field__separator"></label>']);
    args.parts.pop();
    return renderCompoundControl(args, reg, doc);
  }
}
