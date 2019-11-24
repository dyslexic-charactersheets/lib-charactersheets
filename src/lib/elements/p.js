import { elementClass, isEmpty } from '../util';
import { log, error } from '../log';
import { __, _e } from '../i18n';

export let p = {
  name: 'p',
  key: 'content',
  defaults: {
    prose: false,
    content: '',
    align: 'left',
    icon: false,
    pad: false,
  },
  render(args, reg, doc) {
    const cls = elementClass('p', null, args, ['prose', 'pad'], { 'align': 'left', 'size': 'medium' });

    // let paras = args.content.split(/[\n\r]/);
    const icon = args.icon ? reg.renderItem({
      type: 'icon',
      icon: args.icon,
      size: 'small'
    }, doc) : '';

    return `<p${cls}>${icon}${_e(args.content, doc)}</p>`;
  }
}
