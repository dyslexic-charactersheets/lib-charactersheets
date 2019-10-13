import { interpolate, isObject, cloneDeep } from '../util';
import { log } from '../log';

export let each = {
  name: 'each',
  key: '',
  defaults: {
    template: '',
    index: 'i',
    rows: [],
    params: {},
    contents: [],
  },
  transform(args) {
    let i = 0;
    // log("each", "Items", args.contents);
    return args.contents.flatMap(item => {
      i++;

      let values = cloneDeep(args.params);
      if (i < args.rows.length && isObject(args.rows[i]))
        values = { ...args.rows[i], ...values };

      values = { ...item, ...values, item: cloneDeep(item) };
      values[args.index] = i;

      // log("each", "Template", args.template);
      // log("each", "Values", values);
      const product = interpolate(args.template, values);
      // log("each", "Product", values);
      return product;
    });
  }
}
