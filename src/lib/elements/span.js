import { elementClass, esc } from '../util';

export let span = {
  name: 'span',
  key: 'content',
  defaults: {
    content: '',
    'field-separator': false,
    'article-cat': false,
  },
  render: args => {
    var cls = elementClass('span', null, args, ['field-separator', 'article-cat']);
    return `<span${cls}>${esc(args.content, true)}</span>`;
  }
}
