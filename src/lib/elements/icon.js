import { elementClass } from '../util';

export let icon = {
  name: 'icon',
  key: 'icon',
  defaults: {
    icon: "",
    size: "medium"
  },
  render(args) {
    const cls = elementClass('icon', null, args, [], { "icon": "", "size": "medium" });
    return `<i${cls}></i>`;
  }
}
