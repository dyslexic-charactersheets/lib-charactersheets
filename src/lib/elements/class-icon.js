import { elementClass } from '../util';

export let class_icon = {
    name: 'class-icon',
    key: 'icon', 
    defaults: {
        output: {},
        inline: false,
        inputs: [],
    }, 
    render: args => {
        var cls = elementClass('class-icon', null, args, [ ], [ 'icon' ]);
        return `<div${cls}></div>`;
    }
}
