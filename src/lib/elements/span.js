import { elementClass } from '../util';
import { __, _e } from '../i18n';

export let span = {
  name: 'span',
  key: 'content',
  defaults: {
    content: '',
    'field-separator': false,
    'article-cat': false,
    value: false,
  },
  render(args, reg, doc) {
    const cls = elementClass('span', null, args, ['field-separator', 'article-cat', 'value']);
    return `<span${cls}>${_e(args.content, doc)}</span>`;
  }
}
