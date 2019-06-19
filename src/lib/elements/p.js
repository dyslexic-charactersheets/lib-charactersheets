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
