import * as _ from 'lodash';

import { elementID, elementClass } from '../util';

export let layout = {
    name: 'layout',
    key: 'layout', 
    defaults: {
        layout: 'single',
        flex: false,
        columns: 0,
        gutter: 'medium',
        contents: [],
    }, 
    render: (args, reg, doc) => {
        var cls = elementClass('layout', null, args, [ 'no-flex' ], { 'layout': '', 'gutter': '', 'flex': false });

        // pick a column number
        var columns = args.columns;
        if (columns == 0) {
            switch (args.layout) {
                case '1n':
                    columns = 1;
                    break;

                case '2e':
                case '2l':
                case '2r':
                case 'alignment':
                    columns = 2;
                    break;

                case '3e':
                    columns = 3;
                    break;

                case '5e':
                    columns = 5;
                    break;
                
                case '6e':
                    columns = 6;
                    break;
            }
        }

        // chunk the contents
        var parts = [];
        if (columns == 0) {
            parts.push(args.contents);
        } else {
            parts = _.chunk(args.contents, columns);
        }

        return parts.map(contents => `<div${cls}>${reg.render(contents, doc)}</div>`).join("");
    }
}
