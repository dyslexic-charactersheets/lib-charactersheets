export let action = {
  name: 'action',
  key: 'action',
  defaults: {
    action: 1,
    blk: false,
    order: 1,
    contents: [],
  },
  transform(args) {
    let icon = 'action';
    let layout = 'indent-l';
    switch (args.action) {
      case 1: icon = 'action'; break;
      case 2: icon = 'action2'; break;
      case 3: icon = 'action3'; layout = 'indent-lw'; break;
      case 13: icon = 'action13'; layout = 'indent-lw'; break;
      case '2nd': icon = 'action2nd'; break;
      case '3rd': icon = 'action3rd'; layout = 'indent-lw'; break;
      case 'reaction': icon = 'reaction'; break;
      case 'free': icon = 'free-action'; break;
      case 'template': icon = 'action-template'; layout = 'indent-lw'; break;
    }

    return [
      {
        type: "layout",
        layout: layout,
        blk: args.blk,
        order: args.order,
        contents: [
          {
            type: "g",
            contents: [
              {
                type: "icon",
                icon: icon
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

export let selectable = {
  name: 'selectable',
  key: 'id',
  defaults: {
    id: '',
    blk: false,
    pad: false,
    selected: false,
    radio: false,
    contents: []
  },
  transform(args) {
    return [
      {
        type: "layout",
        layout: "indent-l",
        blk: args.blk,
        contents: [
          {
            type: "g",
            contents: [
              {
                type: "field",
                id: args.id,
                control: args.radio ? 'radio' : 'checkbox',
                frame: 'none',
                value: args.selected,
              }
            ]
          },
          {
            type: "g",
            pad: args.pad,
            contents: args.contents
          }
        ]
      }
    ];
  }
}
