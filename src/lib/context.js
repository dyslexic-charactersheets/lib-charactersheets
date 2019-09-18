import { log, error } from './log';
import { has, isArray } from './util';

let contextStack = [];

const regex = new RegExp('^(.*?)_(.*)$', '');

export function applyContext(item) {
  if (isArray(item)) {
    return item.map(applyContext);
  }

  let contentsKey = "contents";
  // log("context", "Item", item);
  // log("context", "has type:", (has(item, "type") ? "yes" : "no"));

  // apply context
  if (has(item, "type")) {
    const type = item.type;
    let context = {}
    for (let i = contextStack.length - 1; i >= 0; i--) {
      if (has(contextStack[i], type)) {
        context = { ...contextStack[i][type], ...context };
      }
    }
    // log("context", "Applying context to", type, context);
    item = { ...context, ...item };

    switch (type) {
      case 'table': contentsKey = 'template'; break;
      case 'calc': contentsKey = 'inputs'; break;
      case 'field': contentsKey = 'parts'; break;
    }
  }

  // log("context", "has", contentsKey+":", (has(item, contentsKey) ? "yes" : "no"));

  if (has(item, contentsKey)) {
    // extract context
    let contextArgs = {};
    Object.entries(item).forEach(pair => {
      // log("context", "Checking arg", pair[0]);
      const match = pair[0].match(regex);
      if (match) {
        // log("context", "Found a context arg:", pair[0]);
        const type = match[1];
        const key = match[2];
        if (!has(contextArgs, type)) contextArgs[type] = {};
        contextArgs[type][key] = pair[1];
        delete item[pair[0]];
      }
    });
    // log("context", "Pushing context", contextArgs);

    // recurse
    contextStack.push(contextArgs);
    item[contentsKey] = item[contentsKey].map(applyContext);
    contextStack.pop();
  }

  return item;
}
