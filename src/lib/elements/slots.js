import { has, isArray, isString, cloneDeep, interpolate, mergeBottom } from '../util';
import { log, warn } from '../log';
// import { mergeBottom } from '../classes/Registry';

export let slots = {
  name: 'slots',
  key: 'slots',
  defaults: {
    slots: [],
    key: 'level',
    placeholder: null,
    max: false,
    min: false,
    reduce: 0,
    extra: 0,
    even: false,
    contents: [],
  },
  transform(args, ctx) {
    // log("slots", "Slots:", args.slots);

    let placeholder = args.placeholder;
    if (!isArray(placeholder))
      placeholder = [placeholder];

    if (ctx.largePrint && args.reduce > 0) {
      args.min -= args.reduce;
      args.max -= args.reduce;
    }

    function slotItems(items) {
      // log("slots", "Items", items);
      if (args.min && items.length < args.min) {
        const n = args.min - items.length;
        for (let i = 0; i < n; i++) {
          // log("slots","Placeholder", args.placeholder);
          items = items.concat(cloneDeep(args.placeholder));
        }
      }
      if (args.max && items.length > args.max) {
        items = items.slice(0, args.max);
      }

      return items;
    }

    if (args.slots === null || args.slots == []) {
      // log("slots", "Slots item:", args);
      // log("slots","Single slot");
      let contents = slotItems(args.contents);
      if (args['merge-bottom']) {
        contents = mergeBottom(contents);
      }
      return contents;
    }

    let slots = {};
    if (!isArray(args.slots)) {
      if (isString(args.slots)) {
        args.slots = args.slots.split(/,/);
      } else {
        warn("slots", "Not a list of slots:", args.slots);
      }
    }
    args.slots.forEach(s => {
      slots[s] = {
        key: s,
        contents: []
      };
      slots[s][args.key] = s;
    });
    // log("slots","Filled", slots);
    args.contents.forEach(item => {
      if (!has(item, args.key))
        return;
      if (has(slots, item[args.key])) {
        slots[item[args.key]].contents.push(item);
      }
    });
    for (const [n, s] of Object.entries(slots)) {
      // log("slots","Slot", s.key);
      s.contents = slotItems(s.contents);
      s.contents.forEach(item => item[args.key] = s.key);
      // log("slots","Slot", s.key, "items", s.contents);
    };

    // log("slots", "Final slots:", slots);
    let contents = Object.values(slots).flatMap(s => s.contents);

    //let blank = {};
    //blank[args.key] = '';
    const blank = {
      [args.key]: ''
    };
    for (let i = 0; i < args.extra; i++) {
      let add = cloneDeep(args.placeholder);
      add = interpolate(add, blank);
      contents = contents.concat(add);
    }
    if (args.even && contents.length % 2 != 0) {
      let add = cloneDeep(args.placeholder);
      add = interpolate(add, blank);
      contents = contents.concat(add);
    }
    // log("slots", contents);
    if (args['merge-bottom']) {
      contents = mergeBottom(contents);
    }
    return contents;
  }
}
