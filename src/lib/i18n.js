import { log, error } from './log';
import { isString, isNumber } from './util';

// TODO i18n API calls to load files or connect to a PO API.

export function translate(str, doc) {
  // TODO i18n
  return str;
}

export function __(str, doc) {
  if (isNumber(str)) {
    str = ""+str;
  }
  if (!isString(str)) {
    error("i18n", "Not a string", str);
    throw "Not a string";
  }
  return str.replace(/_\{(.*?)\}/gs, (m, p) => translate(p, doc));
}
