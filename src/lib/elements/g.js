import { elementClass } from '../util';

export let g = {
    name: 'g',
    key: '', 
    defaults: {
        contents: [],
        valign: 'center',
    }, 
    render: (args, reg) => {
        var cls = elementClass('g', null, args, [], { 'valign': 'center' });
        return `<div${cls}>${reg.render(args.contents)}</div>`;
    }
}
