import { Instance } from './Instance';
import { log, warn, error } from '../log';
import { ready as systemsReady, getSystem } from './System';
import { replaceColours, vibrantColour, adjustColour } from '../util/colours';
import { __ } from '../i18n';
import { Document } from './Document';
import { events } from './Events';

import { isString, isObject, isNull, isArray, isEmpty } from '../util';
import { toKebabCase, toCamelCase, toPathCase, toSpaceCase, toTitleCase } from '../util/strings';
import { has } from '../util/objects';

const knownVars = [
  "language",
];

function parseKingdom(primary, request) {
  let attr = {
    name: false,
    game: 'pathfinder2',
    theme: 'adventurer',
    language: 'en',
    
    sheet: 'kingdom',

    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,
    printDyslexicFont: 'sans',

    printColour: '#707070',
    accentColour: '',
    printIntensity: 0,
    printWatermark: '',
    printLogo: false,
    printBackground: false,

    isLoggedIn: false,
    isNoCalc: false,
    ...primary.attributes
  };

  let char = {
    id: primary.id,
    name: attr.name,
    game: attr.game,
    sheet: attr.sheet,
    units: ['core', 'base', 'theme/' + attr.theme],
    language: attr.language,
    
    feats: [],
    options: {
      'kingdom-funds': false,
      'permission': false,
      'build': false,
    },

    browserTarget: attr.browserTarget,
    printLarge: attr.printLarge,
    printHighContrast: attr.printHighContrast,
    printDyslexic: attr.printDyslexic,
    printDyslexicFont: attr.printDyslexicFont,

    printColour: attr.printColour,
    accentColour: attr.accentColour,
    printIntensity: attr.printIntensity,
    printLogo: attr.printLogo,
    favicon: 'favicon.svg',
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,

    isLoggedIn: attr.isLoggedIn,
    isNoCalc: attr.browserTarget == "pdf",
    debug: primary.debug,
    instances: {},
  }

  switch (char.sheet) {
    case 'kingdom':
      char.units.push('base/kingdom', 'option/kingdom-action-reference');
      break;

    case 'settlement':
      char.units.push('base/settlement');
      break;

    case 'army':
      char.units.push('base/army');
      break;
  }

  // log("Kingdom", "Print colour", char.printColour, char.accentColour);
  // log("Kingdom", "Print intensity", char.printIntensity);
  if (isEmpty(char.accentColour)) {
    char.accentColour = adjustColour('#707070', char.printColour, char.printIntensity);
  }
  
  // get all the flags
  Object.keys(attr).forEach(key => {
    let flag = toKebabCase(key);

    if (flag.match(/^option-/)) {
      let option = flag.replace(/^option-/, '');
      let ok = char.options[option] = !!attr[key];
      // log("Kingdom", "Option", option, ok);
      if (ok) {
        if (['permission'].includes(option)) {
          char.units.push('option/'+option);
        } else {
          char.units.push('option/kingdom/' + option);
        }
      }
    }
  });

  // accessibility options
  if (attr.printLarge) {
    char.units.push('large-print');
  }
  if (attr.printHighContrast) {
    char.units.push('high-contrast');
  }
  if (attr.printDyslexic) {
    log("Character", "Dyslexic font", attr.printDyslexicFont);
    switch(attr.printDyslexicFont) {
      case 'dyslexie':
        char.units.push('dyslexie');
        break;
      case 'lexend':
        char.units.push('lexend');
        break;
      default:
        char.units.push('dyslexic');
        break;
    }
  }
  
  const system = getSystem(attr.game);
  
  // included assets
  ["printLogo", "printBackground"].forEach(field => {
    if (attr[field]) {
      const id = attr[field];
      // log("Character", "Asset:", field, "=", id);
      const instance = request.getInstance(id);
      if (!isNull(instance)) {
        // log("Character", "Asset known:", field, "=", id);
        char.instances[id] = instance.attributes;
      }
    }
  });

  return char;
}

export class Kingdom extends Instance {
  constructor(primary, request, registry) {
    super();
    this.registry = registry;
    this.request = request;
    
    
    this.promise = new Promise((resolve, reject) => {
      systemsReady(() => {
        this.data = parseKingdom(primary, request);
        this.data.units = [...this.data.units, ...this.getDataUnits(this.data.isLoggedIn, this.data.isNoCalc)];
        resolve(this.data);
      });
    });
  }

  /**
   * Turn this request into a real character sheet.
   * @returns {Promise} Promise representing the resulting character sheet.
   */
  render() {
    const self = this;
    // const data = this.data;
    const promise = this.promise;
    return new Promise((resolve, reject) => {
      promise.then((data) => {
        // log("Character", "Render character");
        // log("Character", `Name: ${this.data.name}, game: ${this.data.game}`);
        log("Character", `Units: ${this.data.units}`);

        systemsReady(() => {
          try {
            const system = getSystem(data.game);
            if (system === null) {
              error("Character", "System not found:", data.game);
              reject();
              return;
            }

            // start with a document
            const documentUnit = system.getUnit("document");
            const document = new Document(documentUnit, data.id);
            document.request = this.request;

            // language
            document.language = data.language;
              
            if (data.printLarge) {
              document.largePrint = true;
            }
            if (data.printHighContrast) {
              document.highContrast = true;
            }
            if (data.printDyslexic && (data.printDyslexicFont == 'dyslexie' || data.printDyslexicFont == 'lexend')) {
              document.skipOptional = true;
            }
            
            // Load assets
            if (data.favicon) {
              self.getAsset(data.favicon, dataURL => {
                if (data.favicon.match(/\.svg$/) && !isEmpty(data.printColour)) {
                  let colour = vibrantColour(data.printColour);
                  dataURL = replaceColours(dataURL, colour);
                }
                document.faviconURL = dataURL;
              });
            }

            if (data.printLogo) {
              self.getAsset(data.printLogo, dataURL => {
                document.logoURL = dataURL;
              });
            }

            if (data.printBackground) {
              const printBackground = data.printBackground;
              // log("Character", "Background:", printBackground);
              const bgColours = {
                magnolia: '#F4E9D8',
              };
              if (has(bgColours, printBackground)) {
                document.backgroundColour = bgColours[printBackground];
              } else if (printBackground.match(/(#[A-Za-z0-9]{6}|rgb\([0-9]+,[0-9]+,[0-9]+\))/)) {
                document.backgroundColour = printBackground;
              } else {
                self.getAsset(printBackground, dataURL => {
                  document.backgroundURL = dataURL;
                });
              }
            }

            // set target
            if (has(data, "browserTarget") && data.browserTarget) {
              document.browserTarget = data.browserTarget;
              log("Character", "Browser target", data.browserTarget);
            }

            document.printColour = data.printColour;
            document.printIntensity = data.printIntensity;
            document.accentColour = data.accentColour;
            document.watermark = data.printWatermark;

            log("Kingdom", "Document colour", document.printColour);

            // get known vars from the data
            knownVars.forEach(varname => {
              if (has(data, varname)) {
                const key = toKebabCase(varname);
                const value = data[varname];
                // log("Character", `Var: ${key} = ${JSON.stringify(value)}`);
                document.setVar(key, value, "high");
              }
            });

            // load units
            document.isLoggedIn = data.isLoggedIn;
            document.isNoCalc = data.isNoCalc;
            let units = system.getUnits(data.units);
            units = system.inferUnits(units);

            document.title = __("Kingdom");
            document.summary = __("Kingdom");

            // make the element tree
            units.forEach(unit => document.addUnit(unit));
            document.composeDocument(self.registry);
            
            self.loadQueue.ready(() => {
              events.emit('createElementTree', {
                elementTree: document.doc,
                title: document.title,
                summary: document.summary,
                request: self.request
              });

              // render the document
              const data = document.renderDocument(self.registry);

              events.emit('render', {
                data: data,
                title: document.title,
                summary: document.summary,
                mimeType: "text/html",
                request: self.request
              });

              resolve({
                data: data,
                filename: document.title + ".html",
                mimeType: "text/html"
              });
            });
          } catch (err) {
            error("Character", "Error:", err);
            reject({
              error: err
            });
          }
        });
      });
    });
  }
}
