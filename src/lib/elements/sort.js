import { has, isString } from '../util';
import { log } from '../log';
import { isNumber } from 'util';

export let sort = {
  name: 'sort',
  key: 'orderby',
  defaults: {
    orderby: '',
    order: 'ASC',
    unique: false,
    contents: []
  },
  transform(args, ctx) {
    const key = args.orderby;
    // log("sort", `Sorting ${args.contents.length} items by ${key}`);

    let defaultValue = false;
    if (args.orderby == 'level' || args.orderby == 'order') {
      defaultValue = 1;
    }

    let contents = args.contents;
    if (args.unique) {
      contents = [...new Set(contents)];
    }
    
    contents = contents.sort((a, b) => {
      const ka = isString(a) ? a : (has(a, key) ? a[key] : defaultValue);
      const kb = isString(b) ? b : (has(b, key) ? b[key] : defaultValue);
      if (!ka && !kb) return 0;
      if (!ka) return 1;
      if (!kb) return -1;
      // log("sort", `Compare: "${ka}" <> "${kb}"`);
      if (isNumber(ka) || isNumber(kb))
        return ka - kb;
      return ka.localeCompare(kb, ctx.locale, { sensitivity: 'base', ignorePunctuation: true });
    });

    if (args.order == 'DESC') {
      contents = contents.reverse();
    }

    // log("sort", "Sorted items", contents);
    return contents;
  }
};
