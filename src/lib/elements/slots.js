import * as _ from 'lodash';

import { elementID, elementClass } from '../util';
import { log } from '../log';

export let slots = {
    name: 'slots',
    key: 'slots', 
    defaults: {
        slots: [],
        key: 'level',
        placeholder: null,
        max: false,
        min: false,
        contents: [],
    }, 
    transform: (args, ctx) => {
        // log("slots", "Slots:", args.slots);

        var placeholder = args.placeholder;
        if (!Array.isArray(placeholder))
            placeholder = [ placeholder ];
        
        function slotItems(items) {
            // log("slots", "Items", items);
            if (args.min && items.length < args.min) {
                var n = args.min - items.length;
                for (var i = 0; i < n; i++) {
                    // log("slots","Placeholder", args.placeholder);
                    items = items.concat(_.cloneDeep(args.placeholder));
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
        args.slots.forEach(s => {
            slots[s] = {
                key: s,
                contents: []
            };
            slots[s][args.key] = s;
        });
        // log("slots","Filled", slots);
        args.contents.forEach(item => {
            if (!item.hasOwnProperty(args.key))
                return;
            if (slots.hasOwnProperty(item[args.key])) {
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

        // log("slots", contents);
        return contents;
    }
}