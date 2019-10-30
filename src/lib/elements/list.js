import { elementClass, has, isObject } from '../util';
import { log } from '../log';

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
    light: false,
    'merge-bottom': false,
    'avoid-shade': false,
    flatten: false,
  },
  render(args, reg, doc) {
    if (args.zebra && args['avoid-shade']) {
      args['zebra-inverse'] = (args.contents.length % 2 == 0);
    }
    const cls = elementClass('list', null, args, ["zebra", "zebra-inverse", "collapse", "vr", "hr", "light", "merge-bottom"], { "flex": false });
    return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
  },
  transform(args) {
    // transform columns into a grid of lists
    if (args.columns > 1) {
      // log("-",`[zone] Split into ${element.columns} columns`);
      // log("-",`[zone] Contents:`, element.contents);
      let cols = [];
      if (args.flowv) {
        for (let i = 0; i < args.columns; i++) {
          cols.push([]);
        }
        let i = 0;
        args.contents.forEach(element => {
          cols[i].push(element);
          i++;
          if (i >= cols.length) i = 0;
        });
      } else {
        const split = Math.ceil((args.contents.length + 0.0) / (args.columns + 0.0));
        // log("-",`[zone] Split every ${element.contents.length} / ${element.columns} = ${split} items`);

        for (let i = 0; i < args.columns; i++) {
          const contents = args.contents.slice(i * split, (i + 1) * split);
          cols.push(contents);
        }
      }

      return [{
        type: "layout",
        layout: args.columns + "e",
        flex: args.flex,
        gutter: args.gutter,
        'merge-bottom': args['merge-bottom'],
        contents: cols.map(col => {
          return {
            ...args,
            columns: 1,
            contents: col
          };
        })
      }];
    }

    // flatten lists
    if (args.flatten) {
      let flattened = false;
      args.contents = args.contents.flatMap((item) => {
        if (isObject(item) && has(item, "type") && item.type == "list") {
          flattened = true;
          return item.contents;
        }
        return [item];
      });
      
      // log("list", "Flatten:", flattened);
      if (flattened) {
        return [args];
      }
    }
  
    return false;
  }
}

export let join = {
  name: 'join',
  key: 'join',
  defaults: {
    contents: [],
    join: ''
  },
  transform(args) {
    let items = [];
    args.contents.forEach(item => {
      items.push({ type: 'span', content: args.join });
      items.push(item);
    });
    items.shift();
    return items;
  }
}
