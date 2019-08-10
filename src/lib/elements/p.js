import { elementClass, esc } from '../util';
import { __ } from '../i18n';

export let p = {
    name: 'p',
    key: 'content',
    defaults: {
        prose: false,
        content: '',
        align: 'left',
    },
    render: (args, reg, doc) => {
        var cls = elementClass('p', null, args, ['prose'], ['align', 'size']);

        // var paras = args.content.split(/[\n\r]/);

        return `<p${cls}>${esc(__(args.content, doc), true)}</p>`;
    }
}

export let ul = {
    name: 'ul',
    render: (args, reg, doc) => {
        return `<ul>${reg.render(args.contents, doc)}</ul>`;
    }
}

export let li = {
    name: 'li',
    key: 'content',
    defaults: {
        content: '',
    },
    render: (args, reg, doc) => {
        return `<li>${esc(__(args.content, doc), true)}</li>`;
    }
}
