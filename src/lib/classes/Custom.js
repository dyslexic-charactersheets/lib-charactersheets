import { log, error } from '../log';
import { interpolate, has } from '../util/objects';
import { replaceColours, adjustColour, vibrantColour } from '../util/colours';
import { __ } from '../i18n';
import { PREMIUM, ready as systemsReady } from './System';
import { getSystemStack } from './SystemStack';
import { Instance } from './Instance';
import { Document } from './Document';
import { events } from './Events';


function parseCustom(primary, request) {
  let attr = {
    name: false,
    custom: '',
    theme: 'adventurer',
    language: 'en',

    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,
    printDyslexicFont: 'sans',

    miniSize: 'medium',

    browserTarget: attr.browserTarget,
    printColour: '#707070',
    accentColour: '',
    printIntensity: 0,
    printWatermark: '',
    printLogo: false,
    printPortrait: false,
    animalPortrait: false,
    printBackground: false,

    isNoCalc: attr.browserTarget == "pdf",
    ...primary.attributes
  };

  let custom = {
    units: ['core', 'custom/'+attr.custom, 'theme/' + attr.theme],
    ...attr
  };

  // accessibility options
  if (attr.printLarge) {
    custom.units.push('large-print');
  }
  if (attr.printHighContrast) {
    custom.units.push('high-contrast');
  }
  if (attr.printDyslexic) {
    switch(attr.printDyslexicFont) {
      case 'dyslexie':
        custom.units.push('dyslexie');
        break;
      case 'lexend':
        custom.units.push('lexend');
        break;
      default:
        custom.units.push('dyslexic');
        break;
    }
  }

  // done
  // log("Custom", "Custom data", custom);
  return custom;
}


export class Custom extends Instance {
  constructor(primary, request, registry) {
    super();
    this.registry = registry;
    this.request = request;
    
    this.promise = new Promise((resolve, reject) => {
      systemsReady(() => {
        this.request = request;
        this.data = parseCustom(primary, request);
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
        log("Custom", `Units: ${this.data.units}`);

        systemsReady(() => {
          try {
            const system = getSystemStack(PREMIUM);
            if (system === null) {
              error("Custom", "System not found:", data.game);
              reject();
              return;
            }

            // start with a document
            const documentUnit = system.getUnit("document");
            const document = new Document(system, documentUnit, data.id);
            document.request = this.request;

            // language
            document.language = data.language;
            document.setVar('character-name', data.name);
            document.setVar('description', data.description);

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

            if (data.printPortrait) {
              self.getAsset(data.printPortrait, dataURL => {
                document.portraitURL = dataURL;
              });
            }

            if (data.animalPortrait) {
              self.getAsset(self.data.animalPortrait, dataURL => {
                document.animalURL = dataURL;
              });
            }

            if (data.printBackground) {
              const printBackground = data.printBackground;
              // log("Custom", "Background:", printBackground);
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
              log("Custom", "Browser target", data.browserTarget);
            }

            // TODO set character parameters
            document.printColour = data.printColour;
            document.printIntensity = data.printIntensity;
            document.accentColour = data.accentColour;
            document.watermark = data.printWatermark;

            // get known vars from the data
            // log("Custom", "data", data);
            // knownVars.forEach(varname => {
            //   if (has(data, varname)) {
            //     const key = toKebabCase(varname);
            //     const value = data[varname];
            //     // log("Custom", `Var: ${key} = ${JSON.stringify(value)}`);
            //     document.setVar(key, value, "high");
            //   }
            // });
            // log("Custom", "Document vars", document.vars);

            // load units
            data.units.push("data");
            let units = system.getUnits(data.units);
            units = system.inferUnits(units);
            // log("Custom", "Inferred units:", units.map(unit => unit.id).sort());

            // infer the title from the units
            let title = data.name;
            document.title = title;

            // make the element tree
            units.forEach(unit => document.addUnit(unit));
            document.composeDocument(self.registry);

            self.loadQueue.ready(() => {
              events.emit('createElementTree', {
                elementTree: document.doc,
                title: document.title,
                request: self.request
              });

              // render the document
              const data = document.renderDocument(self.registry);

              events.emit('render', {
                data: data,
                title: document.title,
                mimeType: "text/html",
                request: self.request
              });

              resolve({
                data: data,
                filename: title + ".html",
                mimeType: "text/html"
              });
            });
          } catch (err) {
            error("Custom", "Error:", err);
            reject({
              error: err
            });
          }
        });
      });
    });
  }
}
