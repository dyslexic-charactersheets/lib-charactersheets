import { esc } from '../util';
import { fieldIdent, fieldRadioIdent, fieldInner } from './field';

function defaultFrameRender(args, reg) {
    var ident = args.control == 'radio' ? fieldRadioIdent(args.id, args.value) : fieldIdent(args.id);
    var label = args.label ? `<label${ident.for}>${esc(args.label, true)}</label>` : '';
    var legend = args.legend ? `<legend>${esc(args.legend, true)}</legend>`: '';

    return `${legend}${label}${fieldInner(args, reg)}`;
};

// export function registerFieldFrame(element, props) {
//     props = _.defaults(props, {
//         defaults: {},
//         render: args => ''
//     });
//     CharacterSheets.register('frame:'+element, props, false);
// };

// Register the faux-elements

export let field_frame_above = {
    name: 'frame:above',
    defaults: {
        label: false,
        legend: false,
    }, 
    render: defaultFrameRender,
}

export let field_frame_left = {
    name: 'frame:left',
    defaults: {
        label: false,
        legend: false,
    }, 
    render: defaultFrameRender
}

export let field_frame_right = {
    name: 'frame:right',
    defaults: {
        label: false,
        legend: false,
    },
    render: (args, reg) => {
        var ident = 'radio' ? fieldRadioIdent(args.id, args.value) : fieldIdent(args.id);
        var label = args.label ? `<label${ident.for}>${esc(args.label, true)}</label>` : '';
        var legend = args.legend ? `<legend>${esc(args.legend, true)}</legend>`: '';

        return `${fieldInner(args, reg)}${legend}${label}`;
    }
}

export let field_frame_h_label = {
    name: 'frame:h-label',
    defaults: {
        label: false,
    }, 
    render: (args, reg) => {
        var ident = fieldIdent(args.id);
        var label = args.label ? `<label class='field__h-label'${ident.for}>${esc(args.label, true)}</label>` : '';
        // WRONG! The h-label is supposed to go inside the box!
        return `${label}${fieldInner(args, reg)}`;
    }
}

export let field_frame_none = {
    name: 'frame:none',
    render: (args, reg) => {
        return fieldInner(args, reg);
    }
}

