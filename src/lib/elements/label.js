import { elementClass } from '../util';
import { __, _e } from '../i18n';

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
    return `<label${cls}>${_e(args.label, doc)}</label>`;
  }
}
