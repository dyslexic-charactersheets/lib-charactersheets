'use strict';

require('../log.js');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const jsYaml = require('js-yaml');


let knownUnits = [];

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

function slugify(str) {
  str = str.replace("'", "");
  str = str.replace(/ \(.*\)/, '');
  str = toKebabCase(str);
  return str;
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
  knownUnits = units;
  log("unitGen aon", "Units loaded");
}

const abilities = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

const shortAbilities = {
  "Strength": "STR",
  "Dexterity": "DEX",
  "Contitution": "CON",
  "Intelligence": "INT",
  "Wisdom": "WIS",
  "Charisma": "CHA",
};

const shortBooks = {
  "Core Rulebook": "CRB",
  "Advanced Player's Guide": "APG",
  // "Secrets of Magic": "SoM"
  // "Guns & Gears": "G&G",
  "PFS Quest #10: The Broken Scales": "The Broken Scales",
  "Pathfinder #148: Fires of the Haunted City": "Fires of the Haunted City",
  "Pathfinder #153: Life's Long Shadow": "Life's Long Shadow",
  "Pathfinder #160: Assault on Hunting Lodge Seven": "Assault on Hunting Lodge Seven",
};

const bookNames = {
  "Guns & Gears": "Guns and Gears",
  "Gods & Magic": "Lost Omens Gods and Magic",
  "PFS Guide": "Lost Omens Pathfinder Society Guide",
  "Pathfinder Beginner Box: Hero's Handbook": "Pathfinder Beginner Box",
  "PFS Quest #10: The Broken Scales": "Pathfinder Society",
  "Pathfinder #148: Fires of the Haunted City": "Age of Ashes",
  "Pathfinder #153: Life's Long Shadow": "Extinction Curse",
  "Pathfinder #160: Assault on Hunting Lodge Seven": "Agents of Edgewatch",
};

const bookGroups = {
  "Core Rulebook": "core",
  "Advanced Player's Guide": "apg",
  "Gods & Magic": "lost-omens/gods-and-magic",
  "Guns & Gears": "guns-and-gears",
  "Secrets of Magic": "secrets-of-magic",
  "PFS Guide": "lost-omens/pfs-guide",
  "Pathfinder Beginner Box": "adventure/pathfinder-beginner-box",
  "Pathfinder Beginner Box: Hero's Handbook": "adventure/pathfinder-beginner-box",
  "Little Trouble in Big Absalom": "adventure/big-trouble-in-little-absalom",
  "Pathfinder Society": "adventure/pfs",
  "PFS Quest #10: The Broken Scales": "adventure/pfs",
  "Age of Ashes": "adventure/age-of-ashes",
  "Extinction Curse": "adventure/extinction-curse",
  "Agents of Edgewatch": "adventure/agents-of-edgewatch",
  "Pathfinder #148: Fires of the Haunted City": "adventure/age-of-ashes",
  "Pathfinder #153: Life's Long Shadow": "adventure/extinction-curse",
  "Pathfinder #160: Assault on Hunting Lodge Seven": "adventure/agents-of-edgewatch",
};

const knownSkills = [
  "Acrobatics",
  "Arcana",
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

const blockedBackgrounds = [
  "Martial Disciple"
];

function parseBackgrounds(html) {
  let debugfile = path.normalize(__dirname+'/../../test/debug/backgrounds.html');
  fs.writeFile(debugfile, html, 'utf-8', (err) => {
    if (err) {
      error("unitGen aon", "Couldn't write file", debugfile);
    }
  });

  const $ = cheerio.load(html);

  let titles = $("#ctl00_RadDrawer1_Content_MainContent_DetailedOutput h2.title");

  for (let i = 0; i < titles.length; i++) {
    let title = titles[i];
    let unitName = $(title).find('a').text();
    // log("unitGen aon", "Unit title", unitName);

    if (blockedBackgrounds.includes(unitName)) {
      continue;
    }

    // walk units until the next title, and extract key info as we go
    let description = "";
    let fieldLine = false;
    let collectingDescription = false;
    let book = "";
    let bookref = "";
    let feat = "";
    let skills = [];
    let loreskills = [];
    let boost = [];
    let rarity = "";

    let skillNext = false;
    let skillChoice = false;

    for (let elem = title.next; elem !== null && elem.name != 'h2'; elem = elem.next) {
      // text elements
      if (elem.type == "text") {
        let text = elem.data.trim();
        if (text.match(/You're trained in/)) {
          // log("unitGen aon", " -- skill next", "<"+text+">");
          skillNext = true;
          if (text.match(/either/)) {
            // log("unitGen aon", " -- skill choice");
            skillChoice = true;
          }
          continue; // keep skillNext
        } else if (skillNext && (text.match(/and/) || text.match(/or/))) {
          // log("unitGen aon", " -- skill and/or", "<"+text+">");
          continue; // keep skillNext
        } else if (description == "" && text != "" && !fieldLine) {
          collectingDescription = true;
          description = `${description} ${text}`;
        } else if (collectingDescription && text != "") {
          description = `${description} ${text}`;
        }
        // log("unitGen aon", " - text <"+text+">");
        
      
      } else if (elem.type == "tag") {
        // a
        if (elem.name == 'br') {
          if (collectingDescription && description != "") {
            collectingDescription = false;
          }
          fieldLine = false;
        } else if (elem.name == 'a') {
          let href = elem.attribs.href;
          let text = $(elem).text().trim();

          if (href.match(/paizo.com/)) {
            book = text.replace(/ pg.*$/, '');
            let match = text.match(/pg\. (.*)/);
            if (match) {
              let page = match[1];
              let shortBook = shortBooks.hasOwnProperty(book) ? shortBooks[book] : book;
              bookref = `_{${shortBook} p${page}}`;
            }
            if (bookNames.hasOwnProperty(book)) {
              book = bookNames[book];
            }
          } else if (skillNext && knownSkills.includes(text)) {
            // log("unitGen aon", " -- skill here", "<"+text+">");
            skills.push(text);
            continue; // keep skillNext
          } else if (collectingDescription) {
            description = `${description} ${text}`;
          } else {
            // log("unitGen aon", " - anchor", href, "<"+text+">");
          }

        // span
        } else if (elem.name == "span") {
          let cls = elem.attribs.class;
          if (cls == "traitrare") {
            rarity = "Rare";
          } else if (cls == "traituncommon") {
            rarity = "Uncommon"
          } else {
            let text = $(elem).text().trim();
            if (collectingDescription) {
              description = `${description} ${text}`;
            }
            // log("unitGen aon", " - span", text);
          }

        // b
        } else if (elem.name == "b") {
          let text = $(elem).text().trim();
          if (abilities.includes(text)) {
            boost.push(shortAbilities[text]);
          } else if (text == "Source" || text == "Prerequisites") {
            fieldLine = true;
          } else if (collectingDescription) {
            description = `${description} ${text}`;
            // log("unitGen aon", " - b <"+text+">");
          }

        // u
        } else if (elem.name == "u") {
          let text = $(elem).text().trim();
          let featUnit = "feat/"+slugify(text);
          if (knownSkills.includes(text)) {
            if (skillNext) {
              // log("unitGen aon", " -- skill here", "<"+text+">");
              skills.push(text);
              continue; // keep skillNext
            } else {
              // log("unitGen aon", " -- not a skill", "<"+text+">");
            }
          } else if (text.match(/ Lore/)) {
            // log("unitGen aon", " -- lore skill here", "<"+text+">");
            loreskills.push(text);
          } else if (text == "Lore") {
            // do nothing with generic lore
          } else if (knownUnits.includes(featUnit)) {
            feat = text;
          } else if (collectingDescription) {
            description = `${description} ${text}`;
          } else {
            log("unitGen aon", " - Feat?", text, slugify(text));
          }
        // other
        } else {
          // log("unitGen aon", " -", elem.name);
        }
      } else {
        // log("unitGen aon", " - what elem?", elem.name);
      }

      skillNext = false;
    }

    // log("unitGen aon", "Creating unit:", unitName, book, bookref, feat, skills, loreskills)
    description = description.trim().replaceAll(/ ,/g, ',');
    createBackgroundUnit(unitName, description, book, bookref, feat, skillChoice, skills, loreskills, rarity);
  }
}

function and(list, list2 = []) {
  let items = list.concat(list2);
  if (items.length == 0) {
    return "";
  }
  if (items.length == 1) {
    return items[0];
  }
  let lastitem = items.pop();

  return items.join(", ")+" and "+lastitem;
}

function createBackgroundUnit(name, description, book, bookref, feat, skillChoice, skills, loreskills, rarity) {
  let id = slugify(name);
  let group = bookGroups.hasOwnProperty(book) ? bookGroups[book] : slugify(book).replace('lost-omens-', 'lost-omens/');

  let featUnit = "feat/"+slugify(feat);
  let featExists = knownUnits.includes(featUnit);
  if (!featExists) {
    if (feat != "") {
      warn("unitGen aon", `Feat does not exist: ${featUnit} (${name})`);
    }
  }

  let unitfile = path.normalize(__dirname+'/../units/pathfinder2/'+group+'/background/'+id+'.yml');
  // log("unitGen aon", "Unit", unitfile);
  let unitdir = path.dirname(unitfile);

  let unitdata = `unit: background/${id}
in: background
group: "_{${book}}"
name: "_{${name}}"
${(rarity !== "") ? `badge: "_{${rarity}}"`: ''}
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
${(description != "") ? `
          - p: "_{${description}}"
            size: small
            blk: false
` : `
          - field: char-background-details
            width: stretch
            repeat: 3
            reduce: 1
`}
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

  // log("unitGen aon", "Writing unit file", unitfile);
  // log("unitGen aon", "Unit", unitdata);
  
  fs.mkdirSync(unitdir, { recursive: true });

  fs.writeFile(unitfile, unitdata, 'utf-8', (err) => {
    if (err) {
      error("unitGen aon", "Error writing unit file", unitfile, err);
    }
  });
}


// load existing feats
preloadUnits("pathfinder2");

// fetch backgrounds from AON
fetch('https://2e.aonprd.com/Backgrounds.aspx')
  .then((response) => {
    if (response.ok) {
      log("unitGen aon", "Fetched backgrounds source");
      response.text()
        .then((body) => {
          parseBackgrounds(body);
        })
    } else {
      error("unitGen aon", "Fetch error", response);
    }
  });
