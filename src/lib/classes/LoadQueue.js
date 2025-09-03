/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

const fs = require('fs');

import { log, error } from '../log';

export class LoadQueue {
  constructor() {
    this.promises = [];
  }

  loadFile(filename) {
    const promise = new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
          if (err.code == 'ENOENT') {
            warn("LoadQueue", "No such file", filename);
            reject();
            return;
          }

          error("LoadQueue", "Error loading file", filename);
          reject();
          return;
        }
        resolve(data);
      });
    });

    this.promises.push(promise);
    return promise;
  }

  loadEmbed(filename) {
    if (filename.match(/\.(png|jpg|jpeg|webp)$/)) {
      filename = filename + ".base64";
    }
    return this.loadFile(filename);
  }

  ready(callback) {
    Promise.all(this.promises).then(callback).catch(err => {
      error("LoadQueue", "Queue error:", err, "@", err.stack);
    });
  }
}
