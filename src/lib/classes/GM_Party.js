import { GM_Instance } from "./GM_Instance";
import { isEmpty, isNull } from '../util';
import { log, warn } from '../log';
import { has } from "../util/objects";

function parseGM_Party(primary, request) {
  // attributes
  let attr = {
    game: 'pathfinder2',
    theme: 'adventurer',
    language: 'en',

    printLarge: false,
    printHighContrast: false,
    printDyslexic: false,
    printDyslexie: false,

    printColour: '#707070',
    accentColour: '',
    colors: [],
    printIntensity: 0,
    printWatermark: '',
    printBackground: false,
    ...primary.attributes
  };

  let gm = {
    id: primary.id,
    game: attr.game,
    units: ['core', 'base', 'base/gm/party', 'theme/' + attr.theme],
    language: attr.language,

    printLarge: attr.printLarge,
    printHighContrast: attr.printHighContrast,
    printDyslexic: attr.printDyslexic,
    printDyslexie: attr.printDyslexie,

    printColour: attr.printColour,
    accentColour: attr.accentColour,
    colors: attr.colors,
    printIntensity: attr.printIntensity,
    printLogo: attr.printLogo,
    favicon: 'favicon.svg',
    printBackground: attr.printBackground,
    printWatermark: attr.printWatermark,

    debug: primary.debug,
    instances: {},
  };

  if (isEmpty(gm.accentColour)) {
    gm.accentColour = adjustColour('#707070', gm.printColour, gm.printIntensity);
  }

  // accessibility options
  if (attr.printLarge) {
    gm.units.push('large-print');
  }
  if (attr.printHighContrast) {
    gm.units.push('high-contrast');
  }
  if (attr.printDyslexic) {
    if (attr.printDyslexie) {
      char.units.push('dyslexie');
    } else {
      char.units.push('dyslexic');
    }
  }

  // game-specific settings
  switch (attr.game) {
    case 'pathfinder2':
      [ "party", "npc-party", "npc" ].forEach(option => {
        let optionKey = "option-gm-"+option;
        if (has(attr, optionKey) && optionKey) {
          gm.units.push("option/gm/"+option);
        }
      });
      break;
  }

  // included assets
  ["printLogo", "printBackground"].forEach(field => {
    if (attr[field]) {
      const id = attr[field];
      // log("Character", "Asset:", field, "=", id);
      const instance = request.getInstance(id);
      if (!isNull(instance)) {
        // log("Character", "Asset known:", field, "=", id);
        gm.instances[id] = instance.attributes;
      }
    }
  });

  return gm;
}

export class GM_Party extends GM_Instance {
  constructor(primary, request, registry) {
    super(request, registry);
    this.data = parseGM_Party(primary, request);
    this.parseGM_Instance(primary, request);
  }

  completeDocument(document) {
    document.title = "Party";

    // log("GM", "Colors", this.data.colors);
    this.data.colors.forEach((color, i) => {
      // log("GM", "Adding color", i, color);
      
      // TODO custom Sass compilation for color blocks
      let css = `".color--color_${i} p, .color--color_${i} label, .color--color_${i} span { color: black; }`;
      
      document.cssParts.push(css);
    });
    
  }
}
