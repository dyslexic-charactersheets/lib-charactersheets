#!/usr/bin/env node

// node test/generate-character.js --<flags>
// node generate --flag1 arg1,arg2,arg3,...,argN --flag2 arg
// via npm: npm run generate -- --help

const fs = require('fs');
const path = require('path');
const { execSync, execFileSync, execFile } = require('child_process');
const cheerio = require('cheerio');

const REPO_ROOT = path.join(__dirname, '..');
const LIB_DIR = path.join(REPO_ROOT, 'lib');
const IN_DIR = path.join(__dirname, 'in');
const OUT_DIR = path.join(__dirname, 'out');
const JSON_DIR = path.join(OUT_DIR, 'json');
const HTML_DIR = path.join(OUT_DIR, 'html');
const CONFIG_PATH = path.join(__dirname, 'generate-character.config.json');

const DEFAULT_LIMIT = 200;
const DEFAULT_CHARSHEET_PREFIX = 'charsheet';
const REMASTER_PREFIX = 'remaster-'
const SEPARATORS = ",;|"

const HELP_TEXT = `
node test/generate-character.js --<flags>
node generate --flag1 arg1,arg2,arg3,...,argN --flag2 arg
via npm: npm run generate -- --flag1 arg1 --flag2 arg2
         !!! the "--" before the flags is required, otherwise npm swallows them !!!

accepted separators: , ; |

single-arg:
--name <arg>                           | --name Alex

multi-arg:
--ancestry                             | --ancestry elf
--heritage                             | --heritage half-elf
--background                           | --background noble
--class                                | --class oracle,cleric          // two files, one per class
                                        | --class oracle --class cleric  // same as above
--feat                                 | --feat diehard,toughness
--archetype                            | --archetype wizard,fighter
--language                             | --language en,fr,it
--game                                 | --game pathfinder2,pathfinder2remaster

--subclass                             | works like --class but is limited to the subclasses of
                                         a single class (needs exactly one --class to be picked)

--limit <integer>                      | limit the number of files that can generate at once above default
--kwargs key=value                     | overwrite any attribute
--render                               | create test/out/html/<filename>.html
--page                                 | only keep these pages (1 = the character page,
                                         then combat/feats/class/etc) + 0, -1, -2... allow to
                                         access pages before, may be non-consecutive: --page -1,2,6
--open                                 | autoopen rendered file
--out <name>                           | when only one file is generated, this replaces the filename
                                         when multiple values generate fileS, it's a prefix instead
--no-build                             | no library rebuild (faster if no changes)
--list <subgroup>                      | list all valid values for
                                         ancestry/heritage/background/class/subclass/archetype/language
--clean                                | delete everything in test/out (json + html) and exit,
                                         without generating anything
--purge                                | delete everything in test/out (json + html) before
                                         generating this run's files
`;

function printHelp() {
  console.log(HELP_TEXT);
}

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
  return code.startsWith(REMASTER_PREFIX) ? code.slice(REMASTER_PREFIX.length) : code;
}

function resolveValue(slot, input) {
  const needle = input.toLowerCase();
  return slot.values.find(v => v.code === input)
    || slot.values.find(v => removeRemasterPrefix(v.code) === input)
    || slot.values.find(v => removeTranslationKey(v.name).toLowerCase() === needle);
}

class GenerateCharacterError extends Error {}
class UnknownFlagError extends GenerateCharacterError {}
class UnknownValueError extends GenerateCharacterError {}
class UnknownLanguageError extends GenerateCharacterError {}
class UnresolvedSubclassError extends GenerateCharacterError {}
class SubclassRequiresSingleClassError extends GenerateCharacterError {}
class ListRequiresSingleAncestryError extends GenerateCharacterError {}
class ListRequiresSingleClassError extends GenerateCharacterError {}
class UnknownListGroupError extends GenerateCharacterError {}
class ComboLimitExceededError extends GenerateCharacterError {}

function resolveOrExit(slot, input, label) {
  const value = resolveValue(slot, input);
  if (!value) {
    throw new UnknownValueError(`unknown ${label} "${input}"`);
  }
  return value;
}

function resolveLanguage(data, input) {
  return data.languages.find(l => l.code === input);
}

function resolveLanguageOrExit(data, input) {
  const value = resolveLanguage(data, input);
  if (!value) {
    throw new UnknownLanguageError(`unknown language "${input}"`);
  }
  return value;
}

function subclassSlotsOf(classValue) {
  return (classValue.selects || []).filter(name => !name.startsWith('feat/'));
}

function listSlotValues(slot, label) {
  console.log(`${label}:`);
  slot.values
    .map(v => ({
      code: removeRemasterPrefix(v.code),
      name: removeTranslationKey(v.name),
      group: removeTranslationKey(v.group || ''),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(v => {
      console.log(`  ${v.code.padEnd(30)} ${v.name}${v.group ? ` (${v.group})` : ''}`);
    });
}

function splitMultiflag(value) {
  return value.split(new RegExp(`[${SEPARATORS}]`));
}

// classic cartesian product
function cartesian(axesValues) {
  return axesValues.reduce(
    (combos, values) => combos.flatMap(combo => values.map(value => [...combo, value])),
    [[]],
  );
}

const BOOLEAN_FLAGS = new Set([
  'render',
  'open',
  'no-build',
  'clean',
  'purge',
]);

function parseArgs(argv) {
  const args = {
    feats: [],
    classes: [],
    archetypes: [],
    kwargs: [],
    games: [],
    subclasses: [],
    ancestries: [],
    heritages: [],
    backgrounds: [],
    languages: [],
    pages: [],
  };

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
      case 'game': case 'games': args.games.push(...splitMultiflag(value)); break;
      case 'name': args.name = value; break;
      case 'ancestry':
      case 'ancestries': args.ancestries.push(...splitMultiflag(value)); break;
      case 'heritage':
      case 'heritages': args.heritages.push(...splitMultiflag(value)); break;
      case 'background':
      case 'backgrounds': args.backgrounds.push(...splitMultiflag(value)); break;
      case 'class':
      case 'classes': args.classes.push(...splitMultiflag(value)); break;
      case 'subclass':
      case 'subclasses': args.subclasses.push(...splitMultiflag(value)); break;
      case 'feat':
      case 'feats': args.feats.push(...splitMultiflag(value)); break;
      case 'archetype':
      case 'archetypes': args.archetypes.push(...splitMultiflag(value)); break;
      case 'kwarg':
      case 'kwargs': args.kwargs.push(value); break;
      case 'language':
      case 'languages': args.languages.push(...splitMultiflag(value)); break;
      case 'out': args.out = value; break;
      case 'list': args.list = value; break;
      case 'limit': args.limit = parseInt(value, 10); break;
      case 'page':
      case 'pages': args.pages.push(...splitMultiflag(value).map(v => parseInt(v, 10))); break;
      case 'render': args.render = true; break;
      case 'open': args.open = true; break;
      case 'no-build': args.noBuild = true; break;
      case 'clean': args.clean = true; break;
      case 'purge': args.purge = true; break;
      default: throw new UnknownFlagError(`unknown flag --${key}`);
    }
  }

  return args;
}

// trying not to create a separate attribute for every 
// subset of differently names subclasses, so the script
// tries to find the type of slot that fits
function attributesForIdentity(identity, config, game) {
  const data = loadData(game);
  const attributes = { game, ...config.attributes };

  // name
  attributes.name = identity.name || game;

  // ancestry
  const ancestryValue = resolveOrExit(findSlot(data, 'ancestry'), identity.ancestry, 'ancestry');
  attributes.ancestry = ancestryValue.id;

  // heritage
  const heritageSlotName = (ancestryValue.selects || []).find(name => name.startsWith('heritage/'));
  if (heritageSlotName) {
    const heritageValue = resolveOrExit(findSlot(data, heritageSlotName), identity.heritage, 'heritage');
    attributes[heritageSlotName] = heritageValue.id;
  }

  // background
  attributes.background = resolveOrExit(findSlot(data, 'background'), identity.background, 'background').id;

  // class
  const classValues = identity.classes.map(code => resolveOrExit(findSlot(data, 'class'), code, 'class'));
  attributes.classes = classValues.map(cv => cv.id);

  // subclass,
  classValues.forEach((classValue, i) => {
    const slotNames = subclassSlotsOf(classValue);
    if (!slotNames.length) return;
    const originalCode = identity.classes[i];
    const rawSubclass = identity.subclasses[originalCode] ?? identity.subclasses[removeRemasterPrefix(classValue.code)];
    if (!rawSubclass) return;
    const subclassCodes = Array.isArray(rawSubclass) ? rawSubclass : [rawSubclass];
    subclassCodes.forEach(subclassCode => {
      const subclassSlotName = slotNames.find(name => resolveValue(findSlot(data, name), subclassCode));
      if (!subclassSlotName) {
        throw new UnresolvedSubclassError(
          `subclass "${subclassCode}" not found for class "${removeTranslationKey(classValue.name)}" in ${game}`
        );
      }
      attributes[subclassSlotName] = resolveValue(findSlot(data, subclassSlotName), subclassCode).id;
    });
  });

  // feats
  if (identity.feats && identity.feats.length) {
    attributes.feats = identity.feats;
  }

  // archetypes
  if (identity.archetypes && identity.archetypes.length) {
    const archetypeSlot = findSlot(data, 'archetype');
    attributes.archetypes = identity.archetypes.map(code => resolveOrExit(archetypeSlot, code, 'archetype').id);
  }

  // language
  attributes.language = resolveLanguageOrExit(data, identity.language).code;

  return attributes;
}


// apply kwargs into the attributes object
function applyKwargs(attributes, kwargs) {
  kwargs.forEach(raw => {
    const eq = raw.indexOf('=');
    const key = raw.slice(0, eq);
    const value = raw.slice(eq + 1);
    attributes[key] = value;
  });
}

// build json object to send
function buildRequest(attributes) {
  return {
    version: 0,
    data: {
      type: 'character',
      id: Math.random().toString(16).slice(2, 9),
      isLoggedIn: true,
      attributes,
    },
  };
}

// this creates the .json request file to then render
// the character sheet, following the same conventions the site does
function writeRequestFile(name, request) {
  fs.mkdirSync(JSON_DIR, { recursive: true });
  const outFile = path.join(JSON_DIR, `${name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(request, null, 2));
  console.log(`Wrote ${path.relative(process.cwd(), outFile)}`);
}

// TBD: filter/group by certain character traits more easily (???)
// TBD: add support for multiclassing and multiple types of the 
// same attribute being parsed as a single character at once

function cleanOutDir() {
  [JSON_DIR, HTML_DIR].forEach(dir => {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Cleaned ${path.relative(process.cwd(), dir)}`);
  });
}

// send the rebuild to existing build script
function rebuildLibrary(noBuild) {
  if (noBuild) return;
  execSync('npm run build:safe', { cwd: REPO_ROOT, stdio: 'inherit' });
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
// uses execFile (argv array, no shell) throughout so filenames with commas/spaces/etc.
// can't get mangled by manual shell-string quoting
function openFile(filePath) {
  // macOS
  if (process.platform === 'darwin') {
    execFile('open', [filePath]);
    return;
  }

  // Windows
  if (process.platform === 'win32') {
    execFile('cmd.exe', ['/c', 'start', '', filePath]);
    return;
  }

  // WSL
  const isWsl = fs.existsSync('/proc/version')
    && fs.readFileSync('/proc/version', 'utf-8').toLowerCase().includes('microsoft');
  if (isWsl) {
    const winPath = execFileSync('wslpath', ['-w', filePath]).toString().trim();
    execFile('explorer.exe', [winPath]);
    return;
  }

  // Unix
  execFile('xdg-open', [filePath]);
}

function filterToPages(html, pageIndexes) {
  const $ = cheerio.load(html, { decodeEntities: false });

  // pages aren't straight-forward, so this workaround is required
  const pageIds = $('.page-container').map((i, el) => $(el).children('[data-page]').first().attr('data-page')).get();

  let anchorId = null;
  $('.index-button').each((i, el) => {
    const $el = $(el);
    if ($el.find('.index-button__number').text().trim() === '1') anchorId = $el.attr('data-page');
  });
  const anchorPos = pageIds.indexOf(anchorId);

  const targetPageIds = new Set();
  const missing = [];
  pageIndexes.forEach(pageIndex => {
    const targetPageId = pageIds[anchorPos + (pageIndex - 1)];
    if (anchorPos === -1 || targetPageId === undefined) missing.push(pageIndex);
    else targetPageIds.add(targetPageId);
  });

  if (missing.length) console.error(`generate-character: --page ${missing.join(',')} not found`);
  if (!targetPageIds.size) return html;

  $('.page-container').each((i, el) => {
    const $el = $(el);
    if (!targetPageIds.has($el.children('[data-page]').first().attr('data-page'))) {
      $el.remove();
    }
  });
  $('#index-buttons').remove();

  return $.html();
}

// same shape as saveResult in test.js
function saveResult(result, name, openFlag, pages) {
  if (Array.isArray(result)) {
    result.forEach(r => saveResult(r, name, openFlag, pages));
    return;
  }

  if (result.err) {
    console.error('generate-character: render error', result.err);
    return;
  }

  const data = pages.length ? filterToPages(result.data, pages) : result.data;

  fs.mkdirSync(HTML_DIR, { recursive: true });
  const outfile = path.join(HTML_DIR, `${name} - ${result.filename}`);
  fs.writeFileSync(outfile, data);
  console.log(`Rendered ${path.relative(process.cwd(), outfile)}`);

  // open if user requested
  if (openFlag)
    openFile(outfile);
}

function renderToOut(request, name, openFlag, pages) {
  const characterSheets = getCharacterSheets();

  return characterSheets.translationsPromise.then(() => characterSheets.create(request)).then(result => {
    if (result === null) {
      console.error('generate-character: render produced nothing (skipped)');
      return;
    }

    saveResult(result, name, openFlag, pages);
  });
}

function runList(args, game) {
  const data = loadData(game);

  if (args.list === 'language') {
    console.log('language:');
    data.languages
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(l => console.log(`  ${l.code.padEnd(10)} ${l.name}`));
    return;
  }

  if (args.list === 'heritage') {
    if (args.ancestries.length !== 1) {
      throw new ListRequiresSingleAncestryError('--list heritage needs exactly one --ancestry');
    }
    const ancestryValue = resolveOrExit(findSlot(data, 'ancestry'), args.ancestries[0], 'ancestry');
    const heritageSlotName = ancestryValue.selects.find(n => n.startsWith('heritage/'));
    listSlotValues(findSlot(data, heritageSlotName), `heritage (${removeTranslationKey(ancestryValue.name)})`);
    return;
  }

  if (args.list === 'subclass') {
    if (args.classes.length !== 1) {
      throw new ListRequiresSingleClassError('--list subclass needs exactly one --class');
    }
    const classValue = resolveOrExit(findSlot(data, 'class'), args.classes[0], 'class');
    const slotNames = subclassSlotsOf(classValue);
    if (slotNames.length === 0) {
      console.log(`${removeTranslationKey(classValue.name)} has no subclass slot`);
    }
    slotNames.forEach(slotName => listSlotValues(findSlot(data, slotName), slotName));
    return;
  }

  if (['ancestry', 'background', 'class', 'archetype'].includes(args.list)) {
    listSlotValues(findSlot(data, args.list), args.list);
    return;
  }

  throw new UnknownListGroupError(`--list ${args.list} uses ancestry, heritage, background, class, subclass, archetype, or language`);
}

function checkSubclassNeedsOneClass(classVariants, identityClasses, subclassSpecs) {
  if (!subclassSpecs.length) return;

  const classCount = classVariants.length === 1 && classVariants[0] === null
    ? identityClasses.length
    : classVariants.length;
  if (classCount !== 1) {
    throw new SubclassRequiresSingleClassError('--subclass needs exactly one class');
  }
}

function resolveGames(args, config) {
  return args.games.length ? args.games : [config.game];
}

function buildVariants(args, identity) {
  return {
    ancestryVariants: args.ancestries.length ? args.ancestries : [identity.ancestry],
    heritageVariants: args.heritages.length ? args.heritages : [identity.heritage],
    backgroundVariants: args.backgrounds.length ? args.backgrounds : [identity.background],
    languageVariants: args.languages.length ? args.languages : [identity.language],
    classVariants: args.classes.length ? args.classes : [null],
    featVariants: args.feats.length ? args.feats : [null],
    archetypeVariants: args.archetypes.length ? args.archetypes : [null],
  };
}

// subclass depends on which class it's paired with
function buildCombos(games, variants, identity, args) {
  const {
    ancestryVariants, heritageVariants, backgroundVariants, languageVariants,
    classVariants, featVariants, archetypeVariants,
  } = variants;

  checkSubclassNeedsOneClass(classVariants, identity.classes, args.subclasses);

  const independentCombos = cartesian([
    games, ancestryVariants, heritageVariants, backgroundVariants,
    languageVariants, featVariants, archetypeVariants,
  ]);

  const combos = [];
  classVariants.forEach(classValue => {
    const subclassCodes = args.subclasses.length ? args.subclasses : [null];
    subclassCodes.forEach(subclassCode => {
      independentCombos.forEach(([
        game, ancestry, heritage, background, language, featValue, archetypeValue,
      ]) => {
        combos.push({
          game, ancestry, heritage, background, language, classValue, subclassCode, featValue, archetypeValue,
        });
      });
    });
  });
  return combos;
}

function checkComboLimit(combos, limit) {
  if (combos.length > limit) {
    throw new ComboLimitExceededError(`this would generate ${combos.length} new charsheets. Your computer wouldn't like it, so increase the limit to proceed. You can use --limit <integer> for that.`);
  }
}

function computeMultiFlags(combos) {
  const multiOf = key => new Set(combos.map(c => c[key])).size > 1;
  return {
    game: multiOf('game'),
    ancestry: multiOf('ancestry'),
    heritage: multiOf('heritage'),
    background: multiOf('background'),
    language: multiOf('language'),
    classValue: multiOf('classValue'),
    subclassCode: multiOf('subclassCode'),
    featValue: multiOf('featValue'),
    archetypeValue: multiOf('archetypeValue'),
  };
}

function comboIdentityFor(combo, identity) {
  const comboIdentity = {
    ...identity,
    ancestry: combo.ancestry,
    heritage: combo.heritage,
    background: combo.background,
    language: combo.language,
  };
  if (combo.classValue) comboIdentity.classes = [combo.classValue];
  if (combo.featValue) comboIdentity.feats = [combo.featValue];
  if (combo.archetypeValue) comboIdentity.archetypes = [combo.archetypeValue];
  if (combo.subclassCode) {
    const classCode = combo.classValue || identity.classes[0];
    comboIdentity.subclasses = { ...identity.subclasses, [classCode]: combo.subclassCode };
  }
  return comboIdentity;
}

// single file: --out replaces the name outright; multiple files: --out is just a prefix
function nameForCombo(combo, args, identity, multi, multiFlags) {
  if (!multi) {
    return args.out || identity.name || combo.game;
  }

  // generate the filenames based on parts that consitute characters
  const parts = [args.out || DEFAULT_CHARSHEET_PREFIX];
  if (multiFlags.game) parts.push(combo.game);
  if (multiFlags.ancestry) parts.push(combo.ancestry);
  if (multiFlags.heritage) parts.push(combo.heritage);
  if (multiFlags.background) parts.push(combo.background);
  if (multiFlags.language) parts.push(combo.language);
  if (multiFlags.classValue) parts.push(combo.classValue);
  if (multiFlags.subclassCode) parts.push(combo.subclassCode);
  if (multiFlags.featValue) parts.push(combo.featValue);
  if (multiFlags.archetypeValue) parts.push(combo.archetypeValue);
  return parts.join('-');
}

function buildRequests(combos, identity, config, args) {
  const multi = combos.length > 1;
  const multiFlags = computeMultiFlags(combos);

  return combos.map(combo => {
    const comboIdentity = comboIdentityFor(combo, identity);
    let attributes;
    try {
      attributes = attributesForIdentity(comboIdentity, config, combo.game);
    } catch (err) {
      if (!(err instanceof UnresolvedSubclassError)) throw err;
      console.error(`generate-character: skipping - ${err.message}`);
      return null;
    }
    applyKwargs(attributes, args.kwargs);

    const name = nameForCombo(combo, args, identity, multi, multiFlags);
    return { name, request: buildRequest(attributes) };
  }).filter(Boolean);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return Promise.resolve();
  }

  const args = parseArgs(argv);

  if (args.clean) {
    cleanOutDir();
    return Promise.resolve();
  }

  const config = loadConfig();
  const games = resolveGames(args, config);

  rebuildLibrary(args.noBuild);

  if (args.list) {
    runList(args, games[0]);
    return Promise.resolve();
  }

  if (args.purge) {
    cleanOutDir();
  }

  const identity = { ...config.identity };
  if (args.name) identity.name = args.name;

  const variants = buildVariants(args, identity);
  const combos = buildCombos(games, variants, identity, args);
  checkComboLimit(combos, args.limit || DEFAULT_LIMIT);

  const requests = buildRequests(combos, identity, config, args);
  if (requests.length < combos.length) {
    console.error(`generate-character: ${requests.length}/${combos.length} combo(s) generated, ${combos.length - requests.length} skipped`);
  }
  requests.forEach(({ name, request }) => writeRequestFile(name, request));

  if (!args.render) {
    return Promise.resolve();
  }

  return requests.reduce((chain, { name, request }) => chain.then(() => renderToOut(request, name, args.open, args.pages)), Promise.resolve());
}

main().catch(err => {
  if (err instanceof GenerateCharacterError) {
    console.error(`generate-character: ${err.message}`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
