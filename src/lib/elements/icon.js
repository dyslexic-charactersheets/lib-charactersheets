import { elementClass } from '../util';

export let icon = {
  name: 'icon',
  key: 'icon',
  defaults: {
    icon: "",
    size: "medium"
  },
  render(args) {
    args.blk = true;
    const cls = elementClass('icon', null, args, ["blk"], { "icon": "", "size": "medium" });
    return `<i${cls}></i>`;
  }
}
