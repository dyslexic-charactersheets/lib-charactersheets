import { elementClass, esc, elementID } from '../util';
import { __ } from '../i18n';

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
  },
  render(args, reg, doc) {
    const id = elementID('section', args.id);
    const cls = elementClass('section', null, args, ['primary', 'fill', 'untitled'], { flex: 'medium' });

    const title = args.untitled ? '' : `<h3>${esc(__(args.title, doc))}</h3>`;
    const content = `<div class='section__inner'>${reg.render(args.contents, doc)}</div>`;

    return `<section${id}${cls}>${title}
            ${content}
            </section>`;
  }
}
