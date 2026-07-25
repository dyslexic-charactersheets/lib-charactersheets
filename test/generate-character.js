#!/usr/bin/env node

// node test/generate-character.js [flags]
// --game, --name, --ancestry, --heritage, --background, --subclass, --language, --out
// --class (alias: --classes) --feat (alias: --feats)
// --class druid|cleric <or> --class druid,cleric <or> --class druid --class cleric

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const LIB_DIR = path.join(REPO_ROOT, 'lib');
const IN_DIR = path.join(__dirname, 'in');
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

function parseArgs(argv) {
  const args = { feats: [], classes: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;

    const key = arg.slice(2);
    const value = argv[i + 1];
    i++;

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
      case 'language': args.language = value; break;
      case 'out': args.out = value; break;
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

  // language
  attributes.language = resolveLanguage(data, identity.language).code;

  return attributes;
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

  const attributes = attributesForIdentity(identity, config, game);
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
}

main();

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