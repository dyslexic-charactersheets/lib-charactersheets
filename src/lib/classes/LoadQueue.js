const fs = require('fs');

export class LoadQueue {
  constructor() {
    this.promises = [];
  }

  loadFile(filename) {
    var promise = new Promise((resolve, reject) => {
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
    if (filename.match(/\.(png|jpg|jpeg)$/)) {
      filename = filename + ".base64";
    }
    return this.loadFile(filename);
  }

  ready(callback) {
    Promise.all(this.promises).then(callback).catch(err => {
      error("load", "Queue error", err, err.stack);
    });
  }
}
