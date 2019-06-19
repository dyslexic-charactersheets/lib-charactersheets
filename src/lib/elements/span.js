import { elementClass, esc } from '../util';

export let span = {
    name: 'span',
    key: 'content',
    defaults: {
        content: '',
        'field-separator': false,
    }, 
    render: args => {
        var cls = elementClass('span', '', args, [ 'field-separator' ]);
        return `<span${cls}>${esc(args.content, true)}</span>`;
    }
}