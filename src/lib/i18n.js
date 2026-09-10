/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { existsSync, readdir, readFile } from 'fs';
import { log, error } from './log';
import { isString, isNumber, isBoolean, isNull } from './util';
import { has } from './util/objects';

let translatorCallbacks = [];

export function translate(str, doc) {
  if (str == "") {
    return "";
  }
  const language = doc.language;

  const meta = {};
  for (const callback of translatorCallbacks) {
    let translation = callback(str, language, meta);
    if (!isNull(translation)) {
      return translation;
    }
  }

  return str;
}

export function addTranslator(callback) {
  translatorCallbacks.push(callback);
}

export function __(str, doc) {
  if (isNumber(str)) {
    str = "" + str;
  }
  if (!isString(str)) {
    error("i18n", "Not a string:", str);
    if (isBoolean(str)) {
      return translate(str ? "true" : "false", doc);
    }
    if (isNumber(str)) {
      return ""+str;
    }
    throw new Error("Not a string");
  }
  return str.replace(/_\{(.*?(#\{.*?\}.*?)*)\}/gs, (m, p) => translate(p, doc));
}

export function _e(str, doc) {
  return esc(__(str, doc), true, true);
}


// Escape strings for HTML
export function esc(content, newlines = false, bbformat = true) {
  content = content.replace(/#{.*?}/g, '');
  // content = _.escape(content);
  content = content.replace(/’/g, '&rsquo;').replace(/‘/g, '&lsquo;');
  content = content.replace(/—/g, '&mdash;');
  content = content.replace(/&amp;(.+);/, '&$1;');

  if (newlines) {
    content = content.replace(/[\n\r]+/g, '<br>');
  }

  if (bbformat) {
    content = format_string(content);
  }
  return content;
}

const ACTION_ICONS = {
  'bon mot': 'action',
  'cover tracks': 'action',
  'create a distraction': 'action',
  'create a diversion': 'action',
  'demoralise': 'action',
  'devise a stratagem': 'action',
  'dirty trick': 'action',
  'disarm': 'action',
  'escape': 'action',
  'feint': 'action',
  'grapple': 'action',
  'grapples': 'action',
  'hide': 'action',
  'lie': 'action',
  'lies': 'action',
  'make an impression': 'action',
  'making an impression': 'action',
  'perform': 'action',
  'point out': 'action',
  'quick alchemy': 'action',
  'reactive strike': 'reaction',
  'recall knowledge': 'action',
  'reposition': 'action',
  'requests': 'action',
  'seek': 'action',
  'sense motive': 'action',
  'shove': 'action',
  'step': 'action',
  'stride': 'action',
  'strike': 'action',
  'strikes': 'action',
  'sustain': 'action',
  'track': 'action',
  'trip': 'action',
  'tumble through': 'action',
};

const SKILL_ATTRIBUTES = {
  acrobatics: 'DEX',
  arcana: 'INT',
  athletics: 'STR',
  crafting: 'INT',
  deception: 'CHA',
  diplomacy: 'CHA',
  intimidation: 'CHA',
  medicine: 'WIS',
  nature: 'WIS',
  occultism: 'INT',
  perception: 'WIS',
  performance: 'CHA',
  religion: 'WIS',
  society: 'INT',
  stealth: 'DEX',
  survival: 'WIS',
  thievery: 'DEX',
  lore: 'INT',
};

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function format_string(content) {
  content = content.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
  content = content.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
  content = content.replace(/\[trait\](.*?)\[\/trait\]/g, (m, word) => `<span class='flag'>${capitalise(word)}</span>`);
  content = content.replace(/\[effect\](.*?)\[\/effect\]/g, (m, word) => `<span class='effect'>${capitalise(word)}</span>`);
  content = content.replace(/\[action\](.*?)\[\/action\]/g, (m, word) => {
    const icon = ACTION_ICONS[word.toLowerCase()];
    const iconHtml = icon ? `<i class="icon icon_${icon} icon--inline"></i>&nbsp;` : '';
    return `${iconHtml}<span class='action'>${capitalise(word)}</span>`;
  });
  content = content.replace(/\[skill\](.*?)\[\/skill\]/g, (m, word) => {
    const attr = SKILL_ATTRIBUTES[word.toLowerCase()];
    const cls = attr ? `skill colour_${attr}` : 'skill';
    return `<span class='${cls}'>${capitalise(word)}</span>`;
  });
  content = content.replace(/\[prof\](.*?)\[\/prof\]/g, (m, word) => `<span class='prof'>${capitalise(word)}</span>`);
  for (const rank of ['untrained', 'trained', 'expert', 'master', 'legendary']) {
    const re = new RegExp(`\\[${rank}\\]`, 'g');
    content = content.replace(re, `<i class="icon icon_proficiency-${rank} icon--inline"></i>`);
  }
  content = content.replace(/\[dtype\](.*?)\[\/dtype\]/g, (m, word) => `<span class='dtype'>${capitalise(word)}</span>`);
  content = content.replace(/\[str\]/g, "<span class='colour_STR'>STR</span>");
  content = content.replace(/\[dex\]/g, "<span class='colour_DEX'>DEX</span>");
  content = content.replace(/\[con\]/g, "<span class='colour_CON'>CON</span>");
  content = content.replace(/\[int\]/g, "<span class='colour_INT'>INT</span>");
  content = content.replace(/\[wis\]/g, "<span class='colour_WIS'>WIS</span>");
  content = content.replace(/\[cha\]/g, "<span class='colour_CHA'>CHA</span>");
  content = content.replace(/\[fort\]/g, "<span class='colour_CON'>Fortitude</span>");
  content = content.replace(/\[reflex\]/g, "<span class='colour_DEX'>Reflex</span>");
  content = content.replace(/\[will\]/g, "<span class='colour_WIS'>Will</span>");
  return content;
}

export function parsePO(data) {
  if (isNull(data)) {
    warn("i18n", );
    return {};
  }

  var trans = {};

  var lines = data.split(/\n/);
  var current_msgid = "";
  var current_msgstr = "";
  var current_msgctxt = "";
  var lastLine = "";

  function submit() {
    if (current_msgstr != "") {
      trans[current_msgid] = current_msgstr;
    }
    // reset for the next message
    current_msgid = "";
    current_msgstr = "";
    current_msgctxt = "";
    lastLine = "";
  }

  lines.forEach(line => {
    if (line.match(/^#/))
      return;

    var msgid = line.match(/^msgid \"(.*)\"/);
    if (msgid) {
      submit();
      lastLine = "msgid";
      current_msgid = msgid[1];
    }
    var msgstr = line.match(/^msgstr \"(.*)\"/);
    if (msgstr) {
      lastLine = "msgstr";
      current_msgstr = msgstr[1];
    }
    var msgctx = line.match(/^msgctxt \"(.*)\"/);
    if (msgctx) {
      lastLine = "msgctxt";
      current_msgctxt = msgctxt[1];
    }
    var contstr = line.match(/^\"(.*)\"/);
    if (contstr) {
      switch (lastLine) {
        case "msgid": current_msgid = current_msgid + "\n" + contstr[1]; break;
        case "msgstr": current_msgstr = current_msgstr + "\n" + contstr[1]; break;
        case "msgctxt": current_msgctxt = current_msgctxt + "\n" + contstr[1]; break;
      }
    }
  });

  submit();
  return trans;
}

export function addTranslationData(lang, data) {
  let translations = parsePO(data);
  addTranslator((str, language, meta) => {
    if (language != lang) {
      return null;
    }

    if (has(translations, str)) {
      return translations[str];
    }
    return null;
  });
  return Object.keys(translations).length;
}

export function loadTranslations(lang, filename = null) {
  let isDefault = true;
  if (isNull(filename)) {
    filename = __dirname + '/i18n/' + lang + '.po';
    isDefault = false;
  }
  return new Promise((resolve, reject) => {
    if (existsSync(filename)) {
      readFile(filename, 'utf-8', (err, data) => {
        let num = addTranslationData(lang, data);
        if (isDefault) {
          log("i18n", `Loaded ${num} translations for ${lang}`);
        } else {
          log("i18n", `Loaded ${num} translations for ${lang}`, filename);
        }
        resolve();
      });
    } else {
      warn("i18n", "File not found:", filename);
      resolve();
    }
  });
}

export function loadDefaultTranslations() {
  return new Promise((resolve, reject) => {
    readdir(__dirname + "/i18n", (err, files) => {
      if (err) {
        log("i18n", "Error loading languages", err);
        reject();
        return;
      }
      let promises = [];
      files.forEach(file => {
        if (file.match(/\.po$/)) {
          let lang = file.replace(/\.po$/, '');
          let promise = loadTranslations(lang, __dirname + "/i18n/" + file);
          promises.push(promise);
        }
      });
      Promise.all(promises).then(() => {
        log("i18n", "All languages loaded");
        resolve();
      });
    });
  });
}
