export let blockquote = {
    name: 'blockquote',
    render: (args, reg, doc) => `<blockquote>${reg.render(args.contents, doc)}</blockquote>`
}
