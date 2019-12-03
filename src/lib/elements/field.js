import * as _ from 'lodash';

import { elementID, elementClass, getLabelHeight, has, interpolate, isArray, isString } from '../util';
import { __ } from '../i18n';
import { log } from '../log';
// import { render, renderItem } from '../classes/Registry';

export let field = {
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
    label: false,
    indent: false,
    value: null,
    blk: true,
  },
  expect: ['icon'],
  render(args, reg, doc) {
    args = fieldDefaults(args, reg, doc);

    if (args.value === null) {
      args.value = doc.getVar(args.id);
      // if (args.value) log("field", "Value:", args.id, "=", args.value);
    }

    const id = elementID('field', args.id);
    const cls = elementClass('field', null, args,
      ["icon", "ref", "misc", "temp", "indent", "blk"],
      { "frame": "normal", "width": "medium", "align": "centre", "size": "medium", "control": "input", "shift": 0, "lp": 0, "border": "bottom", "flex": false });

    const frameArgs = Object.assign({}, args, { type: 'frame:' + args.frame });
    const frame = reg.renderItem(frameArgs, doc);
    return `<div${id}${cls}>${frame}</div>`;
  }
}

// field defaults are a combination of the defaults from the field's frame and control
export function fieldDefaults(args, reg, doc) {
  args = Object.assign({
    frame: 'above',
    control: 'input'
  }, args);

  let frame = reg.get('frame:' + args.frame);
  if (!frame) {
    args.frame = 'above';
    frame = reg.get('frame:above');
  }

  let control = reg.get('control:' + args.control);
  if (!control) {
    args.control = 'input';
    control = reg.get('control:input');
  }

  args = Object.assign({
    border: (args.output ? 'full' : 'bottom'),
    align: (args.width == "stretch" ? "left" : "centre"),
    width: "medium",
    icon: false,
  }, control.defaults, frame.defaults, args);

  if (args.frame == "none" || args.frame == "annotation") {
    args.lp = 0;
    // log("field", "Frameless, no label padding");
  } else {
    args.lp = getLabelHeight(args);
    // log("field", `Frame ${args.frame}, label padding ${args.lp}`);
  }

  args = interpolate(args, {}, doc);
  return args;
};

export function fieldIdent(fieldid = '', partid = '') {
  if (fieldid == '' || fieldid === null) {
    return { id: '', name: '', for: '', ident: '' };
  }

  if (partid == '') {
    const ident = ` id='${fieldid}' name='${fieldid}'`;
    const forid = ` for='${fieldid}'`;
    return { id: fieldid, name: fieldid, for: forid, ident: ident };
  }

  const eid = fieldid + "--" + partid;
  const name = fieldid + '[' + partid + ']';
  const ident = ` id='${eid}' name='${name}'`;
  const forid = ` for='${eid}'`;
  return { id: eid, name: name, for: forid, ident: ident };
};

export function fieldRadioIdent(fieldid = '', value = '') {
  if (fieldid == '') {
    return { id: '', name: '', for: '', ident: '' };
  }

  if (value == '') {
    return fieldIdent(fieldid);
  }

  const id = fieldid + '--' + value;
  const ident = ` id='${id}' name='${fieldid}'`;
  const forid = ` for='${id}'`;
  return { id: id, name: fieldid, for: forid, ident: ident };
};

export function fieldInner(args, reg, doc) {
  args = Object.assign({}, args, { type: 'control:' + args.control });
  const icon = (has(args, "icon") && !!args.icon && isString(args.icon) && args.control != "icon") ? `<i class='icon icon_${args.icon}'></i>` : '';
  const unit = (has(args, "unit") && !!args.unit) ? `<label class='field__unit'>${__(args.unit, doc)}</label>` : '';

  let boxargs = _.pick(args, ['icon', 'border']);
  let inner;
  if (doc.largePrint && args.reduce > 0) {
    args.repeat -= args.reduce;
  }
  if (args.repeat > 1) {
    let boxes = [];
    const values = isArray(args.value) ? args.value : [args.value];

    for (let i = 0; i < args.repeat; i++) {
      const value = i >= values.length ? null : values[i];
      const controlArgs = Object.assign({}, args, { value: value });
      const control = reg.renderItem(controlArgs, doc);
      if (i == args.repeat - 1 && args['merge-bottom'] && boxargs['border'] == 'bottom')
        boxargs['border'] = 'none';
      const boxcls = elementClass('field', 'box', boxargs, ["icon"], { "border": "bottom" });
      const box = `<div${boxcls}>${icon}${control}${unit}</div>`;
      boxes.push(box);
    }
    inner = boxes.join("");
  } else {
    const control = reg.renderItem(args, doc);
    if (args['merge-bottom'] && boxargs['border'] == 'bottom')
      boxargs['border'] = 'none';
    const boxcls = elementClass('field', 'box', boxargs, ["icon"], { "border": "bottom" });
    inner = `<div${boxcls}>${icon}${control}${unit}</div>`;
  }
  const framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
  return `<div${framecls}>${inner}</div>`;
};
