import { log } from '../log';

export let logelem = {
  name: 'log',
  key: 'message',
  defaults: {
    message: '',
  },
  transform: args => {
    log("-", args.message);
    return [];
  }
};
