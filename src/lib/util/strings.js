/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isString } from '../util';

// Convert string case
function splitAnyCase(str) {
  if (!isString(str)) {
    warn("util", "Not a string", str);
    return [];
  }
  let words = str.split(/[ _/-]+/);
  words = words.flatMap(word => word.split(/([A-Z][a-z]+)/));
  words = words.map(word => word.toLowerCase());
  words = words.filter(word => word != '');
  return words;
}

export function toKebabCase(str) {
  // convert-a-string-to-kebab-case
  const words = splitAnyCase(str);
  return words.join('-');
}

export function toCamelCase(str) {
  // convertAStringToCamelCase
  let words = splitAnyCase(str);
  words = words.map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  words[0] = words[0].toLowerCase();
  return words.join('');
}

export function toPathCase(str) {
  // convert/a/string/to/path/case
  const words = splitAnyCase(str);
  return words.join('/');
}

export function toSpaceCase(str) {
  // convert a string to space case
  const words = splitAnyCase(str);
  return words.join(' ');
}

export function toTitleCase(str) {
  // Convert A String To Title Case
  let words = str.split(' ');
  words = words.map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  return words.join(' ');
}
