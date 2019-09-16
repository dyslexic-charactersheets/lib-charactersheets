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
    var key = args.orderby;
    // log("sort", `Sorting ${args.contents.length} items by ${key}`);

    var contents = args.contents.sort((a, b) => {
      var ka = has(a, key) ? a[key] : false;
      var kb = has(b, key) ? b[key] : false;
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
