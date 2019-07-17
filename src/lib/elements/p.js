import { elementClass, esc } from '../util';

export let p = {
    name: 'p',
    key: 'content',
    defaults: {
        prose: false,
        content: '',
        align: 'left',
    }, 
    render: args => {
        var cls = elementClass('p', null, args, ['prose'], ['align', 'size']);
        
        // var paras = args.content.split(/[\n\r]/);

        return `<p${cls}>${esc(args.content, true)}</p>`;
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
    render: args => {
        return `<li>${esc(args.content, true)}</li>`;
    }
}
