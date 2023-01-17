import { Instance } from './Instance';
import { isEmpty } from '../util';
import { log, warn, error } from '../log';
import { has } from '../util/objects';
import { ready as systemsReady, getSystem } from './System';
import { replaceColours, vibrantColour } from '../util/colours';
import { Document } from './Document';
import { events } from './Events';

function parseKingdom(primary, request) {
  let attr = {
    name: false,
    ...primary.attributes
  };

  let char = {
    id: primary.id,
    name: attr.name,
    game: attr.game,
    units: ['core', 'base', 'base/kingdom', 'theme/' + attr.theme],
    language: attr.language,
    measurementUnits: attr.units,
    description: attr.description,
    
    feats: [],
    options: {
      'kingdom-funds': false,
      'permission': false,
      'build': false,
    },
  }



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

            // ...
            
            self.loadQueue.ready(() => {
              events.emit('createElementTree', {
                elementTree: document.doc,
                title: document.title,
                summary: summary,
                request: self.request
              });

              // render the document
              const data = document.renderDocument(self.registry);

              events.emit('render', {
                data: data,
                title: document.title,
                summary: summary,
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
