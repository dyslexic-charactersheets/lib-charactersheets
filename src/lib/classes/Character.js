import { log, error } from '../log';
import { adjustColour, interpolate } from '../util';
import { __ } from '../i18n';
import { ready as systemsReady, getSystem } from './System';
import { Document } from './Document';
import { LoadQueue } from './LoadQueue';
import { Events } from './Events';

// import { applyContext } from '../context';
import { locateAsset, toDataURL, inferMimeType } from '../data';
import { toKebabCase, toCamelCase, toPathCase, toSpaceCase, toTitleCase, isString, isObject, isNull, isArray, has, isEmpty } from '../util';

const knownVars = [
  "inventoryStyle",
  "language",
  "miniSize",
];

function parseCharacter(primary, request) {
  // attributes
  let attr = {
    name: false,
    game: 'pathfinder2',
    theme: 'adventurer',
    language: 'en',

    ancestry: false,
    heritage: false,
    background: false,
    class: false,
    archetypes: false,
    description: '',

    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,

    miniSize: 'medium',

    printColour: '#707070',
    accentColour: '',
    printIntensity: 0,
    printWatermark: '',
    printLogo: false,
    printPortrait: false,
    animalPortrait: false,
    printBackground: false,
    ...primary.attributes
  };

  // an object to start with
  let char = {
    name: attr.name,
    game: attr.game,
    units: ['core', 'base', 'base/character', 'theme/' + attr.theme],
    language: attr.language,
    description: attr.description,
    
    ancestry: false,
    heritage: false,
    background: false,
    classes: [],
    archetypes: [],
    feats: [],
    options: {
      'animal-companion': false,
      'party-funds': false,
      'permission': false,
      'build': false,
      'mini': false,
      'spellbook': false
    },
    spellbookStyle: 'normal',
    miniSize: attr.miniSize,

    printLarge: attr.printLarge,
    printHighContrast: attr.printHighContrast,
    printDyslexic: attr.printDyslexic,

    printColour: attr.printColour,
    accentColour: attr.accentColour,
    printIntensity: attr.printIntensity,
    printLogo: attr.printLogo,
    favicon: 'favicon16.png',
    printPortrait: attr.printPortrait,
    animalPortrait: attr.animalPortrait,
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,
    instances: {},
  };

  // log("Character", "Print intensity", char.printIntensity);
  if (isEmpty(char.accentColour)) {
    char.accentColour = adjustColour('#707070', char.printColour, char.printIntensity);
  }

  // get all the flags
  Object.keys(attr).forEach(key => {
    let flag = toKebabCase(key);

    if (flag.match(/^option-/)) {
      let option = flag.replace(/^option-/, '');
      let ok = char.options[option] = !!attr[key];
      log("Character", "Option", option, ok);
      if (ok) {
        char.units.push('option/' + option);
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
    char.units.push('dyslexic');
  }

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

      if (attr.background) {
        char.units.push('background/' + attr.background.replace(/^background-/, ''));
      }

      if (attr.class) {
        let className = attr.class.replace(/^class-/, '');
        char.units.push('class/' + className);
        char.classes.push(className);
        let classPrefix = toCamelCase('class ' + className);
        // log("Character", "Class name", className, ", prefix", classPrefix);

        let classFeatsKey = classPrefix + 'Feats';
        if (attr[classFeatsKey]) {
          char.classFeats = parseFeats(attr[classFeatsKey]);
          char.classFeats.forEach(feat => {
            log("Character", "Class feat:", feat);
            char.units.push('feat/' + className + '/' + feat);
          });
        }

        Object.keys(attr).forEach(key => {
          // log("Character", key);
          // let value = attr[key];

          if (key.startsWith(classPrefix) && !key.endsWith('Feats')) {
            let selname = toKebabCase(key.replace(classPrefix, ''));
            if (isArray(attr[key])) {
              attr[key].forEach(selvalue => {
                selvalue = toKebabCase(selvalue);
                log("Character", "Class option", key, selname, "=", selvalue);
                const unitname = className + '/' + selname + '/' + selvalue;
                char.units.push(unitname);
              })
            } else if (isString(attr[key])) {
              let selvalue = toKebabCase(attr[key]);
              log("Character", "Class option", key, selname, "=", selvalue);
              const unitname = className + '/' + selname + '/' + selvalue;
              // log("Character", "Class option unit", unitname);
              char.units.push(unitname);
            }
          }
        });

        // attr.feats.forEach(key => {
        //   let flag = toKebabCase(key);
        //   if (flag.startsWith()
        // });
      }

      // todo select inventory size
      switch (attr.inventoryStyle) {
        case "full":
          char.units.push("option/inventory/full");
          break;

        case "both":
          char.units.push("option/inventory/half");
          char.units.push("option/inventory/full");
          break;

        default:
          char.units.push("option/inventory/half");
      }

      if (attr.archetypes && isArray(attr.archetypes)) {
        attr.archetypes.forEach(archetype => {
          if (isString(archetype)) {
            char.archetypes.push(archetype);
            char.units.push('archetype/' + archetype);
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
      const id = attr[field];
      // log("Character", "Asset:", field, "=", id);
      const instance = request.getInstance(id);
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
      const dataURL = toDataURL(asset.data, asset.mimeType);
      callback(dataURL);
    } else if (isString(asset)) {
      // log("Character", "getAsset: string", asset);
      locateAsset(asset, assetFile => {
        this.loadQueue.loadEmbed(assetFile).then(data => {
          const mimeType = inferMimeType(asset);
          const dataURL = toDataURL(data, mimeType);
          callback(dataURL);
        })
      });
    } else {
      warn("Character", "Unknown asset", asset);
    }
  }

  render(callback) {
    //const self = this;
    // log("Character", "Render character");
    // log("Character", `Name: ${this.data.name}, game: ${this.data.game}`);
    // log("Character", `Units: ${this.data.units}`);

    systemsReady(() => {
      try {
        const system = getSystem(this.data.game);
        if (system === null) {
          error("Character", "System not found:", this.data.game);
          return;
        }

        // start with a document
        const documentUnit = system.getUnit("document");
        const document = new Document(documentUnit);

        // language
        document.language = this.data.language;
        document.setVar('description', this.data.description);

        if (this.data.printLarge) {
          document.largePrint = true;
        }
        if (this.data.printHighContrast) {
          document.highContrast = true;
        }

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
          const printBackground = this.data.printBackground;
          // log("Character", "Background:", printBackground);
          const bgColours = {
            magnolia: '#F4E9D8',
          };
          if (has(bgColours, printBackground)) {
            document.backgroundColour = bgColours[printBackground];
          } else if (printBackground.match(/(#[A-Za-z0-9]{6}|rgb\([0-9]+,[0-9]+,[0-9]+\))/)) {
            document.backgroundColour = printBackground;
          } else {
            this.getAsset(printBackground, dataURL => {
              document.backgroundURL = dataURL;
            });
          }
        }

        // TODO set character parameters
        document.printColour = this.data.printColour;
        document.printIntensity = this.data.printIntensity;
        document.accentColour = this.data.accentColour;
        document.watermark = this.data.printWatermark;

        // get known vars from the data
        knownVars.forEach(varname => {
          if (has(this.data, varname)) {
            const key = toKebabCase(varname);
            const value = this.data[varname];
            // log("Character", `Var: ${key} = ${JSON.stringify(value)}`);
            document.setVar(key, value, "high");
          }
        });

        // load units
        let units = system.getUnits(this.data.units);
        units = system.inferUnits(units);
        log("Character", "Units:", units.map(unit => unit.id).sort());

        // infer the title from the units
        let title = __("Character");
        switch (system.code) {
          case 'pathfinder2':
            title = this.pathfinder2Title(units, document);
            break;
        }
        document.title = title;

        // make the element tree
        units.forEach(unit => document.addUnit(unit));
        document.composeDocument(this.registry);

        this.loadQueue.ready(() => {
          Events.createElementTreeEvt.call(document.doc, document.title, this.request);

          // render the document
          const data = document.renderDocument(this.registry);

          callback({
            data: data,
            filename: title + ".html",
            mimeType: "text/html"
          });
        });
      } catch (err) {
        error("Character", "Error:", err);
        callback({
          error: err
        });
      }
    });
  }

  pathfinder2Title(units, doc) {
    let parts = {
      name: this.data.name,
      ancestry: '',
      class: '',
      archetypes: '',
    };

    function getUnits(group) {
      return units.filter(unit => unit.in == group);
    }

    let ancestry = getUnits("ancestry");
    if (!isEmpty(ancestry)) {
      ancestry = ancestry[0];
      parts["ancestry"] = __(ancestry.name, doc);
      let heritage = getUnits("heritage/");
      if (!isEmpty(heritage)) {
        heritage = heritage[0];
        parts["ancestry"] = __(heritage.name, doc);
      }
    }

    let cls = getUnits("class");
    if (!isEmpty(cls)) {
      cls = cls[0];
      parts["class"] = __(cls.name, doc);
    }

    let archetypes = getUnits("archetype");
    if (!isEmpty(archetypes)) {
      parts["archetypes"] = archetypes.map(arch => __(arch.name, doc)).join(" ");
    }

    let template = isEmpty(parts.name) ? "_{#{ancestry} #{class} #{archetypes}}" : "_{#{name}, #{ancestry} #{class} #{archetypes}}";
    let title = interpolate(__(template, doc), parts);
    title = title.replace(/  +/g, ' ');
    title = title.replace(/^ +/, '');
    title = title.replace(/ +$/, '');
    if (title == "")
      title = "Character";
    return title;
  }
}
