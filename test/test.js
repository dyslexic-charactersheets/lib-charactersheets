var fs = require('fs');

var CharacterSheets = require('../lib/lib-charactersheets.js');
require('../src/make/log.js');

let assetsDir = __dirname+'/in/assets';
CharacterSheets.addAssetsDir(assetsDir);
let translationsPromise = CharacterSheets.loadDefaultTranslations();

// listen to events for debugging
CharacterSheets.on('createElementTree', ({elementTree, title, request}) => {
  let filename = __dirname + '/out/'+title+'.json';
  fs.writeFile(filename, JSON.stringify(elementTree, null, 2), (err) => {
    if (err)
      error("Character", "Could not write JSON file:", err);
  });
});

CharacterSheets.on('error', err => {
  error("test", "onError", err);
});

function saveResult(result) {
  if (Array.isArray(result)) {
    log("test", `Array of ${result.length} results`);
    result.forEach(saveResult);
    return;
  }
  
  if (result.err) {
    error("test", result.err);
    return;
  }

  var outfile = __dirname+'/out/'+result.filename;
  log("test", "Writing:", outfile);
  fs.writeFile(outfile, result.data, (err) => {
    if (!!err)
      error("test", err);
    log("test", "OK");
  });
}

// do it!
let indir = __dirname+'/in';
fs.readdir(indir, 'utf-8', (err, files) => {
  if (err) {
    console.log("ERROR:", err);
    return;
  }
  files.forEach(file => {
    if (!file.match(/\.json$/)) {
      return;
    }

    let filename = indir+'/'+file;
    log("test", "Reading", filename);
    
    fs.readFile(filename, 'utf-8', (err, fileData) => {
      if (err) {
        console.log(file, "ERROR:", err);
        return;
      }
      // console.log("FILE:", fileData);
      let data = JSON.parse(fileData);
      
      translationsPromise.then(() => {
        CharacterSheets.create(data).then(characterSheet => {
          if (characterSheet === null) {
            warn("test", "Skipping character");
            return;
          }
          saveResult(characterSheet);
        })
      });
    });
  });
});
