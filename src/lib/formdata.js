import { readFile } from 'fs';

import { has } from './util';
import { log, error } from './log';
import { ready } from './classes/System';

const promises = {};

export function getFormData(system, callback) {
  if (!has(promises, system)) {
    promises[system] = new Promise((resolve, reject) => {
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
  }
  return promises[system];
}
