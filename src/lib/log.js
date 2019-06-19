require('colors');

export function log(area, message, ...args) {
    var prefix = `[${area}] `.padEnd(16).cyan;
    console.log(`${prefix}${message}`, ...args);
}

export function warn(area, message, ...args) {
    var prefix = `[${area}] `.padEnd(16).yellow;
    console.log(`${prefix}${message}`, ...args);
}

export function error(area, message, ...args) {
    var prefix = `[${area}] `.padEnd(16).red.bold;
    console.log(`${prefix}${message}`, ...args);
}