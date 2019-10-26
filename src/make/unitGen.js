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

function generateUnits() {
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
        let skill = toKebabCase(value.skill);
        let lorename = value.lore;
        let loreskill = toKebabCase(lorename)+"-lore";
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
  - at: '@lore-skills'
    replace:
      - skill: ${loreskill}
        name: "_{${lorename} Lore}"
        ability: "_{INT}"
        abilityref: INT
        acp: false
`;
        
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
