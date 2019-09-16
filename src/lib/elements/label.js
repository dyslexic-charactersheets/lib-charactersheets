import { elementClass, esc } from '../util';
import { __ } from '../i18n';

export let label = {
  name: 'label',
  key: 'label',
  defaults: {
    label: "",
  },
  render(args, reg, doc) {
    var cls = elementClass('label', null, args, [], ["align"]);
    return `<label${cls}>${esc(__(args.label, doc), true)}</label>`;
  }
}
