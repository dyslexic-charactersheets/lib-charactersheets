import { elementID, elementClass } from '../util';
import { log } from '../log';

export let layout = {
  name: 'layout',
  key: 'layout',
  defaults: {
    layout: 'single',
    flex: false,
    columns: 0,
    gutter: 'medium',
    contents: [],
    blk: false,
    unblk: true,
  },
  render(args, reg, doc) {
    // pick a column number
    let columns = args.columns;
    if (columns == 0) {
      switch (args.layout) {
        case '1n':
          columns = 1;
          break;

        case '2e':
        case '2l':
        case '2r':
        case 'alignment':
        case 'indent-l':
        case 'indent-lw':
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

    if (columns > 0 && args.contents.length > columns) {
      // log("layout", `Split: ${args.contents.length} items into ${columns} columns`);
      let items = [];
      for (let n = 0; n < args.contents.length; n += columns) {
        let chunk = args.contents.slice(n, n+columns);
        items.push({
          ...args,
          contents: chunk
        });
      }
      // log("layout", "Split render", items);
      return reg.render(items, doc);
    }
    
    const cls = elementClass('layout', null, args, ['no-flex', 'blk', 'unblk'], { 'layout': '', 'gutter': '', 'flex': false });
    return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
  }
}

export let place = {
  name: 'place',
  key: 'loc',
  defaults: {
    loc: 'middle',
    contents: []
  },
  render(args, reg, doc) {
    const cls = elementClass('layout', 'place', args, [], { 'loc': '' });
    return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
  }
}


export let indent = {
  name: 'indent',
  key: 'layout',
  defaults: {
    layout: 'left',
    contents: []
  },
  transform(args, ctx) {
    let layout = args.layout;
    let contents = args.contents;

    switch (layout) {
      case 'left':
        layout = 'indent-l';
        contents = [
          { type: 'g' },
          { type: 'g', contents: args.contents },
        ];
        break;

      case 'right':
        layout = 'indent-r';
        contents = [
          { type: 'g', contents: args.contents },
          { type: 'g' }
        ];
        break;

      case 'both':
        layout = 'indent-lr';
        contents = [
          { type: 'g' },
          { type: 'g', contents: args.contents },
          { type: 'g' }
        ]

      case false:
        return [
          {
            type: 'g',
            contents 
          }
        ];
    }

    return [
      {
        type: 'layout',
        layout,
        contents 
      }
    ];
  }
}
