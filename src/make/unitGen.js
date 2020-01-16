'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

// Convert string case
function splitAnyCase(str) {
  let words = str.split(/[ _/-]+/);
  words = _.flatMap(words, word => word.split(/([A-Z][a-z]+)/));
  words = _.map(words, word => word.toLowerCase());
  words = words.filter(word => word != '');
  return words;
}

function toKebabCase(str) {
  // convert-a-string-to-kebab-case
  const words = splitAnyCase(str);
  return words.join('-');
}

const includedSources = [
  "Core Rulebook"
];

const knownSkills = [
  "Acrobatics",
  "Athletics",
  "Crafting",
  "Deception",
  "Diplomacy",
  "Intimidation",
  "Medicine",
  "Nature",
  "Occultism",
  "Performance",
  "Religion",
  "Society",
  "Stealth",
  "Survival",
  "Thievery",
];

const knownLore = [
  "Alcohol",
  "Art",
  "Assurance",
  "Circus",
  "Engineering",
  "Farming",
  "Fortune-Telling",
  "Games",
  "Gladiatorial",
  "Guild",
  "Herbalism",
  "Labor",
  "Legal",
  "Mercantile",
  "Mining Lore",
  "Sailing",
  "Scribing",
  "Tanning",
  "Theater",
  "Underworld",
  "Warfare",
];

function generateUnits() {
  // Backgrounds supplied by Nibrodooh
  // cf https://github.com/Nibrodooh/...
  let filename = `${__dirname}/../data/pathfinder2/background.json`;
  try {
    let data = fs.readFileSync(filename, 'utf-8');
    let parsed = JSON.parse(data);
    log("make", `Generating backgrounds from data (${_.size(parsed)} units)`);

    _.forEach(parsed, (value, key) => {
      try {
        let id = 'background/'+toKebabCase(value.source)+"/"+toKebabCase(key);
        let name = value.title;
        let book = value.source;

        if (!includedSources.includes(book)) {
          return;
        }

        let skill = knownSkills.includes(value.skill) ? toKebabCase(value.skill) : '';
        let lorename = knownLore.includes(value.lore) ? `${value.lore} Lore` : '';
        let loreskill = knownLore.includes(value.lore) ? `lore-${toKebabCase(value.lore)}` : '';

        let feat = "feat/"+toKebabCase(value.feat);
        // log("unitGen", `Unit: ${id} - ${name}`);

        let unitfile = path.normalize(__dirname+'/../units/pathfinder2/'+id+'.yml');
        let unitdir = path.dirname(unitfile);
        let unitdata = `unit: ${id}
in: background
group: "_{${book}}"
name: "_{${name}}"

require:
  - unit: ${feat}

inc:
  - set: char-background
    value: "_{${name}}"
  - set: ${skill}-proficiency
    value: trained
`;

        if (lorename != '') {
          unitdata += `  - at: '@lore-skills'
    add:
      - skill: ${loreskill}
        name: "_{${lorename}}"
        ability: "_{INT}"
        abilityref: INT
        acp: false
`;
        }

        fs.mkdirSync(unitdir, { recursive: true });

        fs.writeFile(unitfile, unitdata, 'utf-8', (err) => {
          if (err) {
            error("unitGen", "Error writing file", unitfile, err);
          }
        });
      } catch (err) {
        error("unitGen", "Error generating background", err);
      }

    });

  } catch (err) {
    error("unitGen", "Error ", err);
  }
}

module.exports = {
  generateUnits: generateUnits
};
