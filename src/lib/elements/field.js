import { interpolate, isArray, isString, toBoolean } from '../util';
import { elementID, elementClass, getRubyHeight } from '../util/elements';
import { has } from '../util/objects';
import { __, _e } from '../i18n';
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
    blk: false,
    ruby: false,
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
  render(args, reg, doc) {
    args = fieldDefaults(args, reg, doc);

    if (args.value === null) {
      args.value = doc.getVar(args.id);
      // if (args.value) log("field", "Value:", args.id, "=", args.value);
    }
    if (args.ruby) {
      args.rb = getRubyHeight(args);
    }

    const id = elementID('field', args.id);
    const cls = elementClass('field', null, args,
      ["icon", "ref", "misc", "temp", "indent", "blk"],
      { "frame": "normal", "width": "", "align": "centre", "size": "medium", "control": "input", "shift": 0, "rb": 0, "border": "bottom", "flex": false });

    const frameArgs = Object.assign({}, args, { type: 'frame:' + args.frame });
    const frame = reg.renderItem(frameArgs, doc);
    const ruby = args.ruby ? `<label class='field__ruby-text'>${_e(args.ruby, doc)}</label>` : '';
    return `<div${id}${cls}>${frame}${ruby}</div>`;
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

  // if (args.frame == "none" || args.frame == "annotation") {
  //   args.lp = 0;
  //   // log("field", "Frameless, no label padding");
  // } else {
  //   args.lp = getLabelHeight(args);
  //   // log("field", `Frame ${args.frame}, label padding ${args.lp}`);
  // }

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

export function fieldInner(args, reg, doc, decoration) {
  args = Object.assign({}, args, { type: 'control:' + args.control });
  const icon = (has(args, "icon") && !!args.icon && isString(args.icon) && args.control != "icon") ? `<i class='icon icon_${args.icon}'></i>` : '';
  const unit = (has(args, "unit") && !!args.unit) ? `<label class='field__unit'>${__(args.unit, doc)}</label>` : '';

  let boxargs = { icon: args.icon, border: args.border };
  const merge_bottom = toBoolean(args['merge-bottom']);

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
      if (i == args.repeat - 1 && merge_bottom && boxargs['border'] == 'bottom')
        boxargs['border'] = 'none';

      const boxcls = elementClass('field', 'box', boxargs, ["icon", "temp"], { "border": "bottom" });
      const box = `<div${boxcls}>${icon}${control}${unit}</div>`;
      boxes.push(box);
    }
    inner = boxes.join("");
  } else if (args.border == 'multi') {
    let boxes = [];
    const values = isArray(args.value) ? args.value : [args.value];
    
    for (let i = 0; i < args.parts.length; i++) {
      const value = i >= values.length ? null : values[i];
      const part = args.parts[i];

      if (has(part, "type") && part.type != "field") {
        let item = reg.renderItem(part, doc);
        boxes.push(item);
        continue;
      }

      const partArgs = {...args, label: '', control: 'input', border: 'full', width: 'medium', ...part, value};
      partArgs = {...partArgs, type: 'control:' + partArgs.control};
      const control = reg.renderItem(partArgs, doc);
      
      const boxcls = elementClass('field', 'box', partArgs, ["temp"], { "border": "bottom" });
      const partUnit = (has(partArgs, "unit") && !!args.unit) ? `<label class='field__unit'>${__(args.unit, doc)}</label>` : '';
      
      const ruby = partArgs.ruby ? `<label class='field__ruby-text'>${_e(partArgs.ruby, doc)}</label>` : '';
      const box = `<div class='field__boxes__inner'><div${boxcls}>${i == 0 ? icon : ''}${control}${partUnit}</div>${ruby}</div>`;
      boxes.push(box);
    }
    inner = `<div class='field__boxes'>${boxes.join("")}</div>`;
  } else {
    const control = reg.renderItem(args, doc);
    if (merge_bottom && boxargs['border'] == 'bottom')
      boxargs['border'] = 'none';
    const boxcls = elementClass('field', 'box', boxargs, ["icon", "temp"], { "border": "bottom" });
    inner = `<div${boxcls}>${icon}${control}${unit}</div>`;
  }
  return inner;
};
