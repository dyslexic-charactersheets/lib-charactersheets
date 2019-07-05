import * as _ from 'lodash';

import { log, error } from './log';

var contextStack = [];

var regex = new RegExp('^(.*?)_(.*)$', '');

export function applyContext(item) {
    if (Array.isArray(item)) {
        return item.map(applyContext);
    }

    var contentsKey = "contents";
    // log("context", "Item", item);
    // log("context", "has type:", (item.hasOwnProperty("type") ? "yes" : "no"));

    // apply context
    if (item.hasOwnProperty("type")) {
        var type = item.type;
        var context = {}
        for (var i = contextStack.length - 1; i >= 0; i--) {
            if (contextStack[i].hasOwnProperty(type)) {
                context = _.defaults(context, contextStack[i][type]);
            }
        }
        // log("context", "Applying context to", type, context);
        item = _.defaults(item, context);

        switch (type) {
            case 'table': contentsKey = 'template'; break;
            case 'calc': contentsKey = 'inputs'; break;
            case 'field': contentsKey = 'parts'; break;
        }
    }

    // log("context", "has", contentsKey+":", (item.hasOwnProperty(contentsKey) ? "yes" : "no"));

    if (item.hasOwnProperty(contentsKey)) {
        // extract context
        var contextArgs = {};
        Object.entries(item).forEach(pair => {
            // log("context", "Checking arg", pair[0]);
            var match = pair[0].match(regex);
            if (match) {
                // log("context", "Found a context arg:", pair[0]);
                var type = match[1];
                var key = match[2];
                if (!contextArgs.hasOwnProperty(type)) contextArgs[type] = {};
                contextArgs[type][key] = pair[1];
                delete item[pair[0]];
            }
        });
        // log("context", "Pushing context", contextArgs);

        // recurse
        contextStack.push(contextArgs);
        item[contentsKey] = item[contentsKey].map(applyContext);
        contextStack.pop();
    }

    return item;
}