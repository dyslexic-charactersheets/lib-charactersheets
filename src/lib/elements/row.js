import { elementClass, getLabelHeight } from '../util';

export let row = {
    name: 'row',
    key: 'layout', 
    defaults: {
        contents: [],
        layout: 'left',
        valign: 'bottom',
        unlabelled: false,
        narrow: false,
    },
    render: (args, reg, doc) => {
        args.lp = getLabelHeight(args);
        var cls = elementClass('row', null, args, [ 'unlabelled', 'narrow' ], { 'layout': 'left', 'valign': 'bottom', 'lp': '' });
        return `<div${cls}><div class='row__inner'>${reg.render(args.contents, doc)}</div></div>`;
    }
}
