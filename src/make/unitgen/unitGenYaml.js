'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const jsYaml = require('js-yaml');

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

const books = {
  "Core Rulebook": "CRB",
  "Advanced Player's Guide": "APG",
}

function preloadUnits(game) {
  let units = [];
  let baseDir = `${__dirname}/../units/${game}`;

  function walkFiles(dir) {
    let files = fs.readdirSync(dir);
    for (let file of files) {
      let path = dir + "/" + file;
      if (fs.statSync(path).isDirectory()) {
        walkFiles(path);
      } else if (file.match(/\.yml$/)) {
        try {
          let data = fs.readFileSync(path, 'utf-8');
          let parsed = jsYaml.safeLoad(data);
          units.push(parsed.unit);
        } catch (x) {
          error("make", `Error processing unit file: ${file}`, x);
        }
      }
    }
  }
  walkFiles(baseDir);
  return units;
}

function generateUnits() {

  let knownUnits = preloadUnits("pathfinder2");

  // Backgrounds supplied by Nibrodooh
  // cf https://github.com/Nibrodooh/...
  let filename = `${__dirname}/../data/pathfinder2/backgrounds.yml`;
  try {
    let data = fs.readFileSync(filename, 'utf-8');
    let parsed = jsYaml.safeLoad(data);
    // let parsed = JSON.parse(data);
    log("make", `Generating backgrounds from data (${_.size(parsed)} units)`);

    _.forEach(parsed, value => {
      try {
        // let id = 'background/'+toKebabCase(value.source)+"/"+toKebabCase(key);
        let id = 'background/'+toKebabCase(value.title);
        let name = value.title;
        let text = value.text;
        // let description = value.text.replace(/\n/g, '\\n').replace(/\\nChoose .*$/, '');
        let book = value.source;

        let group = value.source.replace(/_{(.*?)}/g, '$1');
        switch (group) {
          case 'Core Rulebook': group = 'core'; break;
          case 'Advanced Players Guide': group = 'apg'; break;
          case 'Lost Omens World Guide':
          case 'Lost Omens Character Guide':
          case 'Lost Omens Gods & Magic': group = 'lost-omens'; break;
          default: group = '3pp'; break;
        }

        if (!includedSources.includes(book)) {
          return;
        }

        let skill = knownSkills.includes(value.skill) ? toKebabCase(value.skill) : '';
        let lorename = knownLore.includes(value.lore) ? `${value.lore} Lore` : '';
        let loreskill = knownLore.includes(value.lore) ? `lore-${toKebabCase(value.lore)}` : '';

        let feat = "feat/"+toKebabCase(value.feat.replace(/ \(.*\)/, ''));
        let featExists = knownUnits.includes(feat);
        if (!featExists) {
          warn("make", `Feat does not exist: ${feat} (${name})`);
        }

        let skillref = `Trained in ${value.skill}`;
        if (knownLore.includes(value.lore)) {
          skillref += ` and ${value.lore} Lore`;
        }
        let bookref = books[value.source]+" p"+value.page;

        let unitfile = path.normalize(__dirname+'/../units/pathfinder2/'+group+'/'+id+'.yml');
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

  - at: '@background'
    replace:
      - article: char-background
        title: "_{${name}}"
        contents:
          - p: "_{${skillref}}"
            icon: proficiency-trained

          - field: char-background-details
            width: stretch
            repeat: 3
            reduce: 1
          
          - paste: book-ref
            params:
              page-ref: "_{${bookref}}"

`;

        if (featExists) {
          unitdata += `  - at: '@background-skill-feat'
    replace:
      - paste: ${feat}
        params:
          skill: "#{skill}"
          skillname: "_{${value.skill}}"
          level: 1

`;
        }

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
