require('colors');

export function log(area, message, ...args) {
  const prefix = `[${area}] `.padEnd(16).cyan;
  console.log(`${prefix}${message}`, ...args);
}

export function warn(area, message, ...args) {
  const prefix = `[${area}] `.padEnd(16).yellow;
  console.log(`${prefix}${message}`, ...args);
}

export function error(area, message, ...args) {
  const prefix = `[${area}] `.padEnd(16).red.bold;
  console.log(`${prefix}${message}`, ...args);
}

export function trace(registry, area, message, ...args) {
  // log("log", "Registry", registry);
  const prefix = `[${area}] `.padEnd(16).yellow;
  const trace = JSON.stringify(registry.stack, function (key, value) {
    if (value === undefined) {
      return '<undefined>';
    }
    return value;
  });
  console.log(`${prefix}${trace}\n                ${message}`, ...args);
}
