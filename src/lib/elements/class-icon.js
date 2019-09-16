import { elementClass } from '../util';

export let class_icon = {
  name: 'class-icon',
  key: 'icon',
  defaults: {
    icon: '',
    optional: true,
    size: 'medium',
  },
  render(args, reg, doc) {
    var cls = elementClass('class-icon', null, args, [], { 'icon': '', 'size': 'medium' });
    return `<div${cls}></div>`;
  }
}
