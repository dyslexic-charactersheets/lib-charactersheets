import { elementClass, esc } from '../util';
import { __ } from '../i18n';

export let label = {
  name: 'label',
  key: 'label',
  defaults: {
    label: "",
    rotate: false,
    align: "",
  },
  render(args, reg, doc) {
    const cls = elementClass('label', null, args, ["rotate"], {"align": ""});
    return `<label${cls}>${esc(__(args.label, doc), true)}</label>`;
  }
}
