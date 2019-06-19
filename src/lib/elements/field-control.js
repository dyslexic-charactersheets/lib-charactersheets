import { fieldIdent, fieldDefaults } from './field';
import { elementClass } from '../util';
// import { renderItem } from '../classes/Registry';

var defaultControlRender = args => {
    args = _.defaults(args, {
        align: "center",
        width: "medium",
        editable: true,
        overlay: false,
        underlay: false,
    });

    var ident = fieldIdent(args.id);
    var cls = elementClass("field", "control", args, [], { "align": "centre", "width": "medium" });
    var value = (args.value == '') ? '' : ` value='${args.value}'`;
    var attr = (args.editable ? '' : 'readonly');
    var input = `<input${ident.ident}${value}${attr}>`;
    
    var underlay = args.underlay ? `<u>${args.underlay}</u>`: '';

    var overlay = args.overlay ? `<span class='field__overlay'>${args.overlay}</span>` : '';

    return `<div${cls}>${input}${underlay}</div>${overlay}`;
};

var renderCompoundControl = args => {
    var parts = args.parts;

    var outputParts = parts.map(part => {
        if (_.isString(part)) 
            return part;

        if (_.has(part, "type") && part.type != "field")
            return renderItem(part);
        
        part = fieldDefaults(part);
        part.type = 'control:'+part.control;
        
        return renderItem(part);
    });

    // log("control", "Parts:", outputParts);
    return outputParts.join("");
};

// CharacterSheets.registerFieldControl = function (element, props) {
//     props = _.defaults(props, {
//         defaults: {},
//         render: args => '',
//     });
//     CharacterSheets.register('control:'+element, props, false);
// };

// Register the faux-elements

export let field_control_input = {
    name: 'control:input',
    defaults: {
        value: '',
        border: 'bottom',
    }, 
    render: defaultControlRender
}

export let field_control_speed = {
    name: 'control:speed',
    defaults: {
        units: "imperial",
        value: '',
        width: 'large',
    }, 
    render: args => {
        switch (args.units) {
            case "imperial":
                var ftIdent = fieldIdent(args.id, "ft");
                var sqIdent = fieldIdent(args.id, "sq");
            
                args.parts = [
                    {
                        type: "field",
                        id: ftIdent.id,
                        align: "right",
                        width: "small"
                    },
                    {
                        type: "label",
                        label: "ft"
                    },
                    {
                        type: "field",
                        id: sqIdent.id,
                        align: "right",
                        width: "tiny"
                    },
                    {
                        type: "label",
                        label: "sq"
                    },
                ];
                break;

            case "metric":
                var ftIdent = fieldIdent(args.id, "m");
                var sqIdent = fieldIdent(args.id, "sq");
            
                args.parts = [
                    {
                        type: "field",
                        id: ftIdent.id,
                        align: "right",
                        width: "small"
                    },
                    {
                        type: "label",
                        label: "m"
                    },
                    {
                        type: "field",
                        id: sqIdent.id,
                        align: "right",
                        width: "tiny"
                    },
                    {
                        type: "label",
                        label: "sq"
                    },
                ];
                break;
        }

        // log("field", "Speed field", args);
        return renderCompoundControl(args);
    }
}

export let field_control_weight = {
    name: 'control:weight',
    defaults: {
        schema: "starfinder",
    }, 
    render: args => {
        switch (args.schema) {
            case "starfinder":
                var bulkIdent = fieldIdent(args.id, "bulk");
                var lightIdent = fieldIdent(args.id, "light");
            
                args.parts = [
                    {
                        type: "field",
                        id: bulkIdent.id,
                        align: "right"
                    },
                    {
                        type: "label",
                        label: "B",
                    },
                    {
                        type: "field",
                        id: lightIdent.id,
                        align: "right",
                        width: "tiny"
                    },
                    {
                        type: "label",
                        label: "L",
                    }
                ];
                break;
        }

        return renderCompoundControl(args);
    }
}

export let field_control_radio = {
    name: 'control:radio',
    defaults: {
        checked: false,
        border: 'none',
    }, 
    render: args => {
        var ident = fieldRadioIdent(args.id, args.value);
        var cls = elementClass("field", "control", args, [], [ "control" ]);
        return `<div${cls}><input type='radio'${ident.ident}><label${ident.for}></label></div>`;
    }
}

export let field_control_checkbox = {
    name: 'control:checkbox',
    defaults: {
        checked: false,
        border: 'none',
    }, 
    render: args => {
        var ident = fieldIdent(args.id);
        var cls = elementClass("field", "control", args, [], [ "control" ]);
        return `<div${cls}><input type='checkbox'${ident.ident}><label${ident.for}></label></div>`;
    }
}

export let field_control_boost = {
    name: 'control:boost',
    defaults: {
        checked: false,
        up: true,
        down: true,
        border: 'none',
    },
    render: args => {
        
        var up = '';
        if (args.up) {
            var upident = fieldIdent(args.id, "up");
            up = `<div class='field__control field__control--boost_up'><input type='checkbox' ${upident.ident}><label ${upident.for}></label></div>`
        }
        var down = '';
        if (args.down) {
            var downident = fieldIdent(args.id, "down");
            down = `<div class='field__control field__control--boost_down'><input type='checkbox' ${downident.ident}><label ${downident.for}></label></div>`
        }

        return `${down}${up}`;
    }
}

export let field_control_checkgrid = {
    name: 'control:checkgrid',
    defaults: {
        checked: false,
        border: 'none',
        max: 10,
        group: 10,
        direction: "horizontal",
        depth: 3,
        value: 0
    },
    render: args => {
        var g = args.group;
        if (args.max < args.group) g = args.max;
        var grouplen = Math.ceil(parseFloat(g) / parseFloat(args.depth));
        if (args.direction == "horizontal") {
            args.dir = "h";
            args.w = grouplen;
            args.h = args.depth;
        } else {
            args.dir = "v";
            args.h = grouplen;
            args.w = args.width;
        }

        var checks = [];
        for (var i = 1; i <= args.max; i++) {
            var ident = fieldIdent(args.id, i);
            var checked = (i <= args.value) ? ' checked' : '';
            var cls = elementClass("field", "control", args, [], [ "control" ]);
            var check = `<div${cls}><input type='checkbox'${ident.ident}${checked}><label${ident.for}></label></div>`;
            checks.push(check);
        }

        var groups = _.chunk(checks, args.group).map(ch => {
            var grouplen = Math.ceil(parseFloat(ch.length) / parseFloat(args.depth));
            var a = { dir: args.dir, w: args.w, h: args.h };
            a[args.direction == 'horizontal' ? 'w' : 'h'] = grouplen;
            // if (args.direction == "horizontal") {
            //     a.w = grouplen;
            // } else {
            //     a.h = grouplen;
            // }
            var cls = elementClass("field", "control-group", a, [], [ "dir", "w", "h" ]);
            return `<div${cls}>${ch.join("")}</div>`
        });

        // var groups = [];
        // for (var i = 0; i < args.max; i += args.group) {
        //     var n = args.max - i;
        //     if (n > args.group) n = group;
        //     args.w = Math.ceil(parseFloat(g) / parseFloat(args.depth));

        //     var checks = [];
        //     for (var j = 1; j <= n; j++) {
        //         var ident = fieldIdent(args.id, i+j);
        //         var checked = (i <= args.value) ? ' checked' : '';
        //         var cls = elementClass("field", "control", args, [], [ "control" ]);
        //         var check = `<div${cls}><input type='checkbox'${ident.ident}${checked}><label${ident.for}></label></div>`;
        //         checks.push(check);
        //     }

        //     var cls = elementClass("field", "control-group", args, [], [ "dir", "w", "h" ]);
        //     var group = `<div${cls}>${checks.join("")}</div>`;
        //     groups.push(group);
        // }

        return groups.join("");
    }
}

export let field_control_alignment = {
    name: 'control:alignment',
    defaults: {
        value: '',
        border: 'none',
    }, 
    render: args => {
        var radios = [ "lg", "ll", "le", "ng", "nn", "ne", "cg", "cn", "ce" ].map(al => {
            var radioIdent = fieldRadioIdent(args.id, args.value);
            return `<div class='field__control field__control-${al}'><input type='radio'${radioIdent.ident}></div>`;
        });

        return `
            <i class='field__grid'></i>
            <i class='icon icon_good'></i>
            <i class='icon icon_evil'></i>
            <i class='icon icon_lawful'></i>
            <i class='icon icon_chaotic'></i>

            <label class='field__good'>Good</label>
            <label class='field__evil'>Evil</label>
            <label class='field__lawful'>Lawful</label>
            <label class='field__chaotic'>Chaotic</label>

            ${radios.join("")}
        `;
    }
}

export let field_control_icon = {
    name: 'control:icon',
    defaults: {
        value: '',
        border: 'none',
        icon: '',
    },
    render: args => {
        var cls = elementClass("field", "control", args, [], [ "control" ]);
        var iconcls = elementClass("icon", null, { icon: args.icon }, [], [ "icon" ]);
        return `<div${cls}><i${iconcls}></i></div>`;
    }
}

export let field_control_proficiency = {
    name: 'control:proficiency',
    defaults: {
        value: 0,
        icon: true,
    },
    render: args => {
        switch (args.value) {
            case 'untrained': args.value = 0; break;
            case 'trained': args.value = 1; break;
            case 'expert': args.value = 2; break;
            case 'master': args.value = 3; break;
            case 'legendary': args.value = 4; break;
            default: args.value = 0;
        }

        args.parts = [
            {
                type: "field",
                control: "proficiency-icon",
                value: args.value,
                id: args.id
            },
            {
                control: "input",
                id: args.id+"-bonus"
            }
        ];

        return renderCompoundControl(args);
    }
}

export let field_control_proficiency_icon = {
    name: 'control:proficiency-icon',
    render: args => {
        var cls = elementClass("field", "control", { control: "icon" }, [], { "control": "input" });

        // TODO checkboxes? radio buttons?
        return `
            <div${cls}>
            <input type='checkbox'${fieldIdent(args.id, "trained").ident} class='field--proficiency__trained'${args.value > 0 ? ' checked="checked"' : ''}>
            <input type='checkbox'${fieldIdent(args.id, "expert").ident} class='field--proficiency__expert'${args.value > 1 ? ' checked="checked"' : ''}>
            <input type='checkbox'${fieldIdent(args.id, "master").ident} class='field--proficiency__master'${args.value > 2 ? ' checked="checked"' : ''}>
            <input type='checkbox'${fieldIdent(args.id, "legendary").ident} class='field--proficiency__legendary'${args.value > 3 ? ' checked="checked"' : ''}>
            <i class='icon field--proficiency__icon'></i>
            </div>`;
    }
}

export let field_control_money = {
    name: 'control:money',
    defaults: {
        indent: 0,
        digits: 3,
        shift: 0,
        decimal: 0,
        denomination: "copper",
        value: '',
    }, 
    render: args => {
        var unit = '';
        switch(args.denomination) {
            case 'gold': unit = 'gp'; break;
            case 'silver': unit = 'sp'; break;
            case 'copper': unit = 'cp'; break;
        }
        var overlay = `<span class='field__overlay'>${unit}</span>`;

        var ident = fieldIdent(args.id);
        var cls = elementClass("field", "control", args, [], { "digits": 0, "shift": 0, "decimal": 0 });
        var value = (args.value == '') ? '' : ` value='${args.value}'`;

        var ticks = [];
        for (var i = 1; i < args.digits; i++) {
            var decimal = (i == args.decimal) ? ' field__tick--decimal' : '';
            ticks.push(`<label class='field__tick field__tick-${i}${decimal}'></label>`);
        }

        return `<div${cls}><input${ident.ident}${value} size='${args.digits}'>${ticks.join("")}</div>${overlay}`;
    }
}

export let field_control_compound = {
    name: 'control:compound',
    defaults: {
        parts: [],
    }, 
    render: renderCompoundControl
}

export let field_control_progression = {
    name: 'control:progression',
    defaults: {
        parts: [],
        border: "none",
    }, 
    render: args => {
        args.parts = _.flatMap(args.parts, part => [ part, '<label class="field__separator"></label>' ]);
        args.parts.pop();
        return renderCompoundControl(args);
    }
}
