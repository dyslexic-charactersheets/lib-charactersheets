import { elementClass } from '../util';

export let hr = {
  name: 'hr',
  defaults: {
    swash: false,
  },
  render(args) {
    const cls = elementClass('hr', null, args, ['swash']);
    return `<hr${cls}>`;
  }
}

export let tail = {
  name: 'tail',
  render(args) {
    args.tail = true;
    const cls = elementClass('hr', null, args, ['tail']);
    return `<hr${cls}>`;
  }
}

export let vr = {
  name: 'vr',
  render: () => {
    return '<span class="vr"></span>';
  }
}
