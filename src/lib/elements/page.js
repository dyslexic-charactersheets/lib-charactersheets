import { elementID, elementClass, embed } from '../util/elements';
import { cloneDeep, has, interpolate } from '../util/objects';
import { isEmpty } from '../util';
import { log } from '../log';
import { __ } from '../i18n';

const paizoCopyrightAttribution = `<div class='copyright-attribution'><p>
<b>&copy; Marcus Downing &nbsp; <a href='https://www.dyslexic-charactersheets.com/'>dyslexic-charactersheets.com</a></b>
<span>
This character sheet uses trademarks and/or copyrights owned by Paizo Publishing, LLC, which are used under Paizo's <a href='paizo.com/licenses/communityuse'>Community Use Policy</a>.
We are expressly prohibited from charging you to use or access this content.
This character sheet is not published, endorsed, or specifically approved by Paizo.
For more information about Paizo Inc. and Paizo products, visit <a href='https://paizo.com'>paizo.com</a>.
</span>
</p></div>`;

export let page = {
  name: 'page',
  key: 'id',
  defaults: {
    name: '',
    order: 10,
    numbered: true,
    repeatable: false,
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

    const pageNumber = args.numbered ? `<div class='page__number'>${doc.nextPageNumber(args.id)}</div>` : '';
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

    let pagePrintToggle = '';
    let pageZoomButton = '';
    if (doc.hasUnit('document/zoom')) {
      pagePrintToggle = `
<label for='print-page-${args.id}' class='toggle toggle-print-page'>
<span class='left-label'>${__("Don't print")}</span>
<input type='checkbox' id='print-page-${args.id}' checked>
<span class='toggle-switch'></span>
<span class='right-label'>${__("Print")}</span>
</label>`;
      pageZoomButton = `<button class='page-zoom-button' data-page='${args.id}'></button>`;
    }

    return `<div class='page-container'><div${id}${cls} data-page='${args.id}'>${background}${fill}
      ${copyrightAttribution}${pageNumber}${watermark}
      <div class='page__contents'>${reg.render(args.contents, doc)}</div>
      ${pageNotes}${pageZoomButton}
      </div>${pagePrintToggle}</div>
      `;
  }
}

// combine pages
export let collate_pages = {
  name: 'collate-pages',
  defaults: {
    contents: []
  },
  transform(args, doc, reg) {
    let pages = args.contents;

    // Duplicate pages
    // pages = duplicatePages(pages, doc);
    
    // Combine half-pages into a single page
    pages = combinePages(pages);

    // Collate pages (folio / duplex)
    // pages = collatePages(pages, doc.getCollation());

    return pages;
  }
}

function duplicatePages(pages, doc) {
  if (isEmpty(doc.request)) {
    warn("collate-pages", "Request is unset", doc);
    return pages;
  }

  let attr = doc.request.primary[0].attributes;
  // log("collate-pages", "Page counts", attr);

  let numInventory = has(attr, "numInventory") ? 0+attr.numInventory : 0;
  let numSpellbook = has(attr, "numSpellbook") ? 0+attr.numSpellbook : 0;
  let numFormulaBook = has(attr, "numFormulaBook") ? 0+attr.numFormulaBook : 0;

  let out = [];
  function addDuplicates(page, count, offset) {
    for (let i = 0; i < count; i++) {
      let number = i+offset+1;

      let thispage = cloneDeep(page);
      thispage.id = `${page.id}/${number}`;
      thispage = interpolate(thispage, {pagenum: number}, doc);

      out.push(thispage);
    }
  }

  let pastSpellbook = 0;

  for (let page of pages) {
    log("collate-pages", "Page id:", page.id);

    switch (page.id) {
      case "inventory-more":
        log("collate-pages", "Inventory pages", numInventory);
        addDuplicates(page, numInventory - 1, 1);
        break;

      // spellbooks - depend on the first 
      case "spellbook-custom":
        pastSpellbook++;
        out.push(page);
        break;

      case "spellbook":
        addDuplicates(page, numSpellbook - pastSpellbook, pastSpellbook);
        break;

      case "formula-book":
        addDuplicates(page, numFormulaBook, 0);
        break;

      default:
        out.push(page);
        break;
    }
  }
  return out;
}

function collatePages(pages, collation) {
  // log("page", "Collate", pages);
  // switch(doc.collation) {
  //   case "folio":
  //   case "duplex":
  //   default:
  // }

  return pages;
}

function combinePages(pages) {
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

      let pageNumbered = !has(page, 'numbered') || page.numbered;
      let nextPageNumbered = !has(page, 'numbered') || nextPage.numbered;

      out.push({
        type: 'page',

        order: page.order,
        id: id,
        name: name,
        numbered: pageNumbered || nextPageNumbered,
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
    // log("page", "Collated:", out);
  }

  return out;
}
