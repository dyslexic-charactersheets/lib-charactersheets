/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { elementClass } from '../util/elements';

export let box = {
    name: 'box',
    defaults: {
        swash: false,
        colour: false,
    },
    render (args, reg, doc) {
        const cls = elementClass('box', null, args, ['swash'], { 'colour': false });

        const hrcls = elementClass('hr', null, args, ['swash', 'blk']);
        const swash = args.swash ? `<div${hrcls}><div class='inner'></div></div>` : '';

        return `<div${cls}>${swash}${reg.render(args.contents, doc)}${swash}</div>`;
    }
}
