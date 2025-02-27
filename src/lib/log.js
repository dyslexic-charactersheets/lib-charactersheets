require('colors');

const INDENT = 16;

export function log(area, message, ...args) {
  const prefix = `[${area}] `.padEnd(INDENT).cyan;
  console.log(`${prefix}${message}`, ...args);
}

export function warn(area, message, ...args) {
  const prefix = `[${area}] `.padEnd(INDENT).yellow;
  console.log(`${prefix}${message}`, ...args);
}

export function error(area, message, ...args) {
  const prefix = `[${area}] `.padEnd(INDENT).red.bold;
  console.log(`${prefix}${message}`, ...args);
}

export function trace(registry, document, area, message, ...args) {
  // log("log", "Registry", registry);
  const prefix = `[${area}] `.padEnd(INDENT).yellow;
  let name = document.title;
  let system = document.system.name;
  const trace = JSON.stringify(registry.stack, function (key, value) {
    if (value === undefined) {
      return '<undefined>';
    }
    return value;
  });
  console.log(`${prefix}${name} (${system})\n                ${trace}\n                ${message}`, ...args);
}

export function stackTrace() {
  var err = new Error();
  console.log(err.stack);
}
