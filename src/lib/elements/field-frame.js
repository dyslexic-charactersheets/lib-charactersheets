import { __, _e } from '../i18n';
import { elementClass } from '../util/elements';
import { fieldIdent, fieldRadioIdent, fieldInner } from './field';

function defaultFrameRender(args, reg, doc) {
  const ident = args.control == 'radio' ? fieldRadioIdent(args.id, args.value) : fieldIdent(args.id);
  const labelcls = elementClass('label', null, args, ["rotate", "nowrap"], {"align": ""});
  const label = args.label ? `<label${labelcls}${ident.for}>${_e(args.label, doc)}</label>` : '';
  const legend = args.legend ? `<legend>${_e(args.legend, doc)}</legend>` : '';

  const framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
  return `<div${framecls}>${legend}${label}${fieldInner(args, reg, doc)}</div>`;
};

// Register the faux-elements

export let field_frame_above = {
  name: 'frame:above',
  defaults: {
    label: false,
    legend: false,
  },
  render: defaultFrameRender,
}

export let field_frame_left = {
  name: 'frame:left',
  defaults: {
    label: false,
    legend: false,
  },
  render: defaultFrameRender
}

export let field_frame_right = {
  name: 'frame:right',
  defaults: {
    label: false,
    legend: false,
  },
  render(args, reg, doc) {
    const ident = (args.control == 'radio') ? fieldRadioIdent(args.id, args.value) : fieldIdent(args.id);
    const label = args.label ? `<label${ident.for}>${_e(args.label, doc)}</label>` : '';
    const legend = args.legend ? `<legend>${_e(args.legend, doc)}</legend>` : '';

    const framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return `<div${framecls}>${fieldInner(args, reg, doc)}${legend}${label}</div>`;
  }
}

export let field_frame_h_label = {
  name: 'frame:h-label',
  defaults: {
    label: false,
  },
  render(args, reg, doc) {
    const ident = fieldIdent(args.id);
    const label = args.label ? `<label class='field__h-label'${ident.for}>${_e(args.label, doc)}</label>` : '';
    // WRONG! The h-label is supposed to go inside the box!
    const framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return `<div${framecls}>${label}${fieldInner(args, reg, doc)}</div>`;
  }
}

export let field_frame_none = {
  name: 'frame:none',
  render(args, reg, doc) {
    const framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return `<div${framecls}>${fieldInner(args, reg, doc)}</div>`;
  }
}

export let field_frame_annotation = {
  name: 'frame:annotation',
  render(args, reg, doc) {
    const ident = fieldIdent(args.id);
    const label = args.label ? `<label class='field__annotation'${ident.for}>${_e(args.label, doc)}</label>` : '';
    const framecls = elementClass('field', 'frame', args, ["merge-bottom"], {});
    return `<div${framecls}>${label}${fieldInner(args, reg, doc)}</div>`;
  }
}

export let field_frame_circle = {
  name: 'frame:circle',
  defaults: {
    border: 'circle'
  },
  render: defaultFrameRender
}
