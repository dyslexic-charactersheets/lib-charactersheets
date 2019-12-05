import { elementClass, isEmpty } from '../util';
import { log, error } from '../log';
import { __, _e } from '../i18n';

export let ul = {
  name: 'ul',
  defaults: {
    blk: true,
  },
  render(args, reg, doc) {
    let cls = elementClass('ul', null, args, ['blk']);
    return `<ul${cls}>${reg.render(args.contents, doc)}</ul>`;
  }
}

export let li = {
  name: 'li',
  key: 'content',
  defaults: {
    content: '',
    contents: '',
    blk: true,
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
    let cls = elementClass('li', null, args, ['blk']);
    return `<li${cls}>${reg.render(args.contents, doc)}</li>`;
  }
}
