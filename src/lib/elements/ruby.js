import { elementClass } from '../util';
import { __, _e } from '../i18n';

export let ruby = {
  name: 'ruby',
  key: 'ruby',
  defaults: {
    ruby: '',
    contents: [],
    align: 'center',
  },
  render(args, reg, doc) {
    const cls = elementClass('ruby', null, args, [], { 'align': 'center' });
    return `<div${cls}><label class='ruby__text'>${_e(args.ruby, doc)}</label>${reg.render(args.contents, doc)}</div>`;
  }
}

export let ruby_round_down = {
  name: 'ruby-round-down',
  defaults: {
    contents: []
  },
  transform(args) {
    return [
      {
        type: 'ruby',
        ruby: '_{(Round down)}',
        contents: args.contents
      }
    ];
  }
}

export let ruby_round_up = {
  name: 'ruby-round-up',
  defaults: {
    contents: []
  },
  transform(args) {
    return [
      {
        type: 'ruby',
        ruby: '[b]_{(Round up)}[/b]',
        contents: args.contents
      }
    ];
  }
}
