import { elementClass, isEmpty } from '../util';
import { log, error } from '../log';
import { __, _e } from '../i18n';

export let p = {
  name: 'p',
  key: 'content',
  defaults: {
    prose: false,
    content: '',
    align: 'left',
    icon: false,
    pad: false,
  },
  render(args, reg, doc) {
    const cls = elementClass('p', null, args, ['prose', 'pad'], { 'align': 'left', 'size': 'medium' });

    // let paras = args.content.split(/[\n\r]/);
    const icon = args.icon ? reg.renderItem({
      type: 'icon',
      icon: args.icon,
      size: 'small'
    }, doc) : '';

    return `<p${cls}>${icon}${_e(args.content, doc)}</p>`;
  }
}

export let ul = {
  name: 'ul',
  defaults: {
    pad: false,
  },
  render(args, reg, doc) {
    return `<ul>${reg.render(args.contents, doc)}</ul>`;
  }
}

export let li = {
  name: 'li',
  key: 'content',
  defaults: {
    content: '',
    contents: '',
  },
  render(args, reg, doc) {
    if (isEmpty(args.contents) && !isEmpty(args.content)) {
      args.contents = [
        {
          type: "p",
          content: args.content
        }
      ]
    }
    return `<li>${reg.render(args.contents, doc)}</li>`;
  }
}

export let dl = {
  name: 'dl',
  defaults: {
    div: false,
    defs: []
  },
  render(args, reg, doc) {
    let defs = Object.keys(args.defs).map(term => {
      let termdef = args.defs[term];
      if (isEmpty(termdef))
        return '';
      switch (term) {
        case 'duration': term = "_{Duration}"; break;
        case 'range': term = "_{Range}"; break;
        case 'target': term = "_{Target}"; break;
        case 'area': term = "_{Area}"; break;
        case 'save': term = "_{Saving Throw}"; break;
        case 'critical_success': term = "_{Critical Success}"; break;
        case 'success': term = "_{Success}"; break;
        case 'failure': term = "_{Failure}"; break;
        case 'critical_failure': term = "_{Critical Failure}"; break;
        case 'sustain': term = "_{Sustain}"; break;
      }
      // log("p", "dl", term, termdef);
      return `<div><dt>${_e(term, doc)}</dt><dd>${_e(termdef, doc)}</dd></div> `;
    });

    const dlCls = elementClass('dl', null, args, ['div']);
    return `<dl${dlCls}>${defs.join("")}</dl>`;
  }
}
