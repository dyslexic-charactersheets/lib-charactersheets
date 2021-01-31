import { Instance } from './Instance';
import { isEmpty } from '../util';
import { log, warn } from '../log';
import { has } from '../util/objects';
import { ready as systemsReady, getSystem } from './System';
import { replaceColours, adjustColour, vibrantColour } from '../util/colours';
import { Document } from './Document';
import { events } from './Events';

export class GM_Instance extends Instance {
  constructor(request, registry) {
    super();
    this.registry = registry;
    this.request = request;
  }

  render() {
    const self = this;
    const data = this.data;
    return new Promise((resolve, reject) => {
      log("GM", `Units: ${this.data.units}`);

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

          // language
          document.language = data.language;
          
          if (data.printLarge) {
            document.largePrint = true;
          }
          if (data.printHighContrast) {
            document.highContrast = true;
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
          
          if (data.printBackground) {
            const printBackground = data.printBackground;
            // log("GM", "Background:", printBackground);
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

          // TODO set character parameters
          document.printColour = data.printColour;
          document.printIntensity = data.printIntensity;
          document.accentColour = data.accentColour;
          document.watermark = data.printWatermark;
          
          self.completeDocument(document);
          
          let units = system.getUnits(data.units);
          units = system.inferUnits(units);
          
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
              filename: document.title+".html",
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
  }
}
