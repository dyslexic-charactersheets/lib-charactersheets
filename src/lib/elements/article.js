import { isEmpty } from '../util';
import { elementID, elementClass, embed } from '../util/elements';
import { __ } from '../i18n';
import { log, warn, trace } from '../log';

export let article = {
  name: 'article',
  key: 'id',
  defaults: {
    id: '',
    title: false,
    header: [],
    'header-size': 'medium',
    contents: [],
    content: '',
    shade: false,
    'merge-bottom': true,
    blk: true,
    inline: false,

    annotation: false,
    cat: false,
    level: false,
    'show-cat': false,
    'show-level': false,
    lines: 2,
    reduce: 1,

    left: false,
    right: false,
    action: false,
  },
  transform(args, ctx) {

    // if (isEmpty(args.id)) {
    //   warn("article", "Missing article ID:", args);
    // }
    let emptyHeader = false;
    if (isEmpty(args.header) || isEmpty(args.contents)) {
      let header = args.header;
      if (isEmpty(args.header)) {
        header = [];

        if (args.title) {
          header.push({
            type: 'h6',
            blk: false,
            title: args.title
          });
        } else {
          if (isEmpty(args.id))
            trace("article", "Missing article ID");
          header.push({
            type: 'field',
            id: args.id,
            frame: 'none',
            align: 'left',
            format: 'string',
            size: args['header-size'],
            width: 'stretch'
          });
          emptyHeader = true;
        }
        if (args.cat || args['show-cat']) {
          emptyHeader = false;
          if (args.cat) {
            header.push({
              type: 'span',
              'article-cat': true,
              content: args.cat
            });
          } else {
            if (isEmpty(args.id))
              trace("article", "Missing article ID");
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
          emptyHeader = false;
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
              border: 'heavy',
              size: 'large',
              width: 'small'
            });
          }
        }

        header = [
          {
            type: 'row',
            blk: false,
            contents: header
          }
        ];
      }

      let contents = args.contents;
      if (isEmpty(args.contents)) {
        if (ctx.largePrint && args.lines > 1 && args.reduce > 0) {
          args.lines -= args.reduce;
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
            control: 'p',
            'with-title': false,
            format: 'string',
            lines: args.lines,
            width: 'stretch',
            'merge-bottom': args['merge-bottom']
          });
        }
      }

      if (args.action && !args.left) {
        var icon;
        switch (args.action) {
          case 1:           icon = 'action'; break;
          case 'reaction':  icon = 'reaction'; break;
          case 'free':      icon = 'free-action'; break;
          case 'template':  icon = 'action-template'; break;
          default:          icon = 'action'+args.action; break;
        }
        args.left = { type: 'icon', icon: icon };
        // log("article", "Adding action:", args.action, args.left);
      }

      if (args.left || args.right) {
        let layout = '';

        if (args.left && args.right) {
          layout = 'indent-lr';
          contents = [embed(args.left), embed(contents), embed(args.right)];
        } else if (args.left) {
          layout = 'indent-l';
          contents = [embed(args.left), embed(contents)];
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
        blk: args.blk,
        annotation: args.annotation,
        "no-header-line": args['no-header-line'] || emptyHeader,
        'merge-bottom': args['merge-bottom'],
      };

      return [article];
    }
    return false;
  },
  render(args, reg, doc) {
    if (isEmpty(args.header) || (args.header.length == 1 && args.header[0].type == 'field'))
      args['no-header-line'] = true;
    const id = elementID('article', args.id);
    const cls = elementClass('article', null, args, ['shade', 'blk', 'no-header-line']);

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
