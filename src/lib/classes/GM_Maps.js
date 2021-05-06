import { GM_Instance } from "./GM_Instance";
import { isEmpty, isNull } from '../util';
import { adjustColour } from '../util/colours';

function parseGM_Maps(primary, request) {
  // attributes
  let attr = {
      game: 'pathfinder2',
      theme: 'adventurer',
      language: 'en',

      printLarge: false,
      printHighContrast: false,
      printDyslexic: false,
      printDyslexicFont: 'sans',

      mapView: "2d",

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
    units: ['core', 'base', 'base/gm/maps', 'theme/' + attr.theme],
    language: attr.language,

    printLarge: attr.printLarge,
    printHighContrast: attr.printHighContrast,
    printDyslexic: attr.printDyslexic,
    printDyslexicFont: attr.printDyslexicFont,

    mapView: attr.mapView,

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

  if (gm.mapView == "3d") {
    gm.units.push('option/gm/maps-3d');
  } else {
    gm.units.push('option/gm/maps-2d');
  }

  return gm;
}

export class GM_Maps extends GM_Instance {
  constructor(primary, request, registry) {
    super(request, registry);
    this.data = parseGM_Maps(primary, request);
    this.parseGM_Instance(primary, request);
  }

  completeDocument(document) {
    document.title = "Maps";
  }
}
