import { elementClass } from '../util/elements';

export let logo = {
  name: 'logo',
  key: 'source',
  defaults: {
    source: '',
    size: 'medium',
  },
  render (args) {
    const cls = elementClass('logo', null, args, [], { 'size': 'medium' });
    return `<h1${cls}></h1>`;
  } // `<h1 class='logo'></h1>`
}
