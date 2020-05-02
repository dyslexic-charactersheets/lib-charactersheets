import { has, isString } from '../util';
import { log } from '../log';

export let sort = {
  name: 'sort',
  key: 'orderby',
  defaults: {
    orderby: '',
    order: 'ASC',
    sort: false,
    unique: false,
    contents: []
  },
  transform(args, ctx) {
    const key = args.orderby;
    // log("sort", `Sorting ${args.contents.length} items by ${key}`);

    let contents = args.contents;
    if (args.unique) {
      contents = [...new Set(contents)];
    }
    
    contents = contents.sort((a, b) => {
      const ka = isString(a) ? a : (has(a, key) ? a[key] : false);
      const kb = isString(b) ? b : (has(b, key) ? b[key] : false);
      if (!ka && !kb) return 0;
      if (!ka) return 1;
      if (!kb) return -1;
      // log("sort", `Compare: "${ka}" <> "${kb}"`);
      return ka.localeCompare(kb, ctx.locale, { sensitivity: 'base', ignorePunctuation: true });
    });

    if (args.order == 'DESC') {
      contents = contents.reverse();
    }
    return contents;
  }
};
