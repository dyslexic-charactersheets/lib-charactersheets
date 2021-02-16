export let action = {
  name: 'action',
  key: 'action',
  defaults: {
    action: 1,
    id: false,
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
      case 13: case "13": icon = 'action13'; layout = 'indent-lw'; break;
      case '2nd': icon = 'action2nd'; break;
      case '3rd': icon = 'action3rd'; layout = 'indent-lw'; break;
      case 'reaction': icon = 'reaction'; break;
      case 'free': icon = 'free-action'; break;
      case 'template': icon = 'action-template'; layout = 'indent-lw'; break;
    }

    let iconPart = {
      type: "g",
      contents: [
        {
          type: "icon",
          icon: icon
        }
      ]
    };

    if (args.action == "template") {
      iconPart = {
        type: "field",
        id: args.id+"-action",
        control: "action-icon",
        value: 'template',
        frame: "none"
      };
    }

    return [
      {
        type: "layout",
        layout: layout,
        blk: args.blk,
        order: args.order,
        contents: [
          iconPart,
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
    max: 1,
    pad: false,
    selected: false,
    style: '',
    radio: false,
    order: null,
    contents: []
  },
  transform(args) {
    let checkboxes = [];
    if (args.max > 1) {
      let depth = args.max > 6 ? 3 : (args.max > 3 ? 2 : 1);
      checkboxes = [
        {
          type: "field",
          id: args.id,
          control: 'checkgrid',
          frame: 'none',
          max: args.max,
          depth: depth,
          direction: "vertical",
          value: args.selected,
          style: args.style
        }
      ]
      // for (let i = 1; i <= args.max; i++) {
      //   checkboxes.push({
      //     type: "field",
      //     id: args.id+"-"+i,
      //     control: args.radio ? 'radio' : 'checkbox',
      //     frame: 'none',
      //     value: args.selected,
      //     style: args.style
      //   });
      // }
    } else {
      checkboxes = [
        {
          type: "field",
          id: args.id,
          control: args.radio ? 'radio' : 'checkbox',
          frame: 'none',
          value: args.selected,
          style: args.style
        }
      ];
    }
    return [
      {
        type: "layout",
        layout: "indent-l",
        blk: args.blk,
        order: args.order,
        contents: [
          {
            type: "g",
            contents: checkboxes
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
