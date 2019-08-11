import { elementClass } from '../util';

export let g = {
    name: 'g',
    key: '', 
    defaults: {
        contents: [],
        galign: 'justify',
        valign: 'center',
    }, 
    render: (args, reg, doc) => {
        var cls = elementClass('g', null, args, [], { 'galign': 'justify', 'valign': 'center' });
        return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
    }
}
