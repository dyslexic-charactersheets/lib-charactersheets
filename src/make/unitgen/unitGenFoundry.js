'use strict';

require('../log.js');
const fs = require('fs');
const _ = require('lodash');
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
  words = _.flatMap(words, word => word.split(/([A-Z][a-z]+)/));
  words = _.map(words, word => word.toLowerCase());
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
let knownUnits = [];

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
  knownUnits = units;
  log("unitGen", "Units loaded");
}

function generateUnits() {
  // read the background files from the Foundry VTT source :D
  const datadir = '../foundry-pf2e/packs/data/backgrounds.db';
  for (let file of fs.readdirSync(datadir)) {
    if (!file.match(/\.json$/)) {
      warn("unitGen", "Not a JSON file:", file);
    }

    ((file) => {
      fs.readFile(datadir+'/'+file, 'utf-8', (err, data) => {
        let json = JSON.parse(data);
        
        let [book, group] = bookData(json.system.source.value);

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

        createBackgroundUnit(name, description, book, bookref, feat, group, skillChoice, skills, loreskills, rarity, badge);
      });
    })(file);
  }
}

function createBackgroundUnit(name, description, book, bookref, feat, group, skillChoice, skills, loreskills, rarity, badge) {
  // find the unit ID and filename
  // log("unitGen", name);
  let slug = slugify(name);
  let id = `background/${slug}`;
  let unitfile = `${group}/background/${slug}.yml`;
  if (book != "Core Rulebook") {
    id = 'background/'+group+'/'+slug;
  }
  // log("unitGen", "Unit", id, unitfile);
  unitfile = path.normalize(__dirname+'/../../units/pathfinder2/'+unitfile);
  // log("unitGen", "File", unitfile);

  // check if the feat exists
  let featUnit = "feat/"+slugify(feat);
  let featExists = knownUnits.includes(featUnit);
  if (!featExists) {
    if (feat != "") {
      warn("unitGen", `Feat does not exist: ${featUnit} (${name})`);
    }
  }

  // generate the unit data
  let unitdata = `unit: ${id}
in: background
group: "_{${book}}"
name: "_{${name}}"
${(badge !== "") ? `badge: "_{${badge}}"`: ''}
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
    // Rulebooks
    case "Pathfinder Core Rulebook":
      return ["Core Rulebook", "core"];

    case "Pathfinder Advanced Player's Guide":
      return ["Advanced Player's Guide", "apg"];
    
    case "Pathfinder Secrets of Magic":
      return ["Secrets of Magic", "secrets-of-magic"];

    case "Pathfinder Guns and Gears":
    case "Pathfinder Guns & Gears":
      return ["Guns and Gears", "guns-and-gears"];
      
    case "Pathfinder Book of the Dead":
      return ["Book of the Dead", "book-of-the-dead"];

    case "Pathfinder Dark Archive":
      return ["Dark Archive", "dark-archive"];

    // Beginner's Box
    case "Pathfinder Beginner Box: Hero's Handbook":
      return ["Pathfinder Beginner Box", "beginner-box"];
  
    // Lost Omens books
    case "Pathfinder Lost Omens: World Guide":
      return ["Lost Omens World Guide", "lost-omens/world-guide"];

    case "Pathfinder Lost Omens: Pathfinder Society Guide":
      return ["Lost Omens Pathfinder Society Guide", "lost-omens/pathfinder-society-guide"];

    case "Pathfinder Lost Omens: Travel Guide":
      return ["Lost Omens Travel Guide", "lost-omens/travel-guide"];

    case "Pathfinder Lost Omens: Gods & Magic":
      return ["Lost Omens Gods & Magic", "lost-omens/gods-and-magic"];

    case "Pathfinder Lost Omens: Knights of Lastwall":
      return ["Lost Omens Knights of Lastwall", "lost-omens/knights-of-lastwall"];

    case "Pathfinder Lost Omens: Firebrands":
      return ["Lost Omens Firebrands", "lost-omens/firebrands"];

    // Adventure Paths
    case "Pathfinder: Age of Ashes Player's Guide":
    case "Pathfinder #148: Fires of the Haunted City":
    case "Pathfinder #150: Broken Promises":
      return ["Age of Ashes", "adventure/age-of-ashes"];

    case "Pathfinder: Extinction Curse Player's Guide":
    case "Pathfinder #153: Life's Long Shadows":
      return ["Extinction Curse", "adventure/extinction-curse"];

    case "Pathfinder: Agents of Edgewatch Player's Guide":
    case "Pathfinder #160: Assault on Hunting Lodge Seven":
      return ["Agents of Edgewatch", "adventure/agents-of-edgewatch"];

    case "Fists of the Ruby Phoenix Player's Guide":
    case "Pathfinder: Fists of the Ruby Phoenix Player's Guide":
      return ["Fists of the Ruby Phoenix", "adventure/fists-of-the-ruby-phoenix"];

    case "Pathfinder: Kingmaker Player's Guide":
      return ["Kingmaker", "adventure/kingmaker"];

    case "Pathfinder: Strength of Thousands Player's Guide":
      return ["Strength of Thousands", "adventure/strength-of-thousands"];

    case "Pathfinder: Outlaws of Alkenstar Player's Guide":
      return ["Outlaws of Alkenstar", "adventure/outlaws-of-alkenstar"];

    case "Pathfinder: Quest for the Frozen Flame Player's Guide":
      return ["Quest for the Frozen Flame", "adventure/quest-for-the-frozen-flame"];

    case "Pathfinder: Gatewalkers Player's Guide":
      return ["Gatewalkers", "adventure/gatewalkers"];

    case "Pathfinder: Blood Lords Player's Guide":
      return ["Blood Lords", "adventure/blood-lords"];

    case "Pathfinder: Stolen Fate Player's Guide":
      return ["Stolen Fate", "adventure/stolen-fate"];

    // Adventures
    case "Pathfinder Adventure: The Fall of Plaguestone":
      return ["The Fall of Plaguestone", "adventure/fall-of-plaguestone"];

    case "Pathfinder Adventure: Little Trouble in Big Absalom":
      return ["Little Trouble in Big Absalom", "adventure/little-trouble-in-big-absalom"];

    case "Pathfinder Adventure: Crown of the Kobold King":
      return ["Crown of the Kobold King", "adventure/crown-of-the-kobold-king"];

    case "Pathfinder: Abomination Vaults Player's Guide":
      return ["Abomination Vaults", "adventure/abomination-vaults"];

    case "Pathfinder: Kingmaker Player's Guide":
      return ["Kingmaker", "adventure/kingmaker"];

    // Pathfinder Society
    case "Organized Play Foundation":
    case "Pathfinder Society Quest #10: The Broken Scales":
    case "Pathfinder Society Scenario #1-15: The Blooming Catastrophe":
    case "Pathfinder Society Scenario #1-19: Iolite Squad Alpha":
    case "Pathfinder Blog: Pathfinder Society Year 4 Rule Updates":
      return ["Organized Play Foundation", "pfs"];

    default:
      log("unitGen", "Unknown source:", json.system.source.value);
      return [source, 'adventure/'+slugify(source)];
  }
}


preloadUnits("pathfinder2");

setTimeout(generateUnits, 1000);
