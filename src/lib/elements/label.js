import { elementClass } from '../util/elements';
import { __, _e } from '../i18n';
import { log } from '../log';

export let label = {
  name: 'label',
  key: 'label',
  defaults: {
    label: "",
    rotate: false,
    align: "",
    nowrap: false,
    narrow: false,
  },
  render(args, reg, doc) {
    // log("label", "Args", args);
    const cls = elementClass('label', null, args, ["rotate", "nowrap", "narrow"], {"align": ""});
    return `<label${cls}>${_e(args.label, doc)}</label>`;
  }
}
