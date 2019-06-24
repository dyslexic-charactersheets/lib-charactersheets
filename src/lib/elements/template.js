export let paste = {
    name: 'paste',
    key: 'template',
    defaults: {
        params: {}
    }, 
    render: args => ''
}

export let define = {
    name: 'define',
    key: 'template', 
    defaults: {
        template: '',
        params: {},
        contents: [],
    }, 
    render: args => ''
}