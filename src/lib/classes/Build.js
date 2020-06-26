import { log, error } from '../log';
import { adjustColour } from '../util/colours';
import { ready as systemsReady, getSystem } from './System';
import { Document } from './Document';
import { LoadQueue } from './LoadQueue';


export class Build {
  constructor(primary, request, registry) {
    let attr = {
      game: 'pathfinder2',
      theme: 'adventurer',
      language: 'en',
      ...primary.attributes
    };

    this.data = {
      game: attr.game,
      units: ['core', 'option/build', 'theme/' + attr.theme],
      language: attr.language,
    };

    this.registry = registry;
    this.request = request;
    this.loadQueue = new LoadQueue();
  }

  render() {
    return new Promise((resolve, reject) => {
      systemsReady(() => {
        try {
          log("Build", "Data", this.data);
          const system = getSystem(this.data.game);

          const documentUnit = system.getUnit("document");
          const document = new Document(documentUnit);
          document.language = this.data.language;
          
          let units = system.getUnits(this.data.units);
          units = system.inferUnits(units);
          log("Build", "Units", units.map(unit => unit.name));
          units.forEach(unit => document.addUnit(unit));
          document.composeDocument(this.registry);
          
          document.title = "Build a character";
          // log("Build", "Document", document);

          // render the document
          const data = document.renderDocument(this.registry);
          resolve({
            data: data,
            filename: document.title + ".html",
            mimeType: "text/html"
          });
        } catch (err) {
          error("Build", "Error:", err);
          reject({
            error: err
          });
        }
      });
    });
  }
}
