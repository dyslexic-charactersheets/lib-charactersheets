import { elementClass } from '../util/elements';
import { __, _e } from '../i18n';

export let ruby = {
  name: 'ruby',
  key: 'ruby',
  defaults: {
    ruby: '',
    contents: [],
    align: 'center',
    arms: false,
  },
  render(args, reg, doc) {
    const cls = elementClass('ruby', null, args, ['arms'], { 'align': 'center' });
    return `<div${cls}><div class='ruby__sub'><label class='ruby__text'>${_e(args.ruby, doc)}</label></div>${reg.render(args.contents, doc)}</div>`;
  }
}

export let ruby_min1 = {
  name: 'ruby-min1',
  defaults: {
    contents: []
  },
  transform(args) {
    return [
      {
        type: 'ruby',
        ruby: '_{(Minimum 1)}',
        contents: args.contents
      }
    ];
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
