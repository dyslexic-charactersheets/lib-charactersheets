import { elementClass, isEmpty, interpolate } from '../util';
import { log, error } from '../log';
import { __, _e, esc } from '../i18n';

export let flags = {
  name: 'flags',
  key: 'flags',
  defaults: {
    label: '',
    flags: [],
    sort: true,
    blk: true,
  },
  render(args, reg, doc) {
    const cls = elementClass('p', null, args, ['blk', 'flags'], { });

    let label = interpolate(args.label, {}, doc);

    let flags = args.flags;

    if (args.sort) {
      flags = flags.sort();
    }

    flags = flags.map(flag => {
      return {
        type: "span",
        content: flag
      }
    });
    
    // log("p", "Content", content);
    return `<p${cls}>${_e(label, doc)}${reg.render(flags, doc)}</p>`;
  }
}
