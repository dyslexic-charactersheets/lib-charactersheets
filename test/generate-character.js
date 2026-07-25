#!/usr/bin/env node

// node test/generate-character.js [flags]
// --game, --name, --ancestry, --heritage, --background, --subclass, --language, --out
// --class (alias: --classes) --feat (alias: --feats) --archetype (alias: --archetypes)
// --class druid|cleric <or> --class druid,cleric <or> --class druid --class cleric
// --overwrite key=value (aliases: --overwrites, --set, --setarg, --setargs, --kwargs) 
// --render | create test/out/<name>.html
// --open | autoopen rendered file 
// --no-build | no library rebuild (faster if no changes)

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const LIB_DIR = path.join(REPO_ROOT, 'lib');
const IN_DIR = path.join(__dirname, 'in');
const OUT_DIR = path.join(__dirname, 'out');
const CONFIG_PATH = path.join(__dirname, 'generate-character.config.json');

function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function loadData(game) {
  const dataPath = path.join(LIB_DIR, `data-${game}.json`);
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

function findSlot(data, slotName) {
  return data.selects.find(s => s.select === slotName);
}

function removeTranslationKey(name) {
  const match = /^_\{(.*)\}$/.exec(name);
  return match ? match[1] : name;
}

function removeRemasterPrefix(code) {
  return code.startsWith('remaster-') ? code.slice('remaster-'.length) : code;
}

function resolveValue(slot, input) {
  const needle = input.toLowerCase();
  return slot.values.find(v => v.code === input)
    || slot.values.find(v => removeRemasterPrefix(v.code) === input)
    || slot.values.find(v => removeTranslationKey(v.name).toLowerCase() === needle);
}

function resolveLanguage(data, input) {
  return data.languages.find(l => l.code === input);
}

function subclassSlotsOf(classValue) {
  return (classValue.selects || []).filter(name => !name.startsWith('feat/'));
}

function splitMultiflag(value) {
  return value.split(/[|,]/);
}

const BOOLEAN_FLAGS = new Set([
  'render',
  'open',
  'no-build'
]);

function parseArgs(argv) {
  const args = { feats: [], classes: [], archetypes: [], overwrites: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;

    const key = arg.slice(2);
    let value;
    if (BOOLEAN_FLAGS.has(key)) {
      value = true;
    } else {
      value = argv[i + 1];
      i++;
    }

    switch (key) {
      case 'game': args.game = value; break;
      case 'name': args.name = value; break;
      case 'ancestry': args.ancestry = value; break;
      case 'heritage': args.heritage = value; break;
      case 'background': args.background = value; break;
      case 'class':
      case 'classes': args.classes.push(...splitMultiflag(value)); break;
      case 'subclass': args.subclass = value; break;
      case 'feat':
      case 'feats': args.feats.push(...splitMultiflag(value)); break;
      case 'archetype':
      case 'archetypes': args.archetypes.push(...splitMultiflag(value)); break;
      case 'set':
      case 'setarg':
      case 'setargs':
      case 'kwargs':
      case 'overwrite':
      case 'overwrites': args.overwrites.push(value); break;
      case 'language': args.language = value; break;
      case 'out': args.out = value; break;
      case 'render': args.render = true; break;
      case 'open': args.open = true; break;
      case 'no-build': args.noBuild = true; break;
      default: console.error(`generate-character: unknown flag --${key}`); process.exit(1);
    }
  }
  return args;
}

/*
  "identity": {
    "name": "",
    "ancestry": "human",
    "heritage": "versatile",
    "background": "noble",
    "classes": ["druid"],
    "subclasses": {
      "druid": "untamed"
    },
    "feats": ["diehard"],
    "archetypes": [],
    "language": "en"
  },
*/

// trying not to create a separate attribute for every 
// subset of differently names subclasses, so the script
// tries to find the type of slot that fits
function attributesForIdentity(identity, config, game) {
  const data = loadData(game);
  const attributes = { game, ...config.attributes };

  // name
  attributes.name = identity.name || game;

  // ancestry
  const ancestryValue = resolveValue(findSlot(data, 'ancestry'), identity.ancestry);
  attributes.ancestry = ancestryValue.id;

  // heritage
  const heritageSlotName = (ancestryValue.selects || []).find(name => name.startsWith('heritage/'));
  if (heritageSlotName) {
    const heritageValue = resolveValue(findSlot(data, heritageSlotName), identity.heritage);
    attributes[heritageSlotName] = heritageValue.id;
  }

  // background
  attributes.background = resolveValue(findSlot(data, 'background'), identity.background).id;

  // class
  const classValues = identity.classes.map(code => resolveValue(findSlot(data, 'class'), code));
  attributes.classes = classValues.map(cv => cv.id);

  // subclass,
  classValues.forEach(classValue => {
    const [subclassSlotName] = subclassSlotsOf(classValue);
    if (!subclassSlotName) return;
    const subclassCode = identity.subclasses[removeRemasterPrefix(classValue.code)];
    if (!subclassCode) return;
    attributes[subclassSlotName] = resolveValue(findSlot(data, subclassSlotName), subclassCode).id;
  });

  // feats
  if (identity.feats && identity.feats.length) {
    attributes.feats = identity.feats;
  }

  // archetypes
  if (identity.archetypes && identity.archetypes.length) {
    const archetypeSlot = findSlot(data, 'archetype');
    attributes.archetypes = identity.archetypes.map(code => resolveValue(archetypeSlot, code).id);
  }

  // language
  attributes.language = resolveLanguage(data, identity.language).code;

  return attributes;
}

// send the rebuild to existing build script
function rebuildLibrary(noBuild) {
  if (noBuild) return;
  execSync('npm run build', { cwd: REPO_ROOT, stdio: 'inherit' });
}

// make the setup in test.js into a function, otherwise it's identical
let characterSheets = null;
function getCharacterSheets() {
  if (!characterSheets) {
    characterSheets = require(path.join(LIB_DIR, 'lib-charactersheets.js'));
    characterSheets.addAssetsDir(path.join(IN_DIR, 'assets'));
    characterSheets.translationsPromise = characterSheets.loadDefaultTranslations();
  }
  return characterSheets;
}

// standard open-file per OS function borrowed from the internet
function openFile(filePath) {
  // macOS
  if (process.platform === 'darwin') {
    exec(`open "${filePath}"`);
    return;
  }

  // Windows
  if (process.platform === 'win32') {
    exec(`start "" "${filePath}"`);
    return;
  }

  // WSL 
  const isWsl = fs.existsSync('/proc/version')
    && fs.readFileSync('/proc/version', 'utf-8').toLowerCase().includes('microsoft');
  if (isWsl) {
    const winPath = execSync(`wslpath -w "${filePath}"`).toString().trim();
    exec(`explorer.exe "${winPath}"`);
    return;
  }
  
  // Unix
  exec(`xdg-open "${filePath}"`);
}

// same shape as saveResult in test.js
function saveResult(result, openFlag) {
  if (Array.isArray(result)) {
    result.forEach(r => saveResult(r, openFlag));
    return;
  }

  if (result.err) {
    console.error('generate-character: render error', result.err);
    return;
  }

  const outfile = path.join(OUT_DIR, result.filename);
  fs.writeFileSync(outfile, result.data);
  console.log(`Rendered ${path.relative(process.cwd(), outfile)}`);
  
  // open if user requested
  if (openFlag) 
    openFile(outfile);
}

function renderToOut(request, openFlag) {
  const characterSheets = getCharacterSheets();
  
  return characterSheets.translationsPromise.then(() => characterSheets.create(request)).then(result => {
    if (result === null) {
      console.error('generate-character: render produced nothing (skipped)');
      return;
    }
    
    saveResult(result, openFlag);
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig();
  const game = args.game || config.game;

  const identity = { ...config.identity };
  if (args.name) identity.name = args.name;
  if (args.ancestry) identity.ancestry = args.ancestry;
  if (args.heritage) identity.heritage = args.heritage;
  if (args.background) identity.background = args.background;
  if (args.classes.length) identity.classes = args.classes;
  if (args.subclass) {
    const classCode = identity.classes[0];
    identity.subclasses = { ...identity.subclasses, [classCode]: args.subclass };
  }
  if (args.language) identity.language = args.language;
  if (args.feats.length) identity.feats = args.feats;
  if (args.archetypes.length) identity.archetypes = args.archetypes;

  const attributes = attributesForIdentity(identity, config, game);

  // overwrite any field in the attributes via key=value after the flag 
  args.overwrites.forEach(raw => {
    const eq = raw.indexOf('=');
    const key = raw.slice(0, eq);
    const value = raw.slice(eq + 1);
    attributes[key] = value;
  });

  const name = args.out || identity.name || game;

  const request = {
    version: 0,
    data: {
      type: 'character',
      id: Math.random().toString(16).slice(2, 9),
      isLoggedIn: true,
      attributes,
    },
  };

  // this creates the .json request file to then render
  // the character sheet, following the same conventions the site does
  const outFile = path.join(IN_DIR, `${name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(request, null, 2));
  console.log(`Wrote ${path.relative(process.cwd(), outFile)}`);

  if (!args.render) {
    return Promise.resolve();
  }

  rebuildLibrary(args.noBuild);
  return renderToOut(request, args.open);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

/*

{
  "version": 0,
  "data": {
    "type": "character",
    "id": "8fa82c7",
    "isLoggedIn": true,
    "attributes": {
      "game": "pathfinder2remaster",
      "name": "Remaster",
      "ancestry": "ancestry/remaster/human",
      "heritage/human": "heritage/human/remaster/versatile",
      "background": "background/noble",
      "classes": [
        "class/remaster/alchemist"
      ],
      "cleric/doctrine": "cleric/doctrine/remaster/warpriest",
      "rogue/racket": "rogue/racket/ruffian",
      "x/druid/order": "druid/order/remaster/leaf",
      "witch/patron": "witch/patron/wilding-steward",
      "wizard/thesis": "wizard/thesis/staff-nexus",
      "wizard/school": "wizard/school/unified-magical-theory",
      "archetypes": ["xxx/archetype/remaster/wizard"],
      "inventoryStyle": "double",
      "optionCover": true,
      "optionPermission": true,
      "optionReference": true,
      "optionBuild": true,
      "optionMinis": true,
      "optionBackground": true,
      "optionLevelUp": true,
      "optionColourful": true,
      "optionPfs": false,
      "optionAncestryParagon": false,
      "optionAutomaticBonusProgression": false,
      "feats": [ "diehard" ],
      "skillsGroup": true,
      "skillActions": true,
      "miniSize": "small",
      "printColour": "#241428",
      "accentColour": "#a6085e",
      "printDyslexic": false,
      "printDyslexie": true,
      "printPortrait": "portraits/Gnome Noole.png",
      "printLogo": "logos/pathfinder2e.png",
      "printBackground": "backgrounds/paper3.jpg"
    }
  }
}

*/