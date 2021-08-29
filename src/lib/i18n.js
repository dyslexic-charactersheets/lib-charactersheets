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

export function format_string(content) {
  content = content.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
  content = content.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
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
      Promise.all(promises).then(resolve);
    });
  });
}
