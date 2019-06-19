import { elementClass, getLabelHeight } from '../util';

export let row = {
    name: 'row',
    key: 'layout', 
    defaults: {
        contents: [],
        layout: 'left',
        valign: 'bottom',
    },
    render: (args, reg) => {
        args.lp = getLabelHeight(args);
        var cls = elementClass('row', null, args, [ 'unlabelled' ], { 'layout': 'left', 'valign': 'bottom', 'lp': 0 });
        return `<div${cls}><div class='row__inner'>${reg.render(args.contents)}</div></div>`;
    }
}