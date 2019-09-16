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
    value: null,
  },
  expect: ['icon'],
  render(args, reg, doc) {
    args = fieldDefaults(args, reg, doc);

    if (args.value === null) {
      args.value = doc.getVar(args.id);
      // if (args.value) log("field", "Value:", args.id, "=", args.value);
    }

    var id = elementID('field', args.id);
    var cls = elementClass('field', null, args,
      ["icon", "ref", "misc", "temp"],
      { "frame": "normal", "width": "medium", "align": "centre", "size": "medium", "control": "input", "shift": 0, "lp": 0, "border": "bottom", "flex": false });

    var frameArgs = Object.assign({}, args, { type: 'frame:' + args.frame });
    var frame = reg.renderItem(frameArgs, doc);
    return `<div${id}${cls}>${frame}</div>`;
  }
}

// field defaults are a combination of the defaults from the field's frame and control
export function fieldDefaults(args, reg, doc) {
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
    var ident = ` id='${fieldid}' name='${fieldid}'`;
    var forid = ` for='${fieldid}'`;
    return { id: fieldid, name: fieldid, for: forid, ident: ident };
  }

  var eid = fieldid + "--" + partid;
  var name = fieldid + '[' + partid + ']';
  var ident = ` id='${eid}' name='${name}'`;
  var forid = ` for='${eid}'`;
  return { id: eid, name: name, for: forid, ident: ident };
};

export function fieldRadioIdent(fieldid = '', value = '') {
  if (fieldid == '') {
    return { id: '', name: '', for: '', ident: '' };
  }

  if (value == '') {
    return fieldIdent(fieldid);
  }

  var id = fieldid + '--' + value;
  var ident = ` id='${id}' name='${fieldid}'`;
  var forid = ` for='${id}'`;
  return { id: id, name: fieldid, for: forid, ident: ident };
};

export function fieldInner(args, reg, doc) {
  args = Object.assign({}, args, { type: 'control:' + args.control });
  var icon = (has(args, "icon") && !!args.icon && isString(args.icon) && args.control != "icon") ? `<i class='icon icon_${args.icon}'></i>` : '';
  var unit = (has(args, "unit") && !!args.unit) ? `<label class='field__unit'>${__(args.unit, doc)}</label>` : '';

  var boxargs = _.pick(args, ['icon', 'border']);
  var inner;
  if (doc.largePrint && args.reduce > 0) {
    args.repeat -= args.reduce;
  }
  if (args.repeat > 1) {
    var boxes = [];
    var values = isArray(args.value) ? args.value : [args.value];

    for (var i = 0; i < args.repeat; i++) {
      var value = i >= values.length ? null : values[i];
      var controlArgs = Object.assign({}, args, { value: value });
      var control = reg.renderItem(controlArgs, doc);
      if (i == args.repeat - 1 && args['merge-bottom'])
        boxargs['border'] = 'none';
      var boxcls = elementClass('field', 'box', boxargs, ["icon"], { "border": "bottom" });
      var box = `<div${boxcls}>${icon}${control}${unit}</div>`;
      boxes.push(box);
    }
    inner = boxes.join("");
  } else {
    var control = reg.renderItem(args, doc);
    if (args['merge-bottom'])
      boxargs['border'] = 'none';
    var boxcls = elementClass('field', 'box', boxargs, ["icon"], { "border": "bottom" });
    inner = `<div${boxcls}>${icon}${control}${unit}</div>`;
  }
  var framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
  return `<div${framecls}>${inner}</div>`;
};
