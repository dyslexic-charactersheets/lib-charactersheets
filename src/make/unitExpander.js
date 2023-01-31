'use strict';

const _ = require('lodash');

// This list of element names and key fields is duplicated from the data in src/lib/elements,
// because that's loaded into the library, and this is needed 
const expansion = {
    advancement: 'id',
    arrow: 'direction',
    article: 'id',
    blockquote: '',
    box: '',
    calc: 'output',
    'class-name': 'title',
    'class-icon': 'icon',
    'collate-pages': '',
    'color': 'color',
    cost: 'cost',
    document: 'title',
    each: '',
    embed: 'src',
    field: 'id',
    flag: 'flag',
    flags: 'flags',
    g: 'contents',
    h1: 'title',
    h2: 'title',
    h3: 'title',
    h4: 'title',
    h5: 'title',
    h6: 'title',
    hr: '',
    if: 'condition',
    icon: 'icon',
    item: 'item',
    indent: 'layout',
    label: 'label',
    'large-print': 'large-print',
    layout: 'layout',
    level: 'level',
    'level-marker': 'level',
    list: '',
    lookup: 'lookup',
    log: 'message',
    join: 'join',
    logo: 'source',
    nothing: '',
    p: 'content',
    place: 'loc',
    ul: '',
    li: 'content',
    dl: 'defs',
    page: 'id',
    proficiency: 'proficiency',
    action: 'action',
    selectable: 'id',
    portrait: 'char',
    reduce: 'reduce',
    repeat: 'repeat',
    row: 'layout',
    ruby: 'ruby',
    'ruby-round-up': '',
    'ruby-round-down': '',
    section: 'title',
    sort: 'orderby',
    slots: 'slots',
    spacer: '',
    span: 'content',
    'spells-list': '',
    'spells-bundle': '',
    'spells-table': '',
    'spells-list2': '',
    switch: 'on',
    table: '',
    tail: '',
    copy: 'template',
    paste: 'template',
    unit: 'id',
    value: 'value',
    'var': 'varname',
    'value-block': 'value',
    vr: '',
    zone: 'zone',
};

function expandTopObject (object) {
    // console.log(`[expand] expandObject ${JSON.stringify(object)}`);
    var kv = _.toPairs(object);
    
    if (kv[0][0] == 'paste') {
      object = { 'paste': kv[0][1] };
      return expandValues(object, kv);
    }

    return expandObjectKV(kv);
}

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

    if (objtype == 'copy') {
        object = { 'copy': value };
        return expandValues(object, kv);
    }

    if (objtype == 'type') {
        var object = {type: value};
        return expandContinuation(object, kv);
    }

    if (_.has(expansion, objtype)) {
        var object = {type: objtype};

        var exp = expansion[objtype];
        // console.log("[expand]   exp", objtype, exp.expected);
        // console.log(`[expand]   ${exp.key} = ${value}`);
        if (exp != "" && !_.isUndefined(value)) {
            object[exp] = value;
        }
        // console.log(`[expand]   ${JSON.stringify(object)}`);
        return expandContinuation(object, kv);
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
    expandZone: expandTopObject
}
