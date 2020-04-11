import { elementClass, isEmpty, interpolate } from '../util';
import { log, error } from '../log';
import { __, _e, esc } from '../i18n';

export let p = {
  name: 'p',
  key: 'content',
  defaults: {
    prose: false,
    content: '',
    align: 'left',
    icon: false,
    blk: true,
    nowrap: false,
    columns: 1
  },
  render(args, reg, doc) {
    const cls = elementClass('p', null, args, ['blk', 'nowrap'], { 'align': 'left', 'size': 'medium' });

    // let paras = args.content.split(/[\n\r]/);
    const icon = args.icon ? reg.renderItem({
      type: 'icon',
      icon: args.icon,
      size: 'small'
    }, doc) : '';

    let content = interpolate(args.content, {}, doc);

    if (args.prose) {
      // log("p", "Prose content", content);
      let paras = __(content).split("\n").map(p => p.trim()).filter(p => p != "");
      if (paras.length == 0) {
        return "";
      }
      // log("p", "Prose paras", paras);

      let firstpara = paras.shift();
      firstpara = `<p${cls}>${icon}${esc(firstpara)}</p>`;
      paras = paras.map(p => `<p${cls}>${esc(p)}</p>`);
      paras = [firstpara, ...paras];

      let prosecls = elementClass('prose', null, args, ['blk'], { 'columns': 1 })
      return `<div${prosecls}><div class='prose__inner'>${paras.join("")}</div></div>`;
    }
    
    // log("p", "Content", content);
    return `<p${cls}>${icon}${_e(content, doc)}</p>`;
  }
}
