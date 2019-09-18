import { elementClass, esc } from '../util';
import { __ } from '../i18n';

export let ruby = {
  name: 'ruby',
  key: 'ruby',
  defaults: {
    ruby: '',
    contents: [],
    align: 'center',
  },
  render(args, reg, doc) {
    const cls = elementClass('ruby', null, args, [], { 'align': 'center' });
    return `<div${cls}><label class='ruby__text'>${esc(__(args.ruby))}</label>${reg.render(args.contents, doc)}</div>`;
  }
}
