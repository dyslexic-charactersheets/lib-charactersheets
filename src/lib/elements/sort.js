import { has } from '../util';
import { log } from '../log';

export let sort = {
  name: 'sort',
  key: 'orderby',
  defaults: {
    orderby: '',
    order: 'ASC',
    sort: false,
    contents: []
  },
  transform(args, ctx) {
    const key = args.orderby;
    // log("sort", `Sorting ${args.contents.length} items by ${key}`);

    const contents = args.contents.sort((a, b) => {
      const ka = has(a, key) ? a[key] : false;
      const kb = has(b, key) ? b[key] : false;
      if (!ka && !kb) return 0;
      if (!ka) return 1;
      if (!kb) return -1;
      // log("sort", `Compare: "${ka}" <> "${kb}"`);
      return ka.localeCompare(kb, ctx.locale);
    });

    if (args.order == 'DESC') {
      contents = contents.reverse();
    }
    return contents;
  }
};
