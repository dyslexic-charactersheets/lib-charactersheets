import { elementClass } from '../util/elements';

export let icon = {
  name: 'icon',
  key: 'icon',
  defaults: {
    icon: "",
    size: "medium",
    width: "",
    "for": false,
  },
  render(args) {
    args.blk = true;
    const cls = elementClass('icon', null, args, ["blk"], { "icon": "", "size": "medium", "width": "" });
    if (args["for"]) {
      return `<label for="${args.for}"><i${cls}></i></label>`;
    }
    return `<i${cls}></i>`;
  }
}
