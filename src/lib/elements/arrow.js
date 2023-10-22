import { elementClass, elementData } from "../util/elements";

export let arrow = {
  name: 'arrow',
  key: 'direction',
  defaults: {
    from: '',
    to: '',
    direction: 'down',
    head: true
  },
  render(args) {
    let segmented = true;
    if (args.direction.match(/(up|down|left|right)-(up|down|left|right)/)) {
      segmented = false;
    }

    const cls = elementClass('arrow', null, args, [], {direction: ''});
    const data = elementData({from: args.from, to: args.to, direction: args.direction});
    return `<div${cls}${data}>
      ${args.head ? `
        <div class='arrow__head'></div>
      ` : ''}
      <div class='arrow__line arrow__head-line'></div>
      <div class='arrow__curve arrow__head-curve'></div>
      ${segmented ? `
        <div class='arrow__line arrow__main-line'></div>
        <div class='arrow__curve arrow__tail-curve'></div>
      ` : ''}
      <div class='arrow__line arrow__tail-line'></div>
    </div>`;
  }
}
