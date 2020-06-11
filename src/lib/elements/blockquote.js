import { elementClass } from '../util/elements';

export let blockquote = {
    name: 'blockquote',
    defaults: {
        blk: true,
    },
    render (args, reg, doc) {
        let cls = elementClass('blockquote', null, args, ['blk']);
        return `<blockquote>${reg.render(args.contents, doc)}</blockquote>`;
    }
}
