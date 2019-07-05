export let level = {
    name: 'level',
    key: 'level', 
    defaults: {
        level: 1,
        narrow: true,
        marker: "Level",
        contents: [],
    },
    transform: (args) => {
        return [
            {
                type: "layout",
                layout: "level",
                contents: [
                    {
                        type: "g",
                        contents: [
                            {
                                type: "level-marker",
                                level: args.level,
                                marker: args.marker
                            }
                        ]
                    },
                    {
                        type: "g",
                        contents: args.contents
                    }
                ]
            }
        ];
    },
    render: (args, reg) => {
        return reg.render([
            {
                type: "layout",
                layout: "level",
                contents: [
                    {
                        type: "g",
                        contents: [
                            {
                                type: "level-marker",
                                level: args.level
                            }
                        ]
                    },
                    {
                        type: "g",
                        contents: args.contents
                    }
                ]
            }
        ]);
    }
}

export let level_marker = {
    name: 'level-marker',
    key: 'level', 
    defaults: {
        level: 1,
        marker: "Level",
    },
    render: args => {
        var level = (""+args.level).replace(/^\s*/, '').replace(/\s*$/, '');
        if (level == "") {
            return `<div class='level-marker'></div>`;
        }
        var marker = args.marker ? `<label>${args.marker}</label>` : '';
        return `<div class='level-marker'>${marker}<div class='level-marker__level'>${level}</div></div>`;
    }
}
