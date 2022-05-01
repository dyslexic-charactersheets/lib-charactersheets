import { elementID, elementClass, embed } from '../util/elements';
import { has } from '../util/objects';
import { log } from '../log';

const paizoCopyrightAttribution = `<div class='copyright-attribution'><p>
<b>&copy; Marcus Downing &nbsp; <a href='https://www.dyslexic-charactersheets.com/'>dyslexic-charactersheets.com</a></b>
<span>This character sheet uses trademarks and/or copyrights owned by Paizo Publishing, LLC, which are used under Paizo's Community Use Policy. We are expressly prohibited from charging you to use or access this content. This character sheet is not published, endorsed, or specifically approved by Paizo Publishing. For more information about Paizo's Community Use Policy, please visit <a href='http://paizo.com/communityuse'>paizo.com/communityuse</a>. For more information about Paizo Publishing and Paizo products, please visit <a href='http://paizo.com'>paizo.com</a>.</span>
</p></div>`;

export let page = {
  name: 'page',
  key: 'id',
  defaults: {
    name: '',
    order: 10,
    numbered: true,
    flex: false,
    landscape: false,
    half: false,
    background: 'yes',
    fill: false,
    contents: []
  },
  render(args, reg, doc) {
    // log("page", "Rendering page", args.id);
    if (has(args, 'no-bg') && args['no-bg'])
      args.background = 'no';

    const id = elementID('page', args.id);
    const cls = elementClass('page', null, args, ['flex', 'landscape', 'no-bg', 'fill']);

    const pageNumber = args.numbered ? `<div class='page__number'>${doc.nextPageNumber()}</div>` : '';
    let copyrightAttribution = paizoCopyrightAttribution;

    if (args.id == 'permission')
      copyrightAttribution = '';

    let background = '';
    switch (args.background) {
      case 'yes':
        background = "<div class='page__background'></div>";
        break;
      
      case 'no':
        break;

      default:
        background = `<div class='page__background page__background--background_${args.background}'></div>`;
    }

    let fill = '';
    if (args.fill) {
      fill = `<div class='page__fill page__fill--fill_${args.fill}'></div>`;
    }

    const watermark = doc.watermark ? `<div class='page__watermark'><div class='page__watermark__inner'>${doc.watermark}</div></div>` : '';

    let pageNotes = ''
    if (doc.hasUnit('data/note')) {
      function note(num) {
        let line = Math.ceil(num / 2);
        let leftright = (num % 2) ? 'left' : 'right';
        return `<div class='page__note page__note--num-${line} page__note--${leftright}' id='${id}__note-${num}'>
  <!-- <button class='page__note__add'></button> -->
  <div class='page__note__field'>
    <textarea class='page__note__control'></textarea>
  </div>
  <div class='page__note__notch'></div>
</div>`;
      }
      for (let i = 1; i <= 16; i++) {
        pageNotes = pageNotes+note(i);
      }
    }

    return `<div${id}${cls}>${background}${fill}
      ${copyrightAttribution}${pageNumber}${watermark}
      <div class='page__contents'>${reg.render(args.contents, doc)}</div>
      ${pageNotes}
      </div>
      `;
  }
}

// combine pages
export let collate_pages = {
  name: 'collate-pages',
  defaults: {
    contents: []
  },
  transform(args) {
    let pages = args.contents;
    // log("page", "Collate", pages);

    let out = [];
    for (let i = 0; i < pages.length; i++) {
      let page = pages[i];
      if (has(page, "half") && page.half) {
        // log("page", "Collate: half page", page.id);
        let nextPage = pages[i+1];
        let id = page.id;
        let name = page.name;

        let replacement = [embed(page.contents)];
        if (has(nextPage, "half") && nextPage.half) {
          // log("page", "Collate: next page", nextPage.id);
          replacement.push(embed(nextPage.contents));
          id = `${id}+${nextPage.id}`;
          name = `${name} + ${nextPage.name}`;
          i++;
        }

        out.push({
          type: 'page',

          order: page.order,
          id: id,
          name: name,
          numbered: page.numbered,
          flex: true,
          landscape: true,
          half: false,
          contents: [
            {
              type: 'layout',
              layout: '2e',
              contents: replacement
            }
          ]
        });
      } else {
        // log("page", "Collate: full page", page.id);
        out.push(page);
      }
    }

    return out;
  }
}
