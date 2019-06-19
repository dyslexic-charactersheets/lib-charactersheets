import { elementClass, esc } from '../util';

export let label = {
    name: 'label',
    key: 'label', 
    defaults: {
        label: "",
    },
    render: args => {
        var cls = elementClass('label', null, args, [], [ "align" ]);
        return `<label${cls}>${esc(args.label, true)}</label>`;
    }
}
