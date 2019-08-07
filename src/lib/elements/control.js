export let ifelem = {
  name: 'if',
  key: 'cond',
  defaults: {
    cond: '',
    then: [],
  },
  transform: args => {
    
    return args.then;
  }
}
