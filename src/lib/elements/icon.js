import { elementClass } from '../util/elements';

export let icon = {
  name: 'icon',
  key: 'icon',
  defaults: {
    icon: "",
    size: "medium",
    width: "",
  },
  render(args) {
    args.blk = true;
    const cls = elementClass('icon', null, args, ["blk"], { "icon": "", "size": "medium", "width": "" });
    return `<i${cls}></i>`;
  }
}
