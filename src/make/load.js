const fs = require('fs');
const fsPromises = require('fs/promises');

/**
 * Walk through the files in a director
 * @param {Wa} cat 
 * @param {*} dir 
 * @param {*} fnCheck 
 * @param {*} fnCallback 
 */
async function walkDirectory(dir, fnCheck, fnCallback) {
  let promises = [];

  function walk(absdir, reldir) {
    // if (self.debug) log("load", "Walking...", reldir);
    try {
      let files = fs.readdirSync(absdir, { withFileTypes: true });
      for (let file of files) {
        var absfile = absdir + "/" + file.name;
        var relfile = (reldir == "" ? "" : reldir + "/") + file.name;
        if (file.isDirectory()) {
          walk(absfile, relfile);
        } else {
          if (fnCheck(relfile)) {
            let callbackPromise = fnCallback(relfile, absfile);
            if (callbackPromise !== null) {
              promises.push(callbackPromise);
            }
            // self.loadFile(cat, relfile, absfile).then(fnCallback);
          }
        }
      }
    } catch (e) {
      error("load", "Error walking directory", absdir, e);
      return;
    }
  }

  walk(dir, '');

  await Promise.allSettled(promises);
}

async function loadFile(absfile) {
  return fsPromises.readFile(absfile, 'utf-8');
}

async function loadRawFile(absfile) {
  return fsPromises.readFile(absfile);
}

module.exports = {
  walkDirectory,
  loadFile,
  loadRawFile,
};
