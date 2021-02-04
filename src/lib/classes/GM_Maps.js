import { GM_Instance } from "./GM_Instance";
import { isEmpty, isNull } from '../util';
import { replaceColours, adjustColour, vibrantColour } from '../util/colours';
import { log, warn } from '../log';
import { has } from "../util/objects";
import { parse } from "handlebars";

function parseGM_Maps(primary, request) {
  // attributes
  let attr = {
      game: 'pathfinder2',
      theme: 'adventurer',
      language: 'en',

      printLarge: false,
      printHighContrast: false,
      printDyslexic: false,
      printDyslexie: false,

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
    printDyslexie: attr.printDyslexie,

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
    if (attr.printDyslexie) {
      gm.units.push('dyslexie');
    } else {
      gm.units.push('dyslexic');
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
