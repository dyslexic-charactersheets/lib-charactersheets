/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { elementClass } from '../util/elements';
import { __, _e } from '../i18n';

export let span = {
  name: 'span',
  key: 'content',
  defaults: {
    content: '',
    'field-separator': false,
    'article-cat': false,
    'nowrap': false,
    value: false,
    size: 'medium',
  },
  render(args, reg, doc) {
    const cls = elementClass('span', null, args, ['field-separator', 'article-cat', 'nowrap', 'value'], {'size': 'medium'});
    return `<span${cls}>${_e(args.content, doc)}</span>`;
  }
}
