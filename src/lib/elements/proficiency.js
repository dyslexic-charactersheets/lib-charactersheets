export let proficiency = {
    name: 'proficiency',
    key: 'proficiency', 
    defaults: {
        proficiency: "untrained",
        content: "",
    },
    transform: args => {
        if (args.proficiency === null) args.proficiency = "untrained";
        var icon = (args.proficiency == "untrained") ? "proficiency" : "proficiency-"+args.proficiency;
        return [
            {
                type: "layout",
                layout: "level",
                contents: [
                    {
                        type: "icon",
                        icon: icon
                    },
                    {
                        type: "p",
                        content: args.content
                    }
                ]
            }
        ]
    }
}

export let action = {
    name: 'action',
    key: 'action', 
    defaults: {
        action: 1,
        contents: [],
    }, 
    transform: args => {
        var icon = 'action';
        switch(args.action) {
            case 1: icon = 'action'; break;
            case 2: icon = 'action2'; break;
            case 3: icon = 'action3'; break;
            case 13: icon = 'action13'; break;
            case '2nd': icon = 'action2nd'; break;
            case '3rd': icon = 'action3rd'; break;
            case 'reaction': icon = 'reaction'; break;
            case 'free': icon = 'free-action'; break;
            case 'template': icon = 'action-template'; break;
        }

        return [
            {
                type: "layout",
                layout: "level",
                contents: [
                    {
                        type: "icon",
                        icon: icon
                    },
                    {
                        type: "g",
                        contents: args.contents
                    }
                ]
            }
        ];
    }
}
