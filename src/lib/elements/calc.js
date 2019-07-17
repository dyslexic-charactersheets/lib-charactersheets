import * as _ from 'lodash';

import { elementClass, getLabelHeight } from '../util';

export let calc = {
    name: 'calc',
    // key: 'output',
    defaults: {
        output: {},
        layout: 'left',
        inline: false,
        inputs: [],
    }, 
    render: (args, reg, doc) => {
        args.labelHeight = getLabelHeight(args);

        args.calc = true;
        var cls = elementClass('row', null, args, [ "calc", "inline", "labelHeight" ], { 'layout': 'center' });

        // parts of the calculation
        var output = Object.assign({
            border: "full"
        }, args.output);
        // var output = _.defaults(args.output, { "border": "full" });
        // log("-","Output:", output);
        var parts = [
            output,
            {
                "type": "span",
                "content": "="
            }
        ].concat(args.inputs.map(part => {
            if (typeof part == 'string') {
                return {
                    "type": "span",
                    "content": part
                };
            }
            return part;
        }));
        // log("-","Calculation contents", parts);

        // contextual args
        if (args.inline)
            args.field_frame = "inline";

        return `<div${cls}><div class='row__inner'>${reg.render(parts, doc)}<div class='spacer'></div></div></div>`;
    }
}
