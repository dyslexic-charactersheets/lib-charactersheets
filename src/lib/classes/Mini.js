/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { Instance } from './Instance';
import { log, warn, error } from '../log';
import { ready as systemsReady } from './System';
import { getSystemStack } from './SystemStack';
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

function parseMini(primary, request) {
  let attr = {
    name: false,
    game: 'pathfinder2',
    theme: 'adventurer',
    language: 'en',
    
    sheet: 'mini',

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
    units: ['core', 'base', 'option/minis', 'theme/' + attr.theme],
    language: attr.language,
    
    feats: [],
    options: {
      'permission': false,
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
    printPortrait: attr.printPortrait,
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,

    isLoggedIn: attr.isLoggedIn,
    isNoCalc: attr.browserTarget == "pdf",
    debug: primary.debug,
    instances: {},
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
          char.units.push('option/mini/' + option);
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
    log("Mini", "Dyslexic font", attr.printDyslexicFont);
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
  
  const system = getSystemStack(attr.game);
  
  // included assets
  ["printPortrait", "printBackground"].forEach(field => {
    if (attr[field]) {
      let id = attr[field];
      if (isObject(id)) {
        id = id.id;
      }
      log("Mini", "Asset:", field, "=", id);
      const instance = request.getInstance(id);
      if (!isNull(instance)) {
        log("Mini", "Asset known:", field, "=", id);
        char.instances[id] = instance;
      }
    }
  });

  return char;
}

export class Mini extends Instance {
  constructor(primary, request, registry) {
    super();
    this.registry = registry;
    this.request = request;
    
    
    this.promise = new Promise((resolve, reject) => {
      systemsReady(() => {
        this.data = parseMini(primary, request);
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
        // log("Mini", "Render character");
        // log("Mini", `Name: ${this.data.name}, game: ${this.data.game}`);
        log("Mini", `Units: ${this.data.units}`);

        systemsReady(() => {
          try {
            const system = getSystemStack(data.game);
            if (system === null) {
              error("Mini", "System not found:", data.game);
              reject();
              return;
            }

            // start with a document
            const documentUnit = system.getUnit("document");
            const document = new Document(system, documentUnit, data.id);
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

            log("Mini", "Assets");
            if (data.printPortrait) {
              log("Mini", "Portrait", data.printPortrait);
              self.getAsset(data.printPortrait, (dataURL, custom, path) => {
                // log("Mini", "Portrait URL", dataURL);
                document.portraitURL = dataURL;
                if (custom) {
                  document.portraitCopyright = null;
                } else {
                  warn("Mini", "Portrait copyright?", path);
                  document.portraitCopyright = "paizo";
                }
              });
            }

            // if (data.printLogo) {
            //   self.getAsset(data.printLogo, dataURL => {
            //     document.logoURL = dataURL;
            //   });
            // }

            if (data.printBackground) {
              const printBackground = data.printBackground;
              // log("Character", "Background:", printBackground);
              const bgColours = {
                magnolia: '#F4E9D8',
                lilac: '#D3B9E8',
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
              log("Mini", "Browser target", data.browserTarget);
            }

            document.printColour = data.printColour;
            document.printIntensity = data.printIntensity;
            document.accentColour = data.accentColour;
            document.watermark = data.printWatermark;

            log("Mini", "Document colour", document.printColour);

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

            document.title = __("Map Mini");
            document.summary = __("Map Mini");

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
            error("Mini", "Error:", err);
            reject({
              error: err
            });
          }
        });
      });
    });
  }
}
