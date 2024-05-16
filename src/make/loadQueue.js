const fs = require('fs');
const fsPromises = require('fs/promises');

class LoadQueue {
  constructor(systemName, timeout) {
    this.systemName = systemName;
    this.timeout = timeout;
    this.debug = false;

    this.all = [];
    this.byCategory = {
      walk: [],
      units: [],
      files: [],
      assets: [],
      stylesheets: [],
      javascripts: [],
    };
    // this.byFilename = {};
    // this.loadedData = {};
  }

  category(cat) {
    return this.byCategory[cat];
  }

  // Enqueue a single promise
  // Optionally with a timeout
  enqueue(cat, name, promise) {
    let info = {cat, name, done: false};
    let timeoutValue = this.timeout;

    info.promise = new Promise((resolve, reject) => {
      if (this.debug) log("LoadQueue", "Enqueue: Enacting", cat, name);
      let timeout = null;
      if (timeoutValue) {
        timeout = setTimeout(() => {
          if (info.done) {
            return;
          }
          info.done = true;
          error("LoadQueue", "Enqueue: Timeout!", cat, name);
          resolve();
        }, timeoutValue);
      }

      promise.then((result) => {
        info.done = true;
        if (this.debug) log("LoadQueue", "Enqueue: Done", cat, name);
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
        resolve(result);
      }).catch((x) => {
        if (timeout != null) {
          clearTimeout(timeout);
          timeout = null;
        }
        info.done = true;
        error("LoadQueue", "Enqueue: Error", cat, name, x);
        resolve(x);
      });
    });

    info.then = (fn) => info.promise.then(fn);
    info.catch = (fn) => info.promise.catch(fn);

    this.all.push(info);
    this.byCategory[cat].push(info);
    return info;
  }

  // Load one file, adding to the given queue
  loadFile(cat, relfile, absfile) {
    return this.enqueue(cat, relfile, new Promise((resolve, reject) => {
      fsPromises.readFile(absfile, 'utf-8').then((data) => {
        // this.loadedData[absfile] = callback(data, relfile);
        // log("LoadQueue", "loadFile: resolve", relfile, data);
        resolve({filename: relfile, data});
      }).catch((err) => {
        error("load", "loadFile: Error reading file", cat, absfile, err);
        reject(err);
      });
    }));
  }

  walkDirectory(cat, dir, fnCheck, fnCallback) {
    let self = this;

    function walk(absdir, reldir) {
      if (self.debug) log("load", "Walking...", reldir);
      try {
        let files = fs.readdirSync(absdir, { withFileTypes: true });
        for (let file of files) {
          var absfile = absdir + "/" + file.name;
          var relfile = (reldir == "" ? "" : reldir + "/") + file.name;
          if (file.isDirectory()) {
            walk(absfile, relfile);
          } else {
            if (fnCheck(relfile)) {
              // fnCallback(relfile, absfile);
              self.loadFile(cat, relfile, absfile).then(fnCallback);
            }
          }
        }
      } catch (e) {
        error("load", "Error walking directory", absdir, e);
        return;
      }
    }

    this.enqueue('walk', `${cat}: ${dir}`, new Promise((resolve, reject) => {
      walk(dir, '');
      resolve();
    }));
  }

  readyByCategory(cat) {
    return new Promise((resolve, reject) => {
      let walkPromises = this.byCategory['walk'].map((info) => info.promise);
      // log("LoadQueue", `readyByCategory(${cat}): ${walkPromises.length} walk promises`);
      Promise.allSettled(walkPromises).then(() => {
        let catPromises = this.byCategory[cat].map((info) => info.promise);
        // log("LoadQueue", `readyByCategory(${cat}): ${catPromises.length} promises`);
        Promise.allSettled(catPromises).then(() => {
          resolve();
        }).catch((err) => reject(err));
      }).catch((err) => reject(err));
    })
  }

  readyAll() {
    return new Promise((resolve, reject) => {
      let walkPromises = this.byCategory['walk'].map((info) => info.promise);
      // log("LoadQueue", `readyAll: ${walkPromises.length} walk promises`);
      Promise.allSettled(walkPromises).then(() => {
        let allPromises = this.all.map((info) => info.promise);
        // log("LoadQueue", `readyAll: ${allPromises.length} promises`);
        Promise.allSettled(allPromises).then(() => {
          resolve();
        }).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });
  }

  progress() {
    let unfulfilled = [];
    for (let info of this.all) {
      if (!info.done) {
        unfulfilled.push(info);
      }
    }
    let nfulfilled = this.all.length - unfulfilled.length;
    log("LoadQueue", `Progress ${this.systemName}: ${nfulfilled} of ${this.all.length}`);
  }

  debug() {
    let unfulfilled = [];
    for (let info of this.all) {
      if (!info.done) {
        unfulfilled.push(info);
      }
    }

    if (unfulfilled.length > 0) {
      warn("LoadQueue", `${unfulfilled.length} of ${this.all.length} unfulfilled promises`);
      for (let info of unfulfilled) {
        warn("LoadQueue", " -", info.cat, info.name);
      }
    }
  }
}


module.exports = {
  LoadQueue,
  walkDirectory,
  loadFile,
};
