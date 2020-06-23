import { isEmpty } from '../util';
import { elementClass } from '../util/elements';
import { __, _e } from '../i18n';

function renderHeading(h) {
  return (args, reg, doc) => {
    // log("headings", "elementClass:", args);
    const cls = elementClass(h, null, args, ['fade', 'bold', 'blk', 'pad'], { 'align': '' });
    return `<${h}${cls}>${_e(args.title, doc)}</${h}>`
  }
}

export let h1 = {
  name: 'h1',
  key: 'title',
  defaults: { title: "", align: "", blk: true },
  render: renderHeading('h1')
}

export let h2 = {
  name: 'h2',
  key: 'title',
  defaults: { title: "", align: "", blk: true },
  render: renderHeading('h2')
}

export let h3 = {
  name: 'h3',
  key: 'title',
  defaults: { title: "", align: "", blk: true },
  render: renderHeading('h3')
}

export let h4 = {
  name: 'h4',
  key: 'title',
  defaults: { title: "", align: "", blk: true },
  render: renderHeading('h4')
}

export let h5 = {
  name: 'h5',
  key: 'title',
  defaults: { title: "", align: "", blk: true },
  render: renderHeading('h5')
}

export let h6 = {
  name: 'h6',
  key: 'title',
  defaults: { title: "", align: "", blk: true },
  render: renderHeading('h6')
}

export let class_name = {
  name: 'class-name',
  key: 'title',
  defaults: {
    title: '',
    preface: '',
    suffix: '',
    contents: [],
    flex: 'medium',
  },
  render(args, reg, doc) {
    const preface = isEmpty(args.preface) ? '' : `<h5>${_e(args.preface, doc)}</h5>`;
    const name = `<h2>${_e(args.title, doc)}</h2>`;
    const suffix = isEmpty(args.suffix) ? '' : `<h5>${_e(args.suffix, doc)}</h5>`;

    const cls = elementClass('class-name', null, args, [], { flex: 'medium' });
    return `<div${cls}>${preface}${name}${suffix}${reg.render(args.contents, doc)}</div>`;
  }
}
