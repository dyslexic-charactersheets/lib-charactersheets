export let spells_list2 = {
    name: 'spells-list2',
    defaults: {
        min: 1,
        max: 9,
        cantrips: 4,
        spells: 4,
        daily: false,
        special: false,
    }, 
    transform: args => {
        var min = args.min;
        if (min < 0) min = 0;
        var max = args.max;
        if (max > 9) max = 9;

        
        // number of spells at each level
        // var slots = {};
        // if (isArray(args.spells)) {
        //     var i = 0;
        //     for (var lvl = min; lvl <= max; lvl++) {
        //         slots[lvl] = args.spells[i];
        //     }
        // } else {
        //     for (var lvl = min; lvl <= max; lvl++) {
        //         slots[lvl] = args.spells;
        //     }
        // }
        
        var spell_levels = [];
        for (var lvl = min; lvl <= max; lvl++) {
        }

        spell_levels.push({
            type: "layout",
            layout: "2l",
            contents: [
                {
                    type: "level",
                    level: 2,
                    marker: "Spell\nLevel",
                    contents: [
                        {
                            type: "row",
                            contents: [
                                {
                                    type: "field",
                                    label: "Spells\nper day",
                                    frame: "none",
                                },
                                {
                                    type: "field",
                                    label: "Spells\ntoday",
                                    frame: "none",
                                    control: "checkgrid",
                                    max: 4,
                                    depth: 2,
                                },
                                {
                                    type: "spacer"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "field",
                    width: "stretch",
                    repeat: args.spells,
                    'merge-bottom': true,
                    frame: 'none',
                }

            ]
        })

        return [{
            type: "list",
            hr: true,
            zebra: true,
            'avoid-shade': true,
            contents: spell_levels,
        }];
    }
}
