var fs = require('fs');

var CharacterSheets = require('../lib/lib-charactersheets.js');
require('../src/make/log.js');

CharacterSheets.on('error', err => {
  error("test", "onError", err);
});

var translationsPromise = CharacterSheets.loadDefaultTranslations();

// Util functions

function uniq(array) {
  return Array.from(new Set(array));
}

function isNull(val) {
  return val === null || val === undefined;
}

function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

function isArray(val) {
  return Array.isArray(val);
}

function isObject(val) {
  return val instanceof Object;
}

function has(container, property) {
  if (isNull(container)) return false;
  return Object.prototype.hasOwnProperty.call(container, property) && !isNull(container[property]);
}

function cloneDeep(original) {
  if (isNull(original)) {
    return null;
  }

  if (isArray(original)) {
    return original.map(o => cloneDeep(o));
  }

  if (isObject(original)) {
    let product = {};
    Object.keys(original).forEach(key => {
      product[cloneDeep(key)] = cloneDeep(original[key]);
    });
    return product;
  }

  return original;
}

// Character creation
var systems = ["pathfinder2"];
var languages = ["it", "es", "pl", "de", "fr", "pt", "pt-BR", "ru"];
// var languages = ["it"];

systems.forEach(system => {
  languages.forEach(lang => {
    var outdir = __dirname + '/out/i18n/' + system + "/" + lang;
    fs.mkdir(outdir, { recursive: true }, (err) => {
      if (err) {
        console.log("ERROR making dir:", err);
      }
    });
  })
});

let queue = [];

function makeCharacter(system, data, name) {
  Promise.all(queue).then(() => {
    var base = {
      version: 0,
      data: {
        type: "character",
        attributes: {
          game: system,
          name: "",
        }
      }
    };

    base.data.attributes = { ...base.data.attributes, ...data };

    translationsPromise.then(() => {
      languages.forEach(lang => {
        let promise = new Promise((resolve, reject) => {
          var outfile = __dirname + '/out/i18n/' + system + "/" + lang + "/" + name + ".html";

          var char = cloneDeep(base);
          char.data.attributes.language = lang;
          CharacterSheets.create(char).then(characterSheet => {
            if (characterSheet.err) {
              console.log("Error creating character:", characterSheet.err);
              return;
            }
            log("test", "Writing:", system, lang, name, data, `${characterSheet.data.length} bytes`);
            fs.writeFile(outfile, characterSheet.data, (err) => {
              if (!!err)
                console.log("Error writing:", err);
              resolve();
            });
          });
        });

        queue.push(promise);
      });
    });
  });
}

systems.forEach(system => {
  CharacterSheets.getFormData(system).then(formdata => {
    var numTests = 0;
    log("i18n", "Form data", system, uniq(formdata.selects.map(s => s.select)).sort());

    var selects = {};
    formdata.selects.forEach(sel => {
      selects[sel.select] = sel;
    });

    ['ancestry', 'background', 'class', 'archetype'].forEach(keySelect => {
      if (has(selects, keySelect)) {
        var select = selects[keySelect];

        select.values.forEach(val => {
          // log("i18n", "Key select", keySelect, val);
          if (has(val, "options")) {
            error("i18n", "OPTION", val);
          }

          var char = {};
          char[keySelect] = val.code;

          var keyName = val.name.replace(/_\{(.*?)\}/g, '$1');
          makeCharacter(system, char, keyName);
          numTests++;

          val.selects.forEach(subSelect => {
            if (has(selects, subSelect)) {
              var subsel = selects[subSelect];

              subsel.values.forEach(subVal => {
                // log("i18n", "Sub select", subSelect, subVal);

                var char = {};
                char[keySelect] = val.code;
                char[subSelect] = subVal.code;

                var subName = subVal.name.replace(/_\{(.*?)\}/g, '$1');
                makeCharacter(system, char, `${keyName} - ${subName}`);
                numTests++;
              })
            }
          });
        });
      }
    });

    log("test", "TOTAL", system, numTests);
  });
});
