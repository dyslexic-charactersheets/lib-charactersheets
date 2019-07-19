import { log, error } from '../log';
import { ready as systemsReady, getSystem } from './System';
import { Document } from './Document';
import { LoadQueue } from './LoadQueue';
import { Events } from './Events';

// import { applyContext } from '../context';
import { locateAsset, toDataURL } from '../data';
import { toKebabCase, toCamelCase, toPathCase, toSpaceCase, toTitleCase } from '../util';

function parseCharacter(primary) {
  // attributes
  let attr = Object.assign({
    name: false,
    game: 'pathfinder2',
    theme: 'pathfinder',
    language: 'en',

    ancestry: false,
    heritage: false,
    background: false,
    class: false,
    archetypes: false,

    printColour: '#707070',
    accentColour: '#707070',
    printWatermark: '',
    printLogo: false,
    printPortrait: false,
    animalPortrait: false,
    printBackground: false
  }, primary.attributes);

  // an object to start with
  let char = {
    name: attr.name,
    game: attr.game,
    units: ['core', 'base', 'theme/' + attr.theme],
    language: attr.language,
    classes: [],
    archetypes: [],
    options: {
      'animal-companion': false,
      'party-funds': false,
      'permission': false,
      'build': false,
      'mini': false,
      'spellbook': false
    },
    spellbookStyle: 'normal',
    miniSize: 'medium',
    printColour: attr.printColour,
    accentColour: attr.accentColour,
    printLogo: attr.printLogo,
    favicon: 'favicon16.png',
    printPortrait: attr.printPortrait,
    animalPortrait: attr.animalPortrait,
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,
  };

  // get all the flags
  Object.keys(attr).forEach(key => {
    if (key.match(/^option/)) {
      let flag = toKebabCase(key.replace(/^option/, ''));
      // log("Character", "Option", flag, attr[key]);
      let ok = char.options[flag] = !!attr[key];
      if (ok)
        char.units.push('option/' + flag);
    }
  });

  // game-specific settings
  switch (attr.game) {
    case 'pathfinder2':
      if (attr.ancestry) {
        char.units.push('ancestry/' + attr.ancestry.replace(/^ancestry-/, ''));
        char.ancestry = attr.ancestry.replace(/^ancestry-/, '');
      }

      if (attr.heritage)
        char.units.push('heritage/' + attr.heritage.replace(/^heritage-/, ''));

      if (attr.ancestryFeats) {
        char.ancestryFeats = parseFeats(attr.ancestryFeats);
      }

      if (attr.background)
        char.units.push('background/' + attr.background.replace(/^background-/, ''));

      if (attr.class) {
        char.units.push('class/' + attr.class.replace(/^class-/, ''));
        char.classes.push(attr.class.replace(/^class-/, ''));
        let cls = toCamelCase('class ' + char.class);

        let classFeatsKey = cls + 'Feats';
        if (attr[classFeatsKey]) {
          char.classFeats = parseFeats(attr[classFeatsKey]);
        }

        Object.keys(attr).forEach(key => {
          // log("Character", key);
          // let value = attr[key];

          if (key.startsWith(cls) && !key.endsWith('Feats')) {
            let selname = key.replace(cls, '');
            // log("Character", "Class option", key, selname, attr[key]);
            char.units.push('select/' + char.class + '/' + toKebabCase(selname) + '/' + toKebabCase(attr[key]));
          }
        });
      }

      if (attr.archetypes) {
        attr.archetypes.forEach(archetype => {
          char.archetypes.push(archetype);
          char.units.push('archetype/'+archetype);
        });
      }

      if (attr.feats) {
        char.feats = parseFeats(attr.feats);
      }

      if (attr.skillFeats) {
        char.skillFeats = parseFeats(attr.skillFeats);
      }

      break;
  }

  // log("Character", "Parsed", char);
  return char;
}

function parseFeats(feats) {
  return feats;
}


export class Character {
  constructor(primary, request, registry) {
    this.registry = registry;
    this.request = request;
    this.data = parseCharacter(primary, request);
  }

  render(callback) {
    var self = this;
    // log("Character", "Render character");
    // log("Character", `Name: ${this.data.name}, game: ${this.data.game}`);
    // log("Character", `Units: ${this.data.units}`);

    systemsReady(() => {
      try {
        var system = getSystem(this.data.game);
        if (system === null) {
          error("Character", "System not found:", this.data.game);
          return;
        }

        // start with a document
        var documentUnit = system.getUnit("document");
        var document = new Document(documentUnit);

        // TODO get title parts from inside units
        var titleParts = [];
        if (this.data.ancestry) {
          titleParts.push(toTitleCase(this.data.ancestry));
        }
        this.data.classes.forEach(cls => {
          titleParts.push(toTitleCase(cls));
        });
        this.data.archetypes.forEach(archetype => {
          titleParts.push(toTitleCase(archetype))
        });

        var title = titleParts.join(" ");
        if (this.data.name) {
          title = `${this.data.name}, ${title}`;
        }
        document.title = title;

        // Load assets
        var loadQueue = new LoadQueue();
        if (this.data.favicon) {
          locateAsset(this.data.favicon, faviconFile => {
            loadQueue.loadEmbed(faviconFile).then(data => {
              document.faviconURL = toDataURL(data, this.data.favicon);
            });
          });
        }

        if (this.data.printLogo) {
          locateAsset(this.data.printLogo, logoFile => {
            loadQueue.loadEmbed(logoFile).then(data => {
              document.logoURL = toDataURL(data, this.data.printLogo);
            });
          });
        }

        if (this.data.printPortrait) {
          locateAsset(this.data.printPortrait, portraitFile => {
            loadQueue.loadEmbed(portraitFile).then(data => {
              document.portraitURL = toDataURL(data, this.data.printPortrait);
            });
          });
        }

        if (this.data.animalPortrait) {
          locateAsset(this.data.animalPortrait, animalPortraitFile => {
            loadQueue.loadEmbed(animalPortraitFile).then(data => {
              document.animalURL = toDataURL(data, this.data.animalPortrait);
            });
          });
        }

        if (this.data.printBackground) {
          locateAsset(this.data.printBackground, backgroundFile => {
            loadQueue.loadEmbed(backgroundFile).then(data => {
              document.backgroundURL = toDataURL(data, this.data.printBackground);
            });
          });
        }

        // TODO set character parameters
        document.printColour = this.data.printColour;
        document.accentColour = this.data.accentColour;
        document.watermark = this.data.printWatermark;

        // load units
        var units = system.getUnits(this.data.units);

        // infer required units (to a finite depth)
        var more = true;
        for (var i = 0; more && i < 10; i++) {
          more = false;
          // log("Character", "Checking for required units");
          var moreunits = [];
          var unitIds = units.map(unit => unit.id);
          units.forEach(unit => {
            if (unit.hasOwnProperty("require")) {
              unit.require.forEach(req => {
                // log("Character", `Unit ${unit.id} requires`, req);
                // check if the new unit is really new
                if (unitIds.includes(req.unit))
                  return;

                // check if the new unit has dependencies on other units
                if (req.hasOwnProperty("with")) {
                  if (!unitIds.includes(req.with))
                    return;
                }

                var newunit = system.getUnit(req.unit);
                moreunits.push(newunit);
                more = true; // let's do this again
              });
            }
          });
          units = units.concat(moreunits);
        }

        // make the element tree
        units.forEach(unit => document.addUnit(unit));
        document.composeDocument(this.registry);

        loadQueue.ready(() => {
          log("Character", "Ready");
          Events.createElementTreeEvt.call(document.doc, document.title, this.request);
          // fs.writeFile(__dirname + '/../test/out/test.json', JSON.stringify(document.doc, null, 2), (err) => {
          //   if (err)
          //     error("Character", "Could not write JSON file:", err);
          // });

          // render the document
          var data = document.renderDocument(this.registry);

          callback({
            data: data,
            filename: title+".html",
            mimeType: "text/html"
          });
        });
      } catch (err) {
        error("Character", "Error:", err);
        callback({
          error: err
        });
      }
    })
  }
}
