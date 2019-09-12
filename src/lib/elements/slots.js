import * as _ from 'lodash';

import { has, isArray, isString, cloneDeep, interpolate } from '../util';
import { log, warn } from '../log';

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
    transform: (args, ctx) => {
        // log("slots", "Slots:", args.slots);

        var placeholder = args.placeholder;
        if (!isArray(placeholder))
            placeholder = [ placeholder ];

        if (ctx.largePrint && args.reduce > 0) {
          args.min -= args.reduce;
          args.max -= args.reduce;
        }
        
        function slotItems(items) {
            // log("slots", "Items", items);
            if (args.min && items.length < args.min) {
                var n = args.min - items.length;
                for (var i = 0; i < n; i++) {
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
            return slotItems(args.contents);
        }

        var slots = {};
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
        var contents = Object.values(slots).flatMap(s => s.contents);

        var blank = {};
        blank[args.key] = '';
        for (var i = 0; i < args.extra; i++) {
          var add = cloneDeep(args.placeholder);
          add = interpolate(add, blank);
          contents = contents.concat(add);
        }
        if (args.even && contents.length % 2 != 0) {
          var add = cloneDeep(args.placeholder);
          add = interpolate(add, blank);
          contents = contents.concat(add);
        }
        // log("slots", contents);
        return contents;
    }
}
