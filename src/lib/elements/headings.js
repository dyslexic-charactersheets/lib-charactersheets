import { elementClass, esc } from '../util';

function renderHeading(h) {
    return args => {
        var cls = elementClass(h, null, args, [], { 'align': '' });
        return `<${h}${cls}>${esc(args.title)}</${h}>`
    }
}

export let h1 = {
    name: 'h1',
    key: 'title',
    defaults: { title: "", align: "" },
    render: renderHeading('h1')
}

export let h2 = {
    name: 'h1',
    key: 'title',
    defaults: { title: "", align: "" },
    render: renderHeading('h1')
}

export let h3 = {
    name: 'h1',
    key: 'title',
    defaults: { title: "", align: "" },
    render: renderHeading('h1')
}

export let h4 = {
    name: 'h1',
    key: 'title',
    defaults: { title: "", align: "" },
    render: renderHeading('h1')
}

export let h5 = {
    name: 'h1',
    key: 'title',
    defaults: { title: "", align: "" },
    render: renderHeading('h1')
}

export let h6 = {
    name: 'h1',
    key: 'title',
    defaults: { title: "", align: "" },
    render: renderHeading('h1')
}