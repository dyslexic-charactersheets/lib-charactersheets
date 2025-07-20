'use strict';

const fs = require('fs');

const { has } = require('./util.js');

let allPromises = [];

class LoadQueue {
  constructor() {
    this._promises = [];
    this._byFilename = {};
    this._data = {};
  }

  // callback(resolve, reject)
  run(callback) {
    var promise = new Promise((resolve, reject) => {
      try {
        callback();
        resolve();
      } catch (e) {
        error("loadQueue", "Error", e);
        reject(e);
      }
    });
    this._promises.push(promise);
    allPromises.push(promise);
    return promise;
  }

  // callback(resolve, reject)
  enqueue(filename, callback) {
    var promise = new Promise((resolve, reject) => {
      try {
        callback(resolve, reject);
      } catch (e) {
        error("loadQueue", "Error", e);
        reject(e);
      }
    });
    this._byFilename[filename] = promise;
    this._promises.push(promise);
    allPromises.push(promise);
    return promise;
  }

  // callback(data, filename)
  loadItem(filename, callback) {
    var d = this._data;
    if (has(this._byFilename, filename)) {
      this.readyItem(filename, callback);
      return;
    }

    // Actually load a file
    var promise = new Promise((resolve, reject) => {
      var encoding = 'utf-8';
      if (filename.match(/\.(png|jpg|jpeg)$/)) encoding = 'binary';
      fs.readFile(filename, encoding, function (err, data) {
        if (err) {
          if (err.code == 'ENOENT') {
            error("load", "No such file", filename);
            reject();
            return;
          }
          error("load", "Error loading file", filename);
          reject();
          return;
        }
        d[filename] = data;
        if (callback !== null) {
          log("load", "Loaded", filename);
          callback(data, filename);
          resolve();
        }
      });
    });

    this._byFilename[filename] = promise;
    this._promises.push(promise);
    allPromises.push(promise);
    return promise;
  }

  // callback(file, rel)
  walkDirectory(dir, test, callback) {
    let promises = this._promises;
    let byFilename = this._byFilename;
    let loadedData = this._data;

    function loadFile(absfile, relfile) {
      let filePromise = new Promise((resolve, reject) => {
        fs.readFile(absfile, 'utf-8', (err, data) => {
          // log("load", "Walking file...", reldir);
          if (err) {
            error("load", "Error reading file", absfile, error);
            reject();
            return;
          }

          loadedData[absfile] = callback(data, relfile);
          resolve();
        })
      });
      promises.push(filePromise);
      byFilename[relfile] = filePromise;
      allPromises.push(filePromise);
    }

    return this.run(() => {
      function walk(absdir, reldir) {
        // log("load", "Walking...", reldir);
        try {
          let files = fs.readdirSync(absdir, { withFileTypes: true });
          for (let file of files) {
            var absfile = absdir + "/" + file.name;
            var relfile = (reldir == "" ? "" : reldir + "/") + file.name;
            if (file.isDirectory()) {
              walk(absfile, relfile);
            } else {
              if (test(relfile)) {
                loadFile(absfile, relfile);
              }
            }
          }
        } catch (e) {
          error("load", "Error walking directory", absdir, e);
          return;
        }
      };

      // log("load", "Walking dir:", dir);
      walk(dir, '');
    });
  }

  readyItem(filename, callback) {
    if (has(this._data, filename)) {
      callback(this._data[filename]);
    }
    if (has(this._byFilename, filename)) {
      this._byFilename[filename].then(callback).catch((x) => {
        error("loadQueue", "Error ready item", x, x.stack);
      });
    }
  }

  getItem(filename) {
    if (has(this._data, filename)) {
      return this._data[filename];
    }
  }

  ready(callback) {
    Promise.all(this._promises).then(() => {
      Promise.all(this._promises).then(callback).catch(err => {
        error("loadQueue", "Queue error", err, err.stack);
      });
    }).catch((x) => {
      error("loadQueue", "Queue error", x, x.stack);
    });
  }
}

const files = new LoadQueue();
const assets = new LoadQueue();
const stylesheets = new LoadQueue();
const javascripts = new LoadQueue();
const units = new LoadQueue();

module.exports = {
  LoadQueue,
  files,
  assets,
  stylesheets,
  javascripts,
  units,
  count: () => allPromises.length,
  ready: (callback) => {
    error("loadQueue", "Ready 1", allPromises.length);
    Promise.all(allPromises).then(() => {
      error("loadQueue", "Ready 2", allPromises.length);
      Promise.all(allPromises).then(() => {
        error("loadQueue", "Ready 3", allPromises.length);
        callback();
      }).catch(err => {
        error("loadQueue", "Queue error:", err, err.stack);
      });
    }).catch((x) => {
      error("loadQueue", "Queue error:", err, err.stack);
    });
  }
}

