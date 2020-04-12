/**
 * Dyslexic Character Sheets module.
 * @module dyslexic-charactersheets
 */

 import { Registry } from './classes/Registry';
import { Request } from './classes/Request';
import { loadSystemData } from './classes/System';
import { Events } from './classes/Events';
import { addAssetsDir as addAssetsDirF } from './data';
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

/**
 * Create a character sheet object.
 * @param {Object} chardesc - A character description object.
 * @returns A character, party or GM object.
 */
export function create(chardesc) {
  if (isNull(chardesc)) {
    warn("lib", "Null data");
    return null;
  }
  const request = new Request(chardesc);
  const primary = request.getPrimaries(registry);
  return primary[0];
}

/**
 * Add a directory where assets (images, fonts etc) may be found.
 * @function addAssetsDir
 * @param {string} dir 
 */
export const addAssetsDir = addAssetsDirF;

/**
 * Add a dynamic translator function
 * @function addTranslator
 * @param {translatorCallback} callback
 */
export const addTranslator = addTranslatorF;

/**
 * @callback translatorCallback
 * @param {string} str - The message to be translated.
 * @param {string} language - The language code, eg "fr" or "fr-CA".
 * @param {Object} meta - Metadata for the object, which may serve to discern ambiguous uses.
 */

/**
 * Add translation data in PO format.
 * @function addTranslationData
 * @param {string} lang - The language code, eg "fr" or "fr-CA".
 * @param {string} data - PO-formatted translation data file
 * @returns {number} The number of translations extracted from the data.
 */
export const addTranslationData = addTranslationDataF;

/**
 * Load translations, either one the library's built-in translations or a PO-formatted file.
 * @function loadTranslations
 * @param {string} lang - The language code, eg "fr" or "fr-CA".
 * @param {string} [filename=] - Optional filename for the PO file.
 * @returns {Promise} Promise for when the file has been loaded.
 */
export const loadTranslations = loadTranslationsF;

/**
 * Load all the built-in translations.
 * @function loadDefaultTranslations
 * @returns {Promise} Promise for when all the default translations have been loaded.
 */
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

/**
 * This callback is 
 * @callback formdataCallback
 * @param {Object} data - Form data, containing selects and options
 */

/**
 * Get a description of all the available options. Used for building a form.
 * @function getFormData
 * @param {string} system - The ID of the game system, eg "pathfinder2".
 * @param {formdataCallback} callback - The callback that will be given the form data
 */
export const getFormData = getFormDataF;
