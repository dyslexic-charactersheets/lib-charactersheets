import * as _ from 'lodash';
import { log } from './log';

function addAtZone(zones, zone_id, elements, replace) {
    if (zone_id.charAt(0) != '@') {
        err("compose", "Not a zone ID:", zone_id);
        return;
    }
    log("compose", "Adding to zone:", zone_id);
    if (!_.has(zones, zone_id))
        zones[zone_id] = [];
    elements.forEach(element => {
        if (replace)
            element.replace = true;
        zones[zone_id].push(element);
    });
    // log("compose", "Zone", zone_id, "contents:", zones[zone_id]);
}

function defineTemplate(templates, template_id, defaults, elements) {
    log("compose", "Defining template:", template_id, defaults);
    templates[template_id] = {
        defaults: defaults,
        elements: elements
    };
}

function composeDocument(doc, zones, templates, registry) {
    log("compose", "Compose document");
    // log("compose", " - Doc:", doc);
    // log("compose", " - Zones:", zones);
    // log("compose", " - Templates:", templates);
    // log("compose", " - Registry", registry);
    
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

    function compose(element) {
        // log("compose", "Item", element);

        if (!_.has(element, "type"))
            return [ element ];

        // first recurse so we have the ingredients
        _.each(["contents", "placeholder", "header", "inputs"], item_key => {
            // log("compose", "Checking for", item_key);
            if (_.has(element, item_key)) {
                // log("compose", "Preparing item", item_key, element[item_key]);
                if (_.isArray(element[item_key]))
                    element[item_key] = _.flatMap(element[item_key], compose);
                else
                    element[item_key] = compose(element[item_key]);
            }
        });

        // transform the element
        var reg = registry.get(element.type);
        // log("compose", "Registry entry for", element.type, reg);
        
        if (reg && reg.transform) {
            // log("compose", "Applying transformation to", element.type);
            var newelements = reg.transform(_.defaults(element, reg.defaults), { zones: zones, templates: templates });
            if (newelements === false)
                return element;

            newelements = _.flatMap(newelements, compose);
            return newelements;
        }

        // if (element.type == "article") log("compose", "Composed element:", element);
        // if (_.has(element, 'merge-bottom') && !!element['merge-bottom']) {
        //     // log("compose", "Merge bottom:", element);
        //     element = mergeBottom(element);
        //     if (element.type == 'article') log("compose", "Result:", element);
        // }

        return [ element ];
    }
    
    var c = compose(doc);
    return c[0];
}

export function zoneCompose(baseDocument) {
    var doc = _.cloneDeep(baseDocument);
    // log("compose", "Base document", doc);
    var zones = {};
    var templates = {};
    
    return {
        addAt: (zone_id, elements) => {addAtZone(zones, zone_id, elements, false)},
        replaceAt: (zone_id, elements) => {addAtZone(zones, zone_id, elements, true)},
        defineTemplate: (template_id, defaults, elements) => {defineTemplate(templates, template_id, defaults, elements)},
        composeDocument: (registry) => composeDocument(doc, zones, templates, registry)
    };
}