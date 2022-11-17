import { elementClass } from '../util/elements';

export let box = {
    name: 'box',
    defaults: {
        swash: false,
    },
    render (args, reg, doc) {
        let cls = elementClass('box', null, args, ['swash']);
        return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
    }
}
