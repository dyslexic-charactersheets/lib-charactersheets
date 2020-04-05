import { Registry } from './classes/Registry';
import { Request } from './classes/Request';
import { loadSystemData } from './classes/System';
import { Events } from './classes/Events';
import { addAssetsDir as _addAssetsDir } from './data';
import { getFormData as getFormDataF } from './formdata';
import { addTranslator as addTranslatorF, addTranslationData as addTranslationDataF, loadTranslations as loadTranslationsF, loadDefaultTranslations as loadDefaultTranslationsF } from './i18n';
import { isNull } from 'util';

// start this first, it's the slow bit
loadSystemData([
  'common',
  'pathfinder2',
  'premium',
]);

const registry = new Registry();

export function create(chardesc) {
  if (isNull(chardesc)) {
    warn("lib", "Null data");
    return null;
  }
  const request = new Request(chardesc);
  const primary = request.getPrimaries(registry);
  return primary[0];
}

export function addAssetsDir(dir) {
  _addAssetsDir(dir);
}

// export function addTranslator(callback) {
//   addTranslatorF(callback);
// }

export const addTranslator = addTranslatorF;

// export function loadPo(lang, filename = null) {
//   loadPoF(lang, filename);
// }

export const addTranslationData = addTranslationDataF;

export const loadTranslations = loadTranslationsF;

export const loadDefaultTranslations = loadDefaultTranslationsF;

export function onCreate(callback) {
  Events.createEvt.on(callback);
}

export function onCreateElementTree(callback) {
  Events.createElementTreeEvt.on(callback);
}

export function onError(callback) {
  Events.errorEvt.on(callback);
}

export const getFormData = getFormDataF;
