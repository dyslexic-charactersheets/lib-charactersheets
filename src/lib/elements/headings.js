import { elementClass, esc, isEmpty } from '../util';
import { __ } from '../i18n';

function renderHeading(h) {
  return (args, reg, doc) => {
    // log("headings", "elementClass:", args);
    var cls = elementClass(h, null, args, ['fade', 'bold'], { 'align': '' });
    return `<${h}${cls}>${esc(__(args.title, doc), true)}</${h}>`
  }
}

export let h1 = {
  name: 'h1',
  key: 'title',
  defaults: { title: "", align: "" },
  render: renderHeading('h1')
}

export let h2 = {
  name: 'h2',
  key: 'title',
  defaults: { title: "", align: "" },
  render: renderHeading('h2')
}

export let h3 = {
  name: 'h3',
  key: 'title',
  defaults: { title: "", align: "" },
  render: renderHeading('h3')
}

export let h4 = {
  name: 'h4',
  key: 'title',
  defaults: { title: "", align: "" },
  render: renderHeading('h4')
}

export let h5 = {
  name: 'h5',
  key: 'title',
  defaults: { title: "", align: "" },
  render: renderHeading('h5')
}

export let h6 = {
  name: 'h6',
  key: 'title',
  defaults: { title: "", align: "" },
  render: renderHeading('h6')
}

export let class_name = {
  name: 'class-name',
  key: 'title',
  defaults: {
    title: '',
    preface: '',
    affix: '',
  },
  render: (args, reg, doc) => {
    var preface = isEmpty(args.preface) ? '' : `<h5>${esc(__(args.preface), true)}</h5>`;
    var name = `<h2>${esc(__(args.title), true)}</h2>`;
    var affix = isEmpty(args.affix) ? '' : `<h5>${esc(__(args.affix), true)}</h5>`;

    return `<div class='class-name'>${preface}${name}${affix}</div>`;
  }
}
