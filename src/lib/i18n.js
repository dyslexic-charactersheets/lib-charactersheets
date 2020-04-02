import { log, error } from './log';
import { isString, isNumber, isNull } from './util';
import * as _ from 'lodash';

let translatorCallbacks = [];

export function translate(str, doc) {
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
    error("i18n", "Not a string", str);
    throw "Not a string";
  }
  return str.replace(/_\{(.*?(#\{.*?\}.*?)*)\}/gs, (m, p) => translate(p, doc));
}

export function _e(str, doc) {
  return esc(__(str, doc), true, true);
}


// Escape strings for HTML
export function esc(content, newlines = false, bbformat = true) {
  content = content.replace(/#{.*?}/g, '');
  content = _.escape(content);
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
  content = content.replace(/\[b\](.*?)\[\/b\]/, '<b>$1</b>');
  content = content.replace(/\[i\](.*?)\[\/i\]/, '<i>$1</i>');
  return content;
}
