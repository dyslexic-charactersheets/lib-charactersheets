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

// Convert string case
function splitAnyCase(str) {
  if (!isString(str)) {
    warn("util", "Not a string", str);
    return [];
  }
  var words = str.split(/[ _/-]+/);
  words = words.flatMap(word => word.split(/([A-Z][a-z]+)/));
  words = words.map(word => word.toLowerCase());
  words = words.filter(word => word != '');
  return words;
}

function toCamelCase(str) {
  // convertAStringToCamelCase
  var words = splitAnyCase(str);
  words = words.map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  words[0] = words[0].toLowerCase();
  return words.join('');
}

function toTitleCase(str) {
  // Convert A String To Title Case
  var words = str.split(' ');
  words = words.map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  return words.join(' ');
}

// Character creation
var systems = ["pathfinder2"];
// var languages = ["it", "es", "pl", "de", "fr", "pt", "pt-BR", "ru"];
var languages = ["fr"];

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
        let prefix = toTitleCase(keySelect);
        if (keySelect == 'archetype') {
          keySelect = 'archetypes';
        }

        select.values.forEach(val => {
          // log("i18n", "Key select", keySelect, val);
          if (has(val, "options")) {
            error("i18n", "OPTION", val);
          }

          var char = {};
          if (keySelect == 'archetypes') {
            char[keySelect] = [val.id];
          } else {
            char[keySelect] = val.id;
          }

          var keyName = val.name.replace(/_\{(.*?)\}/g, '$1');
          makeCharacter(system, char, `${prefix} - ${keyName}`);
          numTests++;

          if (has(val, "selects")) {
            val.selects.forEach(subSelect => {
              if (has(selects, subSelect)) {
                var subsel = selects[subSelect];

                var subKey = toCamelCase(subSelect);
                if (subSelect.match(/^heritage\//)) {
                  subKey = "heritage";
                } else if (keySelect == "class") {
                  subKey = toCamelCase("class "+subSelect);
                }

                subsel.values.forEach(subVal => {
                  // log("i18n", "Sub select", subSelect, subVal);

                  var char = {};
                  if (keySelect == 'archetypes') {
                    char[keySelect] = [val.id];
                  } else {
                    char[keySelect] = val.id;
                  }
                  char[subKey] = subVal.id;

                  var subName = subVal.name.replace(/_\{(.*?)\}/g, '$1');
                  log("i18n", "Sub char", char);
                  makeCharacter(system, char, `${prefix} - ${keyName} - ${subName}`);
                  numTests++;
                });
              }
            });
          }
        });
      }
    });

    log("test", "TOTAL", system, numTests);
  });
});
