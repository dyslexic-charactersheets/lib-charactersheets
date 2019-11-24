import { elementClass, isEmpty } from '../util';
import { log, error } from '../log';
import { __, _e } from '../i18n';

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
