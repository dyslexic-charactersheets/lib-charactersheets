import { elementClass } from '../util';

export let list = {
    name: 'list',
    defaults: {
        contents: [],
        columns: 1,
        flowv: true,
        zebra: false,
        flex: false,
        sort: true,
        hr: false,
        vr: false,
        'merge-bottom': false,
        'avoid-shade': false,
    },
    render: (args, reg) => {
        if (args.zebra && args['avoid-shade']) {
            args['zebra-inverse'] = (args.contents.length % 2 == 0);
        }
        var cls = elementClass('list', null, args, [ "zebra", "zebra-inverse", "collapse", "flex", "vr", "hr", "merge-bottom" ], []);
        return `<div${cls}>${reg.render(args.contents)}</div>`;
    }, 
    transform: args => {
        if (args.columns == 1)
            return false;

        // log("-",`[zone] Split into ${element.columns} columns`);
        // log("-",`[zone] Contents:`, element.contents);
        var cols = [];
        if (args.flowv) {
            for (var i = 0; i < args.columns; i++) {
                cols.push([]);
            }
            var i = 0;
            args.contents.forEach(element => {
                cols[i].push(element);
                i++;
                if (i >= cols.length) i = 0;
            });
        } else {
            var split = Math.ceil((args.contents.length + 0.0) / (args.columns + 0.0));
            // log("-",`[zone] Split every ${element.contents.length} / ${element.columns} = ${split} items`);

            for (var i = 0; i < args.columns; i++) {
                var contents = args.contents.slice(i * split, (i + 1) * split);
                cols.push(contents);
            }
        }

        return [{
            type: "layout",
            layout: args.columns+"e",
            contents: cols.map(col => {
                return Object.assign({}, args, {
                    columns: 1,
                    contents: col
                });
            })
        }];
    }
}