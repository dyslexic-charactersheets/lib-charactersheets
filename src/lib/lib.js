/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

/**
 * Dyslexic Character Sheets module.
 * @module dyslexic-charactersheets
 */

import { Registry } from './classes/Registry';
import { Request } from './classes/Request';
import { loadSystemData, COMMON, PREMIUM, PATHFINDER_2, PATHFINDER_2_REMASTER } from './classes/System';
import { events } from './classes/Events';
import { addAssetsDir } from './data';
import { getFormData } from './formdata';
import { addTranslator, addTranslationData, loadTranslations, loadDefaultTranslations } from './i18n';
import { isNull } from './util';
import { error } from './log';


// start this first, it's the slow bit
loadSystemData([
  COMMON,
  PATHFINDER_2,
  PATHFINDER_2_REMASTER,
  // STARFINDER_2,
  // CORE_FANTASY,
  PREMIUM,
]);

const registry = new Registry();

/**
 * Register for events emitted by the character sheet builder. Known events include 'request', 'createElementsTree', 'render' and 'error'.
 *
 * @param {string} evt - The event code
 * @param  {...any} params - A list of parameters
 */
export function on(evt, ...params) {
  events.on(evt, ...params);
}

/**
 * Event emitted when a client has requested a character sheet.
 *
 * @error CharacterSheets#request
 * @type {object}
 * @property {Object} request - The request object.
 */

/**
 * Event emitted when a character sheet request has been compiled into an element tree.
 *
 * @error CharacterSheets#createElementTree
 * @type {object}
 * @property {Object} elementTree - The compiled element tree.
 * @property {string} title - The title of the character sheet.
 * @property {Object} request - The request object.
 */

/**
 * Event emitted when a character sheet request has been rendered into an HTML document.
 *
 * @error CharacterSheets#render
 * @type {object}
 * @property {string} data - The rendered document.
 * @property {string} title - The title of the character sheet.
 * @property {string} mimeType - the MIME type of the character sheet.
 * @property {Object} request - The request object.
 */

/**
 * Event emitted when an error occurs while creating a character sheet.
 *
 * @error CharacterSheets#error
 * @type {Error}
 */

/**
 * Create a character sheet object.
 *
 * @param {Object} chardesc - A character description object.
 * @returns {Promise} A promise representing a character, party or GM object.
 * @fires CharacterSheets#request
 * @fires CharacterSheets#createElementTree
 * @fires CharacterSheets#render
 * @fires CharacterSheets#error
 */
export function create(chardesc) {
  return new Promise((resolve, reject) => {
    try {
      if (isNull(chardesc)) {
        warn("lib", "Null data");
        return null;
      }
      const request = new Request(chardesc);
      const primaries = request.getPrimaries(registry);
      const promises = primaries.map(p => p.render());

      Promise.all(promises).then(() => {
        promises[0].then(result => {
          resolve(result);
        });
      });
    } catch (err) {
      error("lib", "Error", err);
      reject(err);
    }
  })
}

/**
 * Add a directory where assets (images, fonts etc) may be found.
 * @function addAssetsDir
 * @param {string} dir - A directory containing asset files
 */
export { addAssetsDir };

/**
 * Add a dynamic translator function
 * @function addTranslator
 * @param {translatorCallback} callback - A function that can contribute translations
 */
export { addTranslator };

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
export { addTranslationData };

/**
 * Load translations, either one the library's built-in translations or a PO-formatted file.
 * @function loadTranslations
 * @param {string} lang - The language code, eg "fr" or "fr-CA".
 * @param {string} [filename=] - Optional filename for the PO file.
 * @returns {Promise} Promise for when the file has been loaded.
 */
export { loadTranslations };

/**
 * Load all the built-in translations.
 * @function loadDefaultTranslations
 * @returns {Promise} Promise for when all the default translations have been loaded.
 */
export { loadDefaultTranslations };

/**
 * Get a description of all the available options. Used for building a form.
 * @function getFormData
 * @param {string} system - The ID of the game system, eg "pathfinder2".
 * @returns {Promise} Promise object representing the form data.
 */
export { getFormData };
