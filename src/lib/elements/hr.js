import { elementClass } from '../util/elements';

export let hr = {
  name: 'hr',
  defaults: {
    swash: false,
    light: false,
    blk: true,
  },
  render(args) {
    if (args.swash) {
      const cls = elementClass('hr', null, args, ['swash', 'blk']);
      return `<div${cls}><div class='inner'></div></div>`;
    }

    const cls = elementClass('hr', null, args, ['swash', 'light', 'blk']);
    return `<hr${cls}>`;
  }
}

export let tail = {
  name: 'tail',
  defaults: {
    blk: true,
  },
  render(args) {
    args.tail = true;
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
