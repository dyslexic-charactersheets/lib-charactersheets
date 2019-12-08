import { elementClass } from '../util';

export let hr = {
  name: 'hr',
  defaults: {
    swash: false,
    light: false,
  },
  render(args) {
    args.blk = true;

    if (args.swash) {

      return `<div class='hr--swash blk'><div class='inner'></div></div>`;
    }

    const cls = elementClass('hr', null, args, ['swash', 'light', 'blk']);
    return `<hr${cls}>`;
  }
}

export let tail = {
  name: 'tail',
  render(args) {
    args.tail = true;
    args.blk = true;
    const cls = elementClass('hr', null, args, ['tail', 'blk']);
    return `<hr${cls}>`;
  }
}

export let vr = {
  name: 'vr',
  render: () => {
    return '<span class="vr"></span>';
  }
}
