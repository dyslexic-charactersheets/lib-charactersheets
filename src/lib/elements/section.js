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
    var id = elementID('section', args.id);
    var cls = elementClass('section', null, args, ['primary', 'fill', 'untitled'], { flex: 'medium' });

    var title = args.untitled ? '' : `<h3>${esc(__(args.title, doc))}</h3>`;
    // var content = (args.contents.length == 1 && args.contents[0].type == "g") ? render(args.contents) : `<div class='g'>${render(args.contents)}</div>`;
    var content = `<div class='section__inner'>${reg.render(args.contents, doc)}</div>`;

    return `<section${id}${cls}>${title}
            ${content}
            </section>`;
  }
}
