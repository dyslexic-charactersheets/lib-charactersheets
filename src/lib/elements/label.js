import { elementClass } from '../util';
import { __, _e } from '../i18n';
import { log } from '../log';

export let label = {
  name: 'label',
  key: 'label',
  defaults: {
    label: "",
    rotate: false,
    align: "",
  },
  render(args, reg, doc) {
    // log("label", "Args", args);
    const cls = elementClass('label', null, args, ["rotate"], {"align": ""});
    return `<label${cls}>${_e(args.label, doc)}</label>`;
  }
}
