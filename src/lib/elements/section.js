import { elementClass, esc } from '../util';

export let section = {
    name: 'section',
    key: 'title', 
    defaults: {
        title: '',
        fill: false,
        flex: 'medium',
        untitled: false,
        contents: [],
    },
    render: (args, reg, doc) => {
        var cls = elementClass('section', null, args, ['primary', 'fill', 'untitled'], { flex: 'medium' });

        var title = args.untitled ? '' : `<h3>${esc(args.title)}</h3>`;
        // var content = (args.contents.length == 1 && args.contents[0].type == "g") ? render(args.contents) : `<div class='g'>${render(args.contents)}</div>`;
        var content = `<div class='section__inner'>${reg.render(args.contents, doc)}</div>`;

        return `<section${cls}>${title}
            ${content}
            </section>`;
    }
}
