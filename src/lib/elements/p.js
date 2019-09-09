import { elementClass, esc, isEmpty } from '../util';
import { log, error } from '../log';
import { __ } from '../i18n';

export let p = {
  name: 'p',
  key: 'content',
  defaults: {
    prose: false,
    content: '',
    align: 'left',
    icon: false,
  },
  render: (args, reg, doc) => {
    var cls = elementClass('p', null, args, ['prose'], {'align': 'left', 'size': 'medium'});

    // var paras = args.content.split(/[\n\r]/);
    var icon = args.icon ? reg.renderItem({
      type: 'icon',
      icon: args.icon,
      size: 'small'
    }, doc) : '';

    return `<p${cls}>${icon}${esc(__(args.content, doc), true)}</p>`;
  }
}

export let ul = {
  name: 'ul',
  render: (args, reg, doc) => {
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
  render: (args, reg, doc) => {
    // return `<li>${esc(__(args.content, doc), true)}</li>`;
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
    defs: []
  },
  render: (args, reg, doc) => {
    let defs = Object.keys(args.defs).map(term => {
      var termdef = args.defs[term];
      if (isEmpty(termdef))
        return '';
      switch(term) {
        case 'duration':  term = "_{Duration}";       break;
        case 'range':     term = "_{Range}";          break;
        case 'target':    term = "_{Target}";         break;
        case 'area':      term = "_{Area}";           break;
        case 'save':      term = "_{Saving Throw}";   break;
      }
      // log("p", "dl", term, termdef);
      return `<div><dt>${esc(__(term))}</dt><dd>${esc(__(termdef))}</dd></div> `;
    });
    return `<dl>${defs.join("")}</dl>`;
  }
}
