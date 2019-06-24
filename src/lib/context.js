import * as _ from 'lodash';

import { log, error } from './log';

var contextStack = [];

var regex = new RegExp('^(.*?)_(.*)$', '');

export function applyContext(item) {
    if (_.isArray(item)) {
        return _.map(item, applyContext);
    }

    var contentsKey = "contents";
    // log("context", "Item", item);
    // log("context", "has type:", (_.has(item, "type") ? "yes" : "no"));

    // apply context
    if (_.has(item, "type")) {
        var type = item.type;
        var context = {}
        for (var i = contextStack.length - 1; i >= 0; i--) {
            if (_.has(contextStack[i], type)) {
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

    // log("context", "has", contentsKey+":", (_.has(item, contentsKey) ? "yes" : "no"));

    if (_.has(item, contentsKey)) {
        // extract context
        var contextArgs = {};
        Object.entries(item).forEach(pair => {
            // log("context", "Checking arg", pair[0]);
            var match = pair[0].match(regex);
            if (match) {
                // log("context", "Found a context arg:", pair[0]);
                var type = match[1];
                var key = match[2];
                if (!_.has(contextArgs, type)) contextArgs[type] = {};
                contextArgs[type][key] = pair[1];
                delete item[pair[0]];
            }
        });
        // log("context", "Pushing context", contextArgs);

        // recurse
        contextStack.push(contextArgs);
        item[contentsKey] = _.map(item[contentsKey], applyContext);
        contextStack.pop();
    }

    return item;
}