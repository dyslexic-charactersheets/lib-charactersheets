import * as _ from 'lodash';
import { interpolate } from '../util';

function spellLevel(lvl, style, slots, special) {
    var level_marker = {
        type: "level-marker",
        level: lvl,
        marker: '',
    };

    // number of spells
    var fields = [];
    if (special) {
        special = interpolate(special, { 'level': lvl });
        if (Array.isArray(special)) fields = special;
        else fields.push(special);
    }

    var n = parseInt(2 * Math.ceil((slots + fields.length) / 2.0)) + fields.length;
    log("spells", "Adding up to", n, "spell fields");
    for (var i = fields.length; i < n; i++) {
        switch (style) {
            case 'prepared':
                fields.push({
                    type: "field",
                    id: `spells-level-${lvl}-${n}`,
                    frame: "none",
                    control: "compound",
                    parts: [
                        {
                            control: "checkbox",
                            id: `spells-level-${lvl}-${n}`
                        },
                        {
                            control: "input",
                            align: 'left',
                            width: 'stretch',
                        }
                    ]
                });
                break;

            case 'spontaneous':
                fields.push({
                    type: "field",
                    id: `spells-level-${lvl}-${n}`,
                    frame: "none",
                    align: "left",
                    width: "stretch"
                });
                break;
        }
    }

    var left = [];
    var right = [];
    for (var i = 0; i < fields.length; i++) {
        left.push(fields[i]);
        i++;
        right.push(fields[i]);
    }

    // full level
    return {
        type: "layout",
        layout: "spells-list",
        narrow: true,
        contents: [
            {
                type: "list",
                collapse: true,
                "merge-bottom": true,
                contents: left
            },
            level_marker,
            {
                type: "list",
                collapse: true,
                "merge-bottom": true,
                marker: '',
                contents: right
            }
        ]
    };
}

export let spells_list = {
    name: 'spells-list',
    key: 'style',
    defaults: {
        min: 1,
        max: 9,
        spells: 4,
        cantrips: false,
        daily: false,
        special: false,
        style: "prepared",
    }, 
    render: (args, reg) => {
        var min = args.min;
        var max = args.max;

        // number of spells at each level
        var slots = {};
        if (Array.isArray(args.spells)) {
            var i = 0;
            for (var lvl = min; lvl <= max; lvl++) {
                slots[lvl] = args.spells[i];
            }
        } else {
            for (var lvl = min; lvl <= max; lvl++) {
                slots[lvl] = args.spells;
            }
        }

        // objects to render
        var spell_levels = [];

        if (args.cantrips) {
            spell_levels.push(spellLevel(0, 'spontaneous', args.cantrips, false));
        }

        for (var lvl = min; lvl <= max; lvl++) {
            spell_levels.push(spellLevel(lvl, args.style, slots[lvl], args.special));
        }

        /*
        for (var lvl = min; lvl <= max; lvl++) {
            var level_marker = {
                type: "level-marker",
                level: lvl,
            };

            // number of spells
            var fields = [];
            if (args.special) {
                var special = interpolate(args.special, { 'level': lvl });
                if (Array.isArray(special)) fields = special;
                else fields.push(special);
            }

            var n = parseInt(2 * Math.ceil((slots[lvl] + fields.length) / 2.0)) + fields.length;
            // log("-","[spells] Adding up to", n, "spell fields");
            for (var i = fields.length; i < n; i++) {
                switch (args.style) {
                    case 'prepared':
                        fields.push({
                            type: "field",
                            id: `spells-level-${lvl}-${n}`,
                            frame: "none",
                            control: "compound",
                            parts: [
                                {
                                    control: "checkbox",
                                    id: `spells-level-${lvl}-${n}`
                                },
                                {
                                    control: "input",
                                    align: 'left',
                                    width: 'stretch',
                                }
                            ]
                        });
                        break;

                    case 'spontaneous':
                        fields.push({
                            type: "field",
                            id: `spells-level-${lvl}-${n}`,
                            frame: "none",
                            align: "left",
                            width: "stretch"
                        });
                        break;                        
                }
            }

            var left = [];
            var right = [];
            // var n = Math.ceil(slots[lvl] / 2.0);
            for (var i = 0; i < fields.length; i++) {
                left.push(fields[i]);
                i++;
                right.push(fields[i]);
            }

            // full level
            spell_levels.push({
                type: "layout",
                layout: "spells-list",
                narrow: true,
                contents: [
                    {
                        type: "list",
                        collapse: true,
                        "merge-bottom": true,
                        contents: left
                    },
                    level_marker,
                    {
                        type: "list",
                        collapse: true,
                        "merge-bottom": true,
                        marker: '',
                        contents: right
                    }
                ]
            });
        }
        */
        
        return reg.render([
            {
                type: "list",
                hr: true,
                zebra: true,
                'avoid-shade': true,
                contents: spell_levels
            }
        ]);
    }
}

export let spells_table = {
    name: 'spells-table',
    defaults:  {
        'max-level': 9,
        'spells-per-day': true,
        flip: false,
    },
    transform: args => {
        // log("-","[spells] Expanding spells table:", args);

        
        var rows = [];
        var columns = [];
        var template = [];

        // Rows
        for (var lvl = 1; lvl < args['max-level']; lvl++) {
            rows.push({ level: lvl });
        }

        // Spell Level
        columns.push("Spell\nLevel");
        template.push({
            type: "level-marker",
            level: "#{level}",
            marker: ""
        });

        // Spells per day
        if (args['spells-per-day']) {
            columns.push("Spells\nper day");
            template.push({
                type: "field",
                id: "spells-#{level}-per-day",
                frame: "none"
            });
        }

        var table = {
            type: "table",
            // flip: args.flip,
            rows: rows,
            columns: columns,
            template: template
        };
        table = _.defaults(table, args);
        // log("-","[spells] Expanded spells table:", table);
        return [ table ];
        
        /*
        return [
            {
                type: "row",
                narrow: true,
                contents: [
                    { type: 'g', contents: [
                        { type: "level-marker", level: 1, marker: "Spell Level" },
                        { type: "field", id: "spells-1-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 2, marker: "Spell Level" },
                        { type: "field", id: "spells-2-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 3, marker: "Spell Level" },
                        { type: "field", id: "spells-3-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 4, marker: "Spell Level" },
                        { type: "field", id: "spells-4-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 5, marker: "Spell Level" },
                        { type: "field", id: "spells-5-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 6, marker: "Spell Level" },
                        { type: "field", id: "spells-6-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 7, marker: "Spell Level" },
                        { type: "field", id: "spells-7-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 8, marker: "Spell Level" },
                        { type: "field", id: "spells-8-per-day", width: "small", frame: "none" },
                    ]},
                    { type: 'g', contents: [
                        { type: "level-marker", level: 9, marker: "Spell Level" },
                        { type: "field", id: "spells-9-per-day", width: "small", frame: "none" },
                    ]}
                ]
            }
        ];
        */
    }
}