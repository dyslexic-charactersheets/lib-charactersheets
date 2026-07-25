#!/usr/bin/env node

// node test/generate-character.js

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
  const classValue = resolveValue(findSlot(data, 'class'), identity.classes[0]);
  attributes.classes = [classValue.id];

  // subclass
  const [subclassSlotName] = subclassSlotsOf(classValue);
  if (subclassSlotName) {
    const subclassCode = identity.subclasses[removeRemasterPrefix(classValue.code)];
    attributes[subclassSlotName] = resolveValue(findSlot(data, subclassSlotName), subclassCode).id;
  }

  // feats
  if (identity.feats && identity.feats.length) {
    attributes.feats = identity.feats;
  }

  // language
  attributes.language = resolveLanguage(data, identity.language).code;

  return attributes;
}

function main() {
  const config = loadConfig();
  const game = config.game;
  const identity = config.identity;

  const attributes = attributesForIdentity(identity, config, game);
  const name = identity.name || game;

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