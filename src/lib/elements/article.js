import * as _ from 'lodash';

import { elementID, elementClass, isEmpty } from '../util';

export let article = {
  name: 'article',
  key: 'id',
  defaults: {
    id: '',
    title: false,
    header: [],
    contents: [],
    content: '',
    shade: false,
    'merge-bottom': true,

    annotation: false,
    cat: false,
    level: false,
    'show-cat': false,
    'show-level': false,
    lines: 2,
  },
  transform: args => {
    if (isEmpty(args.header) && isEmpty(args.contents)) {
      var header = [];

      if (args.title) {
        header.push({
          type: 'h6',
          title: args.title
        });
      } else {
        header.push({
          type: 'field',
          id: args.id,
          frame: 'none',
          // size: 'large',
          width: 'stretch'
        });
      }
      if (args.cat || args['show-cat']) {
        if (args.cat) {
          header.push({
            type: 'span',
            'article-cat': true,
            content: args.cat
          });
        } else {
          header.push({
            type: 'field',
            id: args.id+'-cat',
            frame: 'none',
            size: 'large',
            align: 'right',
            width: 'large'
          });
        }
      }
      if (args.level || args['show-level']) {
        if (args.level) {
          header.push({
            type: 'level-marker',
            level: args.level,
            marker: false
          });
        } else {
          header.push({
            type: 'field',
            id: args.id+'-level',
            frame: 'none',
            size: 'large',
            width: 'small'
          });
        }
      }
      
      var contents = [];
      if (args.content) {
        contents.push({
          type: 'p',
          content: args.content
        });
      } else {
        contents.push({
          type: 'field',
          id: args.id+'-details',
          frame: 'none',
          repeat: args.lines,
          width: 'stretch',
          'merge-bottom': args['merge-bottom']
        });
      }

      let article = {
        type: 'article',
        id: args.id,
        header: [
          {
            type: 'row',
            contents: header
          }
        ],
        contents: contents,
        shade: false,
        annotation: args.annotation,
        'merge-bottom': true,
      };

      return [ article ];
    }
    return false;
  },
  render: (args, reg, doc) => {
    var id = elementID('section', args.id);
    var cls = elementClass('section', null, args, ['shade']);

    var annotation = args.annotation ? `<div class='article__annotation'>${args.annotation}</div>` : '';
    var header = `<header>${reg.render(args.header, doc)}</header>`
    var dl = '';

    // var contents = mergeBottom(args.contents);

    return `<article${id}${cls}>
            ${annotation}${header}${dl}
            <div class='g'>${reg.render(args.contents, doc)}</div>
            </article>`;
  }
}
