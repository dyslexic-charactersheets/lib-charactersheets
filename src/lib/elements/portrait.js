import { elementClass } from '../util';

export let portrait = {
    name: 'portrait',
    key: 'char',
    defaults: {
        overprint: false,
        char: 'personal',
    }, 
    render: args => {
        // TODO get the right copyright attribution from the data
        var copyright = "Image &copy; Paizo Publishing";
        var cls = elementClass('portrait', null, args, ['overprint'], { 'char': '' });
        return `<figure${cls}><div class='portrait__inner'></div><figcaption>${copyright}</figcaption></figure>`;
    }
}
