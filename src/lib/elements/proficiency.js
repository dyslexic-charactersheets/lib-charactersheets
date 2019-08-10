export let proficiency = {
    name: 'proficiency',
    key: 'proficiency',
    defaults: {
        proficiency: "untrained",
        content: false,
        contents: []
    },
    transform: args => {
        if (args.proficiency === null) args.proficiency = "untrained";
        var icon = (args.proficiency == "untrained") ? "proficiency" : "proficiency-"+args.proficiency;

        var contents = args.content ? { type: "p", content: args.content } : { type: "g", contents: args.contents };
        return [
            {
                type: "layout",
                layout: "level",
                contents: [
                    {
                        type: "icon",
                        icon: icon
                    },
                    contents
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

export let selectable = {
  name: 'selectable',
  key: 'id',
  defaults: {
    id: '',
    contents: []
  },
  transform: args => {
    return [
        {
            type: "layout",
            layout: "level",
            contents: [
                {
                    type: "g",
                    contents: [
                        {
                            type: "field",
                            id: args.id,
                            control: 'checkbox',
                            frame: 'none'
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
  }
}
