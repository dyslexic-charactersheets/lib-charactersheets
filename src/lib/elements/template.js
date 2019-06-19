export let paste = {
    name: 'paste',
    key: 'template',
    defaults: {
        params: {}
    }, 
    render: args => ''
}

export let template = {
    name: 'template',
    key: 'template', 
    defaults: {
        template: '',
        params: {},
        contents: [],
    }, 
    render: args => ''
}