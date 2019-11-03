import { elementID, elementClass, isEmpty, embed } from '../util';
import { __ } from '../i18n';
import { log } from '../log';

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

    left: false,
    right: false,
    action: false,
  },
  transform(args, ctx) {
    if (isEmpty(args.header) || isEmpty(args.contents)) {
      let header = args.header;
      if (isEmpty(args.header)) {
        header = [];

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
            align: 'left',
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
              id: args.id + '-cat',
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
              id: args.id + '-level',
              frame: 'none',
              size: 'large',
              width: 'small'
            });
          }
        }

        header = [
          {
            type: 'row',
            contents: header
          }
        ];
      }

      let contents = args.contents;
      if (isEmpty(args.contents)) {
        if (ctx.largePrint && args.lines > 1) {
          args.lines--;
        }

        contents = [];
        if (args.content) {
          contents.push({
            type: 'p',
            content: args.content
          });
        } else {
          contents.push({
            type: 'field',
            id: args.id + '-details',
            frame: 'none',
            align: 'left',
            repeat: args.lines,
            width: 'stretch',
            'merge-bottom': args['merge-bottom']
          });
        }
      }

      if (args.action && !args.left) {
        args.left = { type: 'icon', icon: (args.action == 1 ? 'action' : 'action'+args.action) };
      }

      if (args.left || args.right) {
        let layout = '';

        if (args.left && args.right) {
          layout = 'indent-lr';
          contents = [embed(args.left), embed(contents), embed(args.right)];
        } else if (args.left) {
          layout = 'indent-l';
          contents = [embed(args.length), embed(contents)];
        } else if (args.right) {
          layout = 'indent-r';
          contents = [embed(contents), embed(args.right)];
        }

        contents = [
          {
            type: 'layout',
            layout: layout,
            contents
          }
        ];
      }

      const article = {
        type: 'article',
        id: args.id,
        header: header,
        contents: contents,
        shade: false,
        annotation: args.annotation,
        'merge-bottom': args['merge-bottom'],
      };

      return [article];
    }
    return false;
  },
  render(args, reg, doc) {
    const id = elementID('section', args.id);
    const cls = elementClass('section', null, args, ['shade']);

    const annotation = args.annotation ? `<div class='article__annotation'>${__(args.annotation, doc)}</div>` : '';
    const header = `<header>${reg.render(args.header, doc)}</header>`
    const dl = '';

    // const contents = mergeBottom(args.contents);

    return `<article${id}${cls}>
      ${annotation}${header}${dl}
      <div class='g'>${reg.render(args.contents, doc)}</div>
      </article>`;
  }
}
