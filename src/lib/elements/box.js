import { elementClass } from '../util/elements';

export let box = {
    name: 'box',
    defaults: {
        swash: false,
        colour: false,
    },
    render (args, reg, doc) {
        let cls = elementClass('box', null, args, ['swash'], { 'colour': false });
        return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
    }
}
