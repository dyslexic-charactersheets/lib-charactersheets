/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { elementClass, elementID } from '../util/elements';
import { __, _e } from '../i18n';

export let section = {
  name: 'section',
  key: 'title',
  defaults: {
    title: '',
    id: '',
    fill: false,
    flex: 'medium',
    untitled: false,
    contents: [],
    icon: false,
    mark: false,
  },
  render(args, reg, doc) {
    const id = elementID('section', args.id);
    const cls = elementClass('section', null, args, ['primary', 'fill', 'untitled', 'mark'], { flex: 'medium' });

    const icon = args.icon ? `<i class='icon icon_${args.icon}'></i>` : '';

    const title = args.untitled ? '' : `<h3>${icon}${_e(args.title, doc)}</h3>`;
    const mark = args.mark ? `<i class='mark icon_${args.mark}'></i>` : '';
    const content = `<div class='section__inner'>${mark}${reg.render(args.contents, doc)}</div>`;

    return `<section${id}${cls}>${title}
            ${content}
            </section>`;
  }
}
