import { interpolate } from '../util/objects';
import { elementClass } from '../util/elements';
import { log, error } from '../log';
import { __, _e, esc } from '../i18n';

export let p = {
  name: 'p',
  key: 'content',
  defaults: {
    prose: false,
    title: '',
    flags: [],
    content: '',
    align: 'left',
    icon: false,
    blk: true,
    nowrap: false,
    size: 'medium',
    colour: false,
    columns: 1
  },
  render(args, reg, doc) {
    const cls = elementClass('p', null, args, ['blk', 'nowrap', 'icon', 'optional'], { 'align': 'left', 'size': 'medium', 'colour': false });

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

      let title = (args.title != '') ? `<span class='p__title'>${_e(args.title, doc)}</span>` : '';
      let firstpara = paras.shift();
      firstpara = `<p${cls}><span class='p__inner'>${icon}<span class='p__content'>${title}${esc(firstpara)}</span></span></p>`;
      paras = paras.map(p => `<p${cls}>${esc(p)}</p>`);
      paras = [firstpara, ...paras];

      let prosecls = elementClass('prose', null, args, ['blk'], { 'columns': 1 })
      return `<div${prosecls}><div class='prose__inner'>${paras.join("")}</div></div>`;
    }
    
    let title = (args.title != '') ? `<span class='p__title'>${_e(args.title, doc)}</span> ` : '';

    // log("p", "Content", content);
    return `<p${cls}><span class='p__inner'>${icon}<span class='p__content'>${title}${_e(content, doc)}</span><span></p>`;
  }
}
