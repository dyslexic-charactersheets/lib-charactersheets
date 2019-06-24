import * as _ from 'lodash';

import { elementID, elementClass, getLabelHeight } from '../util';
// import { render, renderItem } from '../classes/Registry';

export let field = {
    name: 'field',
    key: 'id', 
    defaults: {
        frame: 'above',
        control: 'input',
        repeat: 1,
        editable: true,
        'merge-bottom': false,
        label: false,
    },
    expect: [ 'icon' ],
    render: (args, reg) => {
        args = fieldDefaults(args, reg);

        var id = elementID('field', args.id);
        var cls = elementClass('field', null, args, 
            [ "icon", "ref", "misc", "temp" ],
            { "frame": "normal", "width": "medium", "align": "centre", "size": "medium", "control": "input", "shift": 0, "lp": 0 });

        var frameArgs = _.defaults({ type: 'frame:'+args.frame }, args);
        var frame = reg.renderItem(frameArgs);
        return `<div${id}${cls}>${frame}</div>`;
    }
}


// field defaults are a combination of the defaults from the field's frame and control
export function fieldDefaults(args, reg) {
    args = _.defaults(args, {
        frame: 'above',
        control: 'input'
    });
    
    var frame = reg.get('frame:'+args.frame);
    if (!frame) {
        args.frame = 'above';
        frame = reg.get('frame:above');
    }

    var control = reg.get('control:'+args.control);
    if (!control) {
        args.control = 'input';
        control = reg.get('control:input');
    }

    // if (!_.has(CharacterSheets._registry, 'frame:'+args.frame)) {
    //     error('field', 'Field frame not registered:', args.frame);
    //     args.frame = 'above';
    // }
    // if (!_.has(CharacterSheets._registry, 'control:'+args.control)) {
    //     error('field', 'Field control not registered:', args.control);
    //     args.control = 'input';
    // }
    // 
    // var frame = CharacterSheets._registry['frame:'+args.frame];
    // var control = CharacterSheets._registry['control:'+args.control];

    args = _.defaults(args, frame.defaults, control.defaults, {
        border: (args.output ? 'full' : 'bottom'),
        align: (args.width == "stretch" ? "left" : "centre"),
        width: "medium",
        icon: false,
    });

    args.lp = getLabelHeight(args);
    return args;
};

export function fieldIdent(fieldid = '', partid = '') {
    if (fieldid == '' || _.isNull(fieldid)) {
        return { id: '', name: '', for: '', ident: '' };
    }

    if (partid == '') {
        var ident = ` id='${fieldid}' name='${fieldid}'`;
        var forid = ` for='${fieldid}'`;
        return { id: fieldid, name: fieldid, for: forid, ident: ident };
    }

    var eid = fieldid+"--"+partid;
    var name = fieldid+'['+partid+']';
    var ident = ` id='${eid}' name='${name}'`;
    var forid = ` for='${eid}'`;
    return { id: eid, name: name, for: forid, ident: ident };
};

export function fieldRadioIdent(fieldid = '', value = '') {
    if (fieldid == '') {
        return { id: '', name: '', for: '', ident: '' };
    }

    if (value == '') {
        return fieldIdent(fieldid);
    }

    var id = fieldid+'--'+value;
    var ident = ` id='${id}' name='${fieldid}'`;
    var forid = ` for='${id}'`;
    return { id: id, name: fieldid, for: forid, ident: ident };
};

export function fieldInner(args, reg) {
    args = _.defaults({ type: 'control:'+args.control }, args);
    var control = reg.renderItem(args);
    var icon = (_.has(args, "icon") && !!args.icon && _.isString(args.icon) && args.control != "icon") ? `<i class='icon icon_${args.icon}'></i>` : '';
    var unit = (_.has(args, "unit") && !!args.unit) ? `<label class='field__unit'>${args.unit}</label>` : '';

    var boxargs = _.pick(args, [ 'icon', 'border' ]);
    var inner;
    if (args.repeat > 1) {
        var boxes = [];
        for (var i = 1; i <= args.repeat; i++) {
            if (i == args.repeat && args['merge-bottom'])
                boxargs['border'] = 'none';
            var boxcls = elementClass('field', 'box', boxargs, [ "icon" ], { "border": "bottom" });
            var box = `<div${boxcls}>${icon}${control}${unit}</div>`;
            boxes.push(box);
        }
        inner = boxes.join("");
    } else {
        if (args['merge-bottom'])
            boxargs['border'] = 'none';
        var boxcls = elementClass('field', 'box', boxargs, [ "icon" ], { "border": "bottom" });
        inner = `<div${boxcls}>${icon}${control}${unit}</div>`;
    }
    var framecls = elementClass('field', 'frame', args, [ "merge-bottom" ], { });
    return `<div${framecls}>${inner}</div>`;
};
