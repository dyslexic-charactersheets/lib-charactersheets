'use strict';

import { log } from '../log';

CharacterSheets._registry = {};

CharacterSheets.register = function (element, props) {
    props = _.defaults(props, {
        key: '',
        defaults: {},
        expect: [],
        render: args => '',
        transform: false,
    });
    props.expect = _.uniq(_.keys(props.defaults).concat(props.expect));
    props.expect.unshift("level");

    CharacterSheets._registry[element] = props;
};

// CharacterSheets.register = function (element, key, defaults, render = args => '', transform = false) {
//     CharacterSheets._registry[element] = { element: element, defaults: defaults, key: key, render: render, transform: transform };
// };

global.render = function(items) {
    // log("registry", "Render", items);
    var rendered = _.map(items, item => renderItem(item));
    return rendered.join("");
};

CharacterSheets.getRegistry = function() {
    return CharacterSheets._registry;
}

var stack = [];

function mergeBottom(element) {
    if (_.isArray(element)) {
        element[element.length - 1] = mergeBottom(element[element.length - 1]);
    }

    else if (_.isObject(element)) {
        switch (element.type) {
            // horizontal elements don't 
            case 'calc':
            case 'row':
                break;

            case 'field':
                element['merge-bottom'] = true;
                break;

            case 'list':
            default:
                element.contents = mergeBottom(element.contents);
        }
    }

    return element;
};

global.renderItem = function(item) {
    if (_.isNull(item)) return '';
    item = _.defaults(item, {
        id: null,
        exists: true,
    });

    if (!item.exists || item.exists === "false")
        return '';

    if (item.type == "unit")
        item.type = item["unit-type"];

    // log("registry", `renderItem ${item.type}`);
    if (_.has(CharacterSheets._registry, item.type)) {
        var reg = CharacterSheets._registry[item.type];
    
        // registered defaults
        if (_.has(reg, "defaults"))
            item = _.defaults(item, reg.defaults);

        if (item['merge-bottom']) {
            item = mergeBottom(item);
            // if (item.type == 'list' && !!item.zebra) log("registry", "Merged bottom:", JSON.stringify(item, null, 2));
        }
        
        stack.push(item.type + ((item.id == null) ? '' : ":"+item.id) + ((item.title == null) ? '' : ':'+item.title));
        var output = reg.render(item);
        stack.pop();
        return output;
    } else {
        if (item.type == 'zone')
            warn("registry", "Unsatisfied zone", item.zone);
        else
            warn("registry", "Unknown element type:", item.type, "at:", stack, item);
        return '';
    }
};

global.registryDump = function () {
    
}
