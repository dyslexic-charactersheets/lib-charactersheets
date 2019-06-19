export let blockquote = {
    name: 'blockquote',
    render: (args, reg) => `<blockquote>${reg.render(args.contents)}</blockquote>`
}
