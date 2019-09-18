import { elementClass, esc } from '../util';
import { __ } from '../i18n';

export let span = {
  name: 'span',
  key: 'content',
  defaults: {
    content: '',
    'field-separator': false,
    'article-cat': false,
  },
  render(args, reg, doc) {
    const cls = elementClass('span', null, args, ['field-separator', 'article-cat']);
    return `<span${cls}>${esc(__(args.content, doc), true)}</span>`;
  }
}
