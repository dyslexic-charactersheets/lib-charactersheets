/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

export function chunk(array, size) {
  let chunks = [];
  for (var i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
