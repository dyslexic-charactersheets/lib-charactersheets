/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { readFile } from 'fs';

import { has } from './util/objects';
import { log, error } from './log';
import { ready } from './classes/System';

const promises = {};

export function getFormData(system) {
  if (!has(promises, system)) {
    let promise = new Promise((resolve, reject) => {
      ready(() => {
        const formDataFile = `${__dirname}/data-${system}.json`;
        log('formdata', 'Loading file', formDataFile);
        readFile(formDataFile, 'utf-8', (err, data) => {
          if (err) {
            error('formdata', `Error loading form data ${formDataFile}:`, err);
            reject(err);
          } else {
            log('formdata', 'Loaded file', formDataFile);
            const formdata = JSON.parse(data);
            resolve(formdata);
          }
        });
      });
    });
    promises[system] = promise;
    return promise;
  }
  return promises[system];
}
