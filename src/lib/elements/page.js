import { elementID, elementClass } from '../util';

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
  },
  render(args, reg, doc) {
    const id = elementID('page', args.id);
    const cls = elementClass('page', null, args, ['flex', 'landscape', 'no-bg']);

    const pageNumber = args.numbered ? `<div class='page__number'>${doc.nextPageNumber()}</div>` : '';
    let copyrightAttribution = paizoCopyrightAttribution;

    if (args.id == 'permission')
      copyrightAttribution = '';

    const watermark = doc.watermark ? `<div class='page__watermark'><div class='page__watermark__inner'>${doc.watermark}</div></div>` : '';

    return `<div${id}${cls}>
      ${copyrightAttribution}${pageNumber}${watermark}
      <div class='page__contents'>${reg.render(args.contents, doc)}</div>
      </div>
      `;
  }
}
