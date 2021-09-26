import { elementClass } from '../util/elements';

export let spacer = {
  name: 'spacer',
  defaults: {
    flex: 'medium'
  },
  render: args => {
    const cls = elementClass('spacer', null, args, [], { flex: 'medium' });

    return `<div${cls}></div>`;
  }
}
