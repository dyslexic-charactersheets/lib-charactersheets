import { elementClass } from '../util';

export let icon = {
  name: 'icon',
  key: 'icon',
  defaults: {
    icon: "",
  },
  render(args) {
    var cls = elementClass('icon', null, args, [], ["icon", "size"]);
    return `<i${cls}></i>`;
  }
}
