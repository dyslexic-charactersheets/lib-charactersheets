import { log, error } from '../log';
import { adjustColour } from '../util';
import { ready as systemsReady, getSystem } from './System';
import { Document } from './Document';
import { LoadQueue } from './LoadQueue';
import { Events } from './Events';

// import { applyContext } from '../context';
import { locateAsset, toDataURL, inferMimeType } from '../data';
import { toKebabCase, toCamelCase, toPathCase, toSpaceCase, toTitleCase, isString, isObject, isNull, isArray, has, isEmpty } from '../util';

function parseCharacter(primary, request) {
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
    accentColour: '',
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
    instances: {},
  };

  if (isEmpty(char.accentColour)) {
    char.accentColour = adjustColour('#707070', char.printColour);
  }

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
        
        if (attr.heritage)
          char.units.push('heritage/' + char.ancestry + "/" + attr.heritage.replace(/^heritage-/, ''));
      }


      if (attr.ancestryFeats) {
        char.ancestryFeats = parseFeats(attr.ancestryFeats);
      }

      if (attr.background)
        char.units.push('background/' + attr.background.replace(/^background-/, ''));

      if (attr.class) {
        let className = attr.class.replace(/^class-/, '');
        char.units.push('class/' + className);
        char.classes.push(className);
        let classPrefix = toCamelCase('class ' + className);
        // log("Character", "Class name", className, ", prefix", classPrefix);

        let classFeatsKey = classPrefix + 'Feats';
        if (attr[classFeatsKey]) {
          char.classFeats = parseFeats(attr[classFeatsKey]);
        }

        Object.keys(attr).forEach(key => {
          // log("Character", key);
          // let value = attr[key];

          if (key.startsWith(classPrefix) && !key.endsWith('Feats')) {
            let selname = toKebabCase(key.replace(classPrefix, ''));
            let selvalue = toKebabCase(attr[key]);
            log("Character", "Class option", key, selname, "=", selvalue);
            var unitname = className + '/' + selname + '/' + selvalue;
            // log("Character", "Class option unit", unitname);
            char.units.push(unitname);
          }
        });
      }

      // todo selectables
      char.units.push("option/inventory/half");

      if (attr.archetypes && isArray(attr.archetypes)) {
        attr.archetypes.forEach(archetype => {
          if (isString(archetype)) {
            char.archetypes.push(archetype);
            char.units.push('archetype/'+archetype);
          }
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

  // included assets
  ["printPortrait", "animalPortrait", "printLogo", "printBackground"].forEach(field => {
    if (attr[field]) {
      var id = attr[field];
      // log("Character", "Asset:", field, "=", id);
      var instance = request.getInstance(id);
      if (!isNull(instance)) {
        // log("Character", "Asset known:", field, "=", id);
        char.instances[id] = instance.attributes;
      }
    }
  });

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
    this.loadQueue = new LoadQueue();
  }

  getAsset(asset, callback) {
    if (!isNull(asset) && isString(asset) && asset != "" && has(this.data.instances, asset)) {
      // log("Character", "getAsset: known instance", asset);
      asset = this.data.instances[asset];
    }

    if (asset === null) {
      // log("Character", "getAsset: null");
      return;
    } else if (isObject(asset)) {
      // log("Character", "getAsset: object");
      var dataURL = toDataURL(asset.data, asset.mimeType);
      callback(dataURL);
    } else if (isString(asset)) {
      // log("Character", "getAsset: string", asset);
      locateAsset(asset, assetFile => {
        this.loadQueue.loadEmbed(assetFile).then(data => {
          var mimeType = inferMimeType(asset);
          var dataURL = toDataURL(data, mimeType);
          callback(dataURL);
        })
      });
    } else {
      warn("Character", "Unknown asset", asset);
    }
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
        // TODO translate title parts
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
        if (isEmpty(title)) title = "Character";
        document.title = title;

        // Load assets
        if (this.data.favicon) {
          this.getAsset(this.data.favicon, dataURL => {
            document.faviconURL = dataURL;
          });
        }

        if (this.data.printLogo) {
          this.getAsset(this.data.printLogo, dataURL => {
            document.logoURL = dataURL;
          });
        }

        if (this.data.printPortrait) {
          this.getAsset(this.data.printPortrait, dataURL => {
            document.portraitURL = dataURL;
          });
        }

        if (this.data.animalPortrait) {
          this.getAsset(this.data.animalPortrait, dataURL => {
            document.animalURL = dataURL;
          });
        }

        if (this.data.printBackground) {
          this.getAsset(this.data.printBackground, dataURL => {
            document.backgroundURL = dataURL;
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
          log("Character", "Unit IDs:", unitIds);
          units.forEach(unit => {
            if (has(unit, "require")) {
              unit.require.forEach(req => {
                // log("Character", `Unit ${unit.id} requires`, req);
                // check if the new unit is really new
                if (unitIds.includes(req.unit))
                  return;

                // check if the new unit has dependencies on other units
                if (has(req, "with")) {
                  if (!unitIds.includes(req.with))
                    return;
                }

                var newunit = system.getUnit(req.unit);
                if (!isNull(newunit)) {
                  moreunits.push(newunit);
                  more = true; // let's do this again
                }
              });
            }
          });
          units = units.concat(moreunits);
        }
        log("Character", "Units:", units.map(unit => unit.id));

        // make the element tree
        units.forEach(unit => document.addUnit(unit));
        document.composeDocument(this.registry);

        this.loadQueue.ready(() => {
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
