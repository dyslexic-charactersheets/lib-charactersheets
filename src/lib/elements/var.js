import { interpolate } from '../util/objects';
import { log, warn } from '../log';

// Vary a variable name (for interpolation) by incrementing or decrementing it each time
export let varelem = {
  name: 'var',
  key: 'varname',
  defaults: {
    varname: '',
    value: 0,
    increment: 0,
    decrement: 0,
    cutoff: 100,
    contents: [],
  },
  transform(args, ctx) {
    let state = {
      value: args.value,
      increment: args.increment,
      decrement: args.decrement,
      count: 0,
      cutoff: args.cutoff,
    }

    const getValue = function() {
      if (state.cutoff > 0) {
        if (state.increment > 0) {
          if (state.count >= state.increment) {
            state.value++;
            state.cutoff--;
            state.count = 0;
          }
        } else if (state.decrement > 0) {
          if (state.count >= state.decrement) {
            state.value--;
            state.cutoff--;
            state.count = 0;
          }
        }
      }
      state.count++;
      return state.value;
    }

    let param = { [args.varname]: getValue };
    let result = interpolate(args.contents, param, ctx);
    return result;
  }
}
