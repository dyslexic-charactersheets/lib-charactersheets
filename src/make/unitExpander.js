'use strict';

const _ = require('lodash');

// This list of element names and key fields is duplicated from the data in src/lib/elements,
// because that's loaded into the library, and this is needed 
var expansion = {
    advancement: 'id',
    article: 'id',
    blockquote: '',
    calc: '',
    'class-name': 'title',
    'class-icon': 'icon',
    document: 'title',
    each: '',
    field: 'id',
    g: 'contents',
    h1: 'title',
    h2: 'title',
    h3: 'title',
    h4: 'title',
    h5: 'title',
    h6: 'title',
    hr: '',
    icon: 'icon',
    label: 'label',
    layout: 'layout',
    level: 'level',
    'level-marker': 'level',
    list: '',
    log: 'message',
    join: 'join',
    logo: 'source',
    nothing: '',
    p: 'content',
    ul: '',
    li: 'content',
    dl: '',
    page: 'id',
    proficiency: 'proficiency',
    action: 'action',
    selectable: 'selectable',
    portrait: 'char',
    repeat: 'repeat',
    row: 'layout',
    section: 'title',
    slots: 'slots',
    spacer: '',
    span: 'content',
    'spells-list': '',
    'spells-table': '',
    'spells-list2': '',
    table: '',
    tail: '',
    define: 'template',
    paste: 'template',
    unit: 'id',
    vr: '',
    zone: 'zone',
};

// populate from the registry
/*
_.each(CharacterSheets.getRegistry(), (reg, element) => {
    // var expected = _.keys(reg.defaults);
    // if (reg.key != "") expected.unshift(reg.key);
    // expected.unshift("level");
    expansion[element] = {
        key: reg.key,
        expected: reg.expect //expected
    };
});
*/
// console.log("[expand] Registry", expansion);


function expandObject (object) {
    // console.log(`[expand] expandObject ${JSON.stringify(object)}`);
    var kv = _.toPairs(object);
    return expandObjectKV(kv);
}

function expandObjectKV(kv) {
    if (kv.length == 0)
        return {};

    var pair = kv.shift();
    // console.log('[expand] expandObjectKV', pair);
    var objtype = pair[0];
    var value = pair[1];

    if (objtype == 'at') {
        object = { 'at': value };
        return expandValues(object, kv);
    }

    if (objtype == 'type') {
        var object = {type: value};
        return expandContinuation(object, kv);
    }

    if (_.has(expansion, objtype)) {
        var object = {type: objtype};

        // if (_.isArray(value)) {
        //     object.contents = _.map(value, expandValue);
        //     return expandContinuation(object, kv);
        // } else {
            var exp = expansion[objtype];
            // console.log("[expand]   exp", objtype, exp.expected);
            // console.log(`[expand]   ${exp.key} = ${value}`);
            if (exp != "" && !_.isUndefined(value)) {
                object[exp] = value;
            }
            // console.log(`[expand]   ${JSON.stringify(object)}`);
            return expandContinuation(object, kv);
        // }
    }

    var object = {};
    object[objtype] = expandValue(value);
    return expandValues(object, kv);
}

function expandContinuation(object, kv) {
    if (kv.length == 0) {
        // console.log(`[expand]   kv ${object.type} final:`, object);
        return object;
    }

    var pair = kv.shift();
    var key = pair[0];
    var value = pair[1];
    // console.log(`[expand] expandContinuation ${object.type}: ${key} =`, value);

    if (key == 'contents') {
        object.contents = _.map(value, expandValue);
        // console.log(`[expand]   kv ${object.type} contents:`, object.contents);
        return expandContinuation(object, kv);
    }
    
    // if (_.has(expansion, object.type)) {
    //     var exp = expansion[object.type];
    //     // console.log("[expand]   kv exp", object.type, exp.expected);
    //     if (key != exp /*&& exp.expected.indexOf(key) == -1*/ && _.has(expansion, key)) {
    //         kv.unshift(pair);
    //         var content = expandObjectKV(kv);
    //         object.contents = [ content ];
    //         return object;
    //     }
    // }
    
    object[key] = expandValue(value);
    return expandContinuation(object, kv);
}

function expandValues(object, kv) {
    if (kv.length == 0)
        return object;

    var pair = kv.shift();
    var key = pair[0];
    var value = pair[1];
    
    // console.log(`[expand] expandValues ${object.type}: ${key} =`, value);

    object[key] = expandValue(value);
    return expandValues(object, kv);
}

function expandValue(value) {
    // console.log(`[expand] expandValue ${value}`);
    if (_.isArray(value)) {
        return _.map(value, expandValue);
    } else if (_.isPlainObject(value)) {
        return expandObject(value);
    } else {
        return value;
    }
}



// TEST

module.exports = {
    expandZone: expandObject
}
