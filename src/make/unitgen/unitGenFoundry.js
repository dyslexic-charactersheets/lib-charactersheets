/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

'use strict';

require('../log.js');
const fs = require('fs');
const jsYaml = require('js-yaml');
const path = require('path');


// Constant data
const skillNames = {
  'acr': 'Acrobatics',
  'arc': 'Arcana',
  'ath': 'Athletics',
  'cra': 'Crafting',
  'dec': 'Deception',
  'dip': 'Diplomacy',
  'itm': 'Intimidation',
  'med': 'Medicine',
  'nat': 'Nature',
  'occ': 'Occultism',
  'prf': 'Performance',
  'rel': 'Religion',
  'soc': 'Society',
  'ste': 'Stealth',
  'sur': 'Survival',
  'thi': 'Thievery'
}

// Utility functions
function unpara(str) {
  str = str.replaceAll(/<p>/g, '\n');
  str = str.replaceAll(/<\/p>/g, '\n');
  str = str.replaceAll(/\n+/g, '\n');
  str = str.replace(/^\n/, '');
  str = str.replace(/\n$/, '');
  return str;
}

function unHTML(str) {
  str = str.replaceAll(/<.*?>/g, '');
  return str;
}

function firstPara(str) {
  let lines = str.split(/\n+/);
  return lines[0];
}

function escapeYaml(str) {
  // str = str.replaceAll(/\n/g, '\\n');
  // str = str.replaceAll(/"/g, '\\"');
  str = str.replaceAll(/\*/g, '&#42;');
  return str;
}

// ensure a string is YAML-safe
function inputYaml(str) {
  if (str === undefined || str === null || str == "") {
    return "";
  }
  str = str.replaceAll(/\*/g, '');
  return str;
}

function indent(str, num) {
  let prefix = "\n"+(" ".repeat(num));
  str = str.replaceAll(/\n/g, prefix);
  return str;
}

// Convert string case
function splitAnyCase(str) {
  // log("unitGen", "splitAnyCase", str);
  let words = str.split(/[ _/-]+/);
  words = words.flatMap(word => word.split(/([A-Z][a-z]+)/));
  words = words.map(word => word.toLowerCase());
  words = words.filter(word => word != '');
  return words;
}

function toKebabCase(str) {
  if (str === undefined || str === null || str == "") {
    return "";
  }
  // log("unitGen", "toKebabCase", str);
  const words = splitAnyCase(str);
  return words.join('-');
}

function slugify(str) {
  // log("unitGen", "slugify", str);
  str = str.replace("'", "");
  str = str.replace(/ \(.*\)/, '');
  str = toKebabCase(str);
  return str;
}

function capital(str) {
  return str.substring(0, 1).toUpperCase()+str.substring(1);
}

function and(list = [], list2 = []) {
  let items = list.concat(list2);
  items = items.filter((item) => item !== undefined && item !== null && item != "");
  if (items.length == 0) {
    return "";
  }
  if (items.length == 1) {
    return items[0];
  }

  let lastitem = items.pop();
  return items.join(", ")+" and "+lastitem;
}

function makeDescription(description) {
  description = inputYaml(description);
  description = unpara(description);
  description = unHTML(description);
  let lines = description.split(/\n+/);

  while (lines[0].match(/^\[.*\]$/) || lines[0].match(/^Prerequisite/)) {
    lines.shift();
  }
  
  return lines[0];
}

// Known units
let knownUnits = {
  pathfinder2: [],
  pathfinder2remaster: [],
  starfinder2: []
};

function preloadUnits(game) {
  let units = [];
  let baseDir = `${__dirname}/../../units/${game}`;

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
          // error("make", `Error processing unit file: ${file}`, x);
        }
      }
    }
  }

  walkFiles(baseDir);
  knownUnits[game] = units;
  log("unitGen", "Units loaded");
}

function generateUnits() {
  // read the background files from the Foundry VTT source :D
  const datadir = '../foundry-pf2e/packs/backgrounds';
  generateUnitsForFolder(datadir);
}

function generateUnitsForFolder(dir) {
  for (let file of fs.readdirSync(dir)) {
    if (!file.match(/\.json$/)) {
      let filepath = dir+'/'+file;
      if (fs.lstatSync(filepath).isDirectory() ) {
        generateUnitsForFolder(filepath);
        continue;
      }

      warn("unitGen", "Not a JSON file:", file);
      continue;
    }
    if (file == "_folders.json") {
      continue;
    }

    ((file) => {
      // console.log("Reading", file);
      fs.readFile(dir+'/'+file, 'utf-8', (err, data) => {
        if (err) {
          console.log("ERROR", err);
          return;
        }
        let json = JSON.parse(data);
        if (json == null) {
          console.log("Cannot parse file", file);
          return;
        }
        
        let [book, group, edition] = bookData(json.system.publication.title);

        // fields
        let name = inputYaml(json.name);
        let rarity = capital(inputYaml(json.system.traits.rarity));
        let badge = rarity;
        if (badge == "Common") {
          badge = "";
        }
        let feat = '';
        for (let itemkey of Object.keys(json.system.items)) {
          feat = inputYaml(json.system.items[itemkey].name);
          break;
        }
        let skillChoice = '';
        let skills = json.system.trainedSkills.value.map((skill) => {
          return inputYaml(skillNames[skill.value]);
        }).filter((skill) => skill !== undefined && skill !== null && skill != "");
        let description = makeDescription(json.system.description.value);
        let bookref = '';
        let loreskills = inputYaml(json.system.trainedLore).split(/, */).filter((lore) => lore !== undefined && lore !== null && lore != "" && !lore.match(/<.*>/)).map((lore) => lore.match(/Lore$/) ? lore : lore+" Lore");

        createBackgroundUnit(name, description, book, bookref, feat, group, edition, skillChoice, skills, loreskills, rarity, badge);
      });
    })(file);
  }
}

function createBackgroundUnit(name, description, book, bookref, feat, group, edition, skillChoice, skills, loreskills, rarity, badge) {
  // find the unit ID and filename
  // log("unitGen", name);
  let slug = slugify(name);
  let id = `background/${slug}`;
  let unitfile = `${group}/background/${slug}.yml`;
  if (book != "Core Rulebook") {
    id = 'background/'+group+'/'+slug;
  }
  // log("unitGen", "Unit", id, unitfile);
  unitfile = path.normalize(`${__dirname}/../../units/${edition}/${unitfile}`);
  // log("unitGen", "File", unitfile);


  let ogl = edition == "pathfinder2";

  // check if the feat exists
  let featUnit = "feat/"+slugify(feat);
  let featExists = knownUnits[edition].includes(featUnit);
  if (!featExists) {
    if (feat != "") {
      warn("unitGen", `Feat does not exist: ${featUnit} (${name}) [${edition}]`);
    }
  }

  // generate the unit data
  let unitdata = `${ogl ? `# This file is compliant with the Open Game License (OGL)
# and is suitable for use with the Pathfinder Roleplaying Game (Second Edition).
# See the text of the OGL within this repository.
` : `# This file is licensed under the ORC License.
# See the ORC Notice within this repository.
`}

unit: ${id}
in: background
group: "_{${book}}"
name: "_{${name}}"
${(badge !== "") ? `badge: "_{${badge}}"`: ''}

meta:
  rarity: ${rarity}
${featExists ? `
require:
  - unit: ${featUnit}
`: ''}
inc:
  - set: char-background
    value: "_{${name}}"
${skillChoice ? `` : `${skills.map((skill) => `
  - set: ${toKebabCase(skill)}-proficiency
    value: trained
`).join("")}`}
  - at: '@background'
    replace:
      - article: char-background
        title: "_{${name}}"
        contents:
          # Skills: ${skills} | ${loreskills}
${(skills.length > 0 || loreskills.length > 0) ? `${(skillChoice) ? `
          - layout: indent-l
            contents:
              - icon: proficiency-trained
              - g:
                contents:
${skills.map((skill) => `
                  - field: "##:skill"
                    control: radio
                    value: ${slugify(skill)}
                    label: "_{${skill}}"
                    frame: right
                    width: tiny
`).join("")}
                  - p: "_{${and(loreskills)}}"
` : `
          - p: "_{Trained in ${and(skills, loreskills)}}"
            icon: proficiency-trained
            blk: false
`}` : ''}
          - field: char-background-details
            width: stretch
            repeat: 3
            reduce: 1
${(bookref != "") ? `
          - paste: book-ref
            params:
              page-ref: "${bookref}"
` : ''}
${featExists ? `
  - at: '@background-skill-feat'
    replace:
      - paste: ${featUnit}
        params:
          level: 1
` : ''}
${(loreskills.length > 0) ? `
  - at: '@lore-skills'
    add:
${loreskills.map((skill) => `
      - skill: ${toKebabCase(skill)}
        name: "_{${skill}}"
        ability: "_{INT}"
        abilityref: INT
        acp: false
`).join("")}
`: ''}`;


  let parsed = jsYaml.safeLoad(unitdata);
  
  let unitdir = path.dirname(unitfile);
  fs.mkdirSync(unitdir, { recursive: true });

  fs.writeFile(unitfile, unitdata, 'utf-8', (err) => {
    if (err) {
      error("unitGen aon", "Error writing unit file", unitfile, err);
    }
  });
}

function bookData(source) {
  switch (source) {

    // PF2e ORIGINAL

    // Rulebooks
    case "Pathfinder Core Rulebook":
      return ["Core Rulebook", "core", "pathfinder2"];

    case "Pathfinder Advanced Player's Guide":
      return ["Advanced Player's Guide", "apg", "pathfinder2"];
    
    case "Pathfinder Secrets of Magic":
      return ["Secrets of Magic", "secrets-of-magic", "pathfinder2"];

    case "Pathfinder Guns and Gears":
    case "Pathfinder Guns & Gears":
      return ["Guns and Gears", "guns-and-gears", "pathfinder2"];
      
    case "Pathfinder Book of the Dead":
      return ["Book of the Dead", "book-of-the-dead", "pathfinder2"];

    case "Pathfinder Dark Archive":
      return ["Dark Archive", "dark-archive", "pathfinder2"];

    case "Pathfinder Rage of Elements":
      return ["Rage of Elements", "rage-of-elements", "pathfinder2"];

    // Beginner's Box
    case "Pathfinder Beginner Box: Hero's Handbook":
      return ["Pathfinder Beginner Box", "beginner-box", "pathfinder2"];
  
    // Lost Omens books
    case "Pathfinder Lost Omens: World Guide":
    case "Pathfinder Lost Omens World Guide":
      return ["Lost Omens World Guide", "lost-omens/world-guide", "pathfinder2"];

    case "Pathfinder Lost Omens: Pathfinder Society Guide":
    case "Pathfinder Lost Omens Pathfinder Society Guide":
      return ["Lost Omens Pathfinder Society Guide", "lost-omens/pathfinder-society-guide", "pathfinder2"];

    case "Pathfinder Lost Omens: Travel Guide":
    case "Pathfinder Lost Omens Travel Guide":
      return ["Lost Omens Travel Guide", "lost-omens/travel-guide", "pathfinder2"];

    case "Pathfinder Lost Omens: Gods & Magic":
    case "Pathfinder Lost Omens Gods & Magic":
      return ["Lost Omens Gods & Magic", "lost-omens/gods-and-magic", "pathfinder2"];

    case "Pathfinder Lost Omens: Knights of Lastwall":
    case "Pathfinder Lost Omens Knights of Lastwall":
      return ["Lost Omens Knights of Lastwall", "lost-omens/knights-of-lastwall", "pathfinder2"];

    case "Pathfinder Lost Omens: Firebrands":
    case "Pathfinder Lost Omens Firebrands":
      return ["Lost Omens Firebrands", "lost-omens/firebrands", "pathfinder2"];

    case "Pathfinder Lost Omens: Highhelm":
    case "Pathfinder Lost Omens Highhelm":
      return ["Lost Omens Highhelm", "lost-omens/highhelm", "pathfinder2"];


    // Adventure Paths
    case "Pathfinder: Age of Ashes Player's Guide":
    case "Pathfinder Age of Ashes Player's Guide":
    case "Pathfinder #148: Fires of the Haunted City":
    case "Pathfinder #150: Broken Promises":
      return ["Age of Ashes", "adventure/age-of-ashes", "pathfinder2"];

    case "Pathfinder: Extinction Curse Player's Guide":
    case "Pathfinder Extinction Curse Player's Guide":
    case "Pathfinder #153: Life's Long Shadows":
      return ["Extinction Curse", "adventure/extinction-curse", "pathfinder2"];

    case "Pathfinder: Agents of Edgewatch Player's Guide":
    case "Pathfinder Agents of Edgewatch Player's Guide":
    case "Pathfinder #160: Assault on Hunting Lodge Seven":
      return ["Agents of Edgewatch", "adventure/agents-of-edgewatch", "pathfinder2"];

    case "Fists of the Ruby Phoenix Player's Guide":
    case "Pathfinder: Fists of the Ruby Phoenix Player's Guide":
    case "Pathfinder Fists of the Ruby Phoenix Player's Guide":
      return ["Fists of the Ruby Phoenix", "adventure/fists-of-the-ruby-phoenix", "pathfinder2"];

    case "Pathfinder: Kingmaker Player's Guide":
    case "Pathfinder Kingmaker Player's Guide":
      return ["Kingmaker", "adventure/kingmaker", "pathfinder2"];

    case "Pathfinder: Strength of Thousands Player's Guide":
    case "Pathfinder Strength of Thousands Player's Guide":
      return ["Strength of Thousands", "adventure/strength-of-thousands", "pathfinder2"];

    case "Pathfinder: Outlaws of Alkenstar Player's Guide":
    case "Pathfinder Outlaws of Alkenstar Player's Guide":
      return ["Outlaws of Alkenstar", "adventure/outlaws-of-alkenstar", "pathfinder2"];

    case "Pathfinder: Quest for the Frozen Flame Player's Guide":
    case "Pathfinder Quest for the Frozen Flame Player's Guide":
      return ["Quest for the Frozen Flame", "adventure/quest-for-the-frozen-flame", "pathfinder2"];

    case "Pathfinder: Gatewalkers Player's Guide":
    case "Pathfinder Gatewalkers Player's Guide":
      return ["Gatewalkers", "adventure/gatewalkers", "pathfinder2"];

    case "Pathfinder: Blood Lords Player's Guide":
    case "Pathfinder Blood Lords Player's Guide":
      return ["Blood Lords", "adventure/blood-lords", "pathfinder2"];

    case "Pathfinder: Stolen Fate Player's Guide":
    case "Pathfinder Stolen Fate Player's Guide":
      return ["Stolen Fate", "adventure/stolen-fate", "pathfinder2"];

    case "Pathfinder Sky King's Tomb Player's Guide":
      return ["Sky King's Tomb", "adventure/sky-kings-tomb", "pathfinder2"];
    case "Pathfinder Season of Ghosts Player's Guide":
      return ["Season of Ghosts", "adventure/season-of-ghosts", "pathfinder2"];

    case "Pathfinder Seven Dooms for Sandpoint Player's Guide":
      return ["Seven Dooms for Sandpoint", "adventure/seven-dooms-for-sandpoint", "pathfinder2"];


    // Adventures
    case "Pathfinder Adventure: The Fall of Plaguestone":
      return ["The Fall of Plaguestone", "adventure/fall-of-plaguestone", "pathfinder2"];

    case "Pathfinder Adventure: Little Trouble in Big Absalom":
      return ["Little Trouble in Big Absalom", "adventure/little-trouble-in-big-absalom", "pathfinder2"];

    case "Pathfinder Adventure: Crown of the Kobold King":
      return ["Crown of the Kobold King", "adventure/crown-of-the-kobold-king", "pathfinder2"];

    case "Pathfinder: Abomination Vaults Player's Guide":
    case "Pathfinder Abomination Vaults Player's Guide":
      return ["Abomination Vaults", "adventure/abomination-vaults", "pathfinder2"];

    // Pathfinder Society
    case "Organized Play Foundation":
    case "Pathfinder Society Quest #10: The Broken Scales":
    case "Pathfinder Society Scenario #1-15: The Blooming Catastrophe":
    case "Pathfinder Society Scenario #1-19: Iolite Squad Alpha":
    case "Pathfinder Blog: Pathfinder Society Year 4 Rule Updates":
      return ["Organized Play Foundation", "pfs", "pathfinder2"];


    // PF2e REMASTER

    // Core Rulebooks

    case "Pathfinder Player Core":
      return ["Player Core", "player-core", "pathfinder2remaster"];

    case "Pathfinder Player Core 2":
      return ["Player Core 2", "player-core", "pathfinder2remaster"];


  
    // Lost Omens books
    case "Pathfinder Lost Omens: Tian Xia Character Guide":
    case "Pathfinder Lost Omens Tian Xia Character Guide":
      return ["Lost Omens Tian Xia Character Guide", "lost-omens/tian-xia", "pathfinder2remaster"];

    case "Pathfinder Lost Omens: Rival Academies":
    case "Pathfinder Lost Omens Rival Academies":
      return ["Lost Omens Rival Academies", "lost-omens/rival-academies", "pathfinder2remaster"];


    // Adventures
    case "Pathfinder Wardens of Wildwood Player's Guide":
      return ["Wardens of Wildwood", "adventure/wardens-of-wildwood", "pathfinder2remaster"];
    case "Pathfinder Curtain Call Player's Guide":
      return ["Curtain Call", "adventure/curtain-call", "pathfinder2remaster"];
    case "Pathfinder Triumph of The Tusk Player's Guide":
      return ["Triumph of the Tusk", "adventure/triumph-of-the-tusk", "pathfinder2remaster"];
    case "Pathfinder Spore War Player's Guide":
      return ["Spore War", "adventure/spore-war", "pathfinder2remaster"];
    case "Pathfinder Shades of Blood Player's Guide":
      return ["Shades of Blood", "adventure/shades-of-blood", "pathfinder2remaster"];

    case "Pathfinder Adventure: Rusthenge":
      return ["Rusthenge", "adventure/rusthenge", "pathfinder2remaster"];

    case "Pathfinder Wake the Dead #1":
    case "Pathfinder Wake the Dead #2":
    case "Pathfinder Wake the Dead #5":
      return ["Wake the Dead", "adventure/wake-the-dead", "pathfinder2remaster"];

    // Pathfinder Society
    case "Pathfinder #192: Worst of All Possible Worlds":
      return ["Worst of All Possible Worlds", "pfs", "pathfinder2remaster"];

    default:
      log("unitGen", "Unknown source:", source);
      return [source, 'adventure/'+slugify(source), "pathfinder2remaster"];
  }
}


preloadUnits("pathfinder2");
preloadUnits("pathfinder2remaster");

setTimeout(generateUnits, 1000);
