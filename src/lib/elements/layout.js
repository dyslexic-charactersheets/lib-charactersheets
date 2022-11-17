import { elementID, elementClass } from '../util/elements';
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
    vr: false,
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
        case '2ll':
        case '2r':
        case '2rr':
        case 'alignment':
        case 'indent-l':
        case 'indent-r':
        case 'indent-lw':
        case 'indent-rw':
        case 'indent-ln':
        case 'indent-rn':
          columns = 2;
          break;

        case '3e':
        case '3f':
        case 'indent-lr':
        case 'indent-lrw':
        case 'indent-lrn':
          columns = 3;
          break;

        case '4e':
          columns = 4;
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

    // wrap layout
    let contents = args.contents.map(elem => {
      return `<div class='layout__inner'>${reg.render([elem], doc)}</div>`;
    });
    
    const cls = elementClass('layout', null, args, ['no-flex', 'blk', 'unblk', 'vr'], { 'layout': '', 'gutter': '', 'flex': false });
    return `<div${cls}>${contents.join('')}</div>`;
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
      case null:
      case '':
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

    // log("layout", "Indent", args.layout, "=>", layout);
    return [
      {
        type: 'layout',
        layout,
        contents 
      }
    ];
  }
}
