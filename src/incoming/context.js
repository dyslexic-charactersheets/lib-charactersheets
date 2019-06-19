'use strict';

var contextStack = [];

var regex = new RegExp('^(.*?)_(.*)$', '');

function applyContext(item) {
    if (_.isArray(item)) {
        return _.map(item, applyContext);
    }

    var contentsKey = "contents";
    // console.log("[context] Item", item);
    // console.log("[context] has type", (_.has(item, "type") ? "yes" : "no"));

    // apply context
    if (_.has(item, "type")) {
        var type = item.type;
        var context = {}
        for (var i = contextStack.length - 1; i >= 0; i--) {
            if (_.has(contextStack[i], type)) {
                context = _.defaults(context, contextStack[i][type]);
            }
        }
        // console.log("[context] Applying context to", type, context);
        item = _.defaults(item, context);

        switch (type) {
            case 'table': contentsKey = 'template'; break;
            case 'calc': contentsKey = 'inputs'; break;
            case 'field': contentsKey = 'parts'; break;
        }
    }

    // console.log("[context] has", contentsKey, (_.has(item, "contents") ? "yes" : "no"));

    if (_.has(item, contentsKey)) {
        // extract context
        var contextArgs = {};
        _(item).toPairs().each(pair => {
            // console.log("[context] Checking arg", pair[0]);
            var match = pair[0].match(regex);
            if (match) {
                // console.log("[context] Found a context arg:", pair[0]);
                var type = match[1];
                var key = match[2];
                if (!_.has(contextArgs, type)) contextArgs[type] = {};
                contextArgs[type][key] = pair[1];
                delete item[pair[0]];
            }
        });
        // console.log("[context] Pushing context", contextArgs);

        // recurse
        contextStack.push(contextArgs);
        item[contentsKey] = _.map(item[contentsKey], applyContext);
        contextStack.pop();
    }

    return item;
}

CharacterSheets.applyContext = function (document) {
    // console.log("[context] Doc", document);
    return applyContext(document);
}