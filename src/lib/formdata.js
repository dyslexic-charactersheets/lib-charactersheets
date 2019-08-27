import { readFile } from 'fs';

import { has } from './util';
import { log, error } from './log';

let promises = {};

export function getFormData(system, callback) {
  if (!has(promises, system)) {
    promises[system] = new Promise((resolve, reject) => {
      let formDataFile = __dirname+'/data-'+system+'.json';
      log("formdata", "Loading file", formDataFile);
      readFile(formDataFile, 'utf-8', (err, data) => {
        if (err) {
          error("formdata", `Error loading form data ${formDataFile}:`, err);
          reject();
          return;
        }
        
        log("formdata", "Loaded file", formDataFile);

        let formdata = JSON.parse(data);

        resolve(formdata);
      });
    });
  }

  promises[system].then(callback);
  return;
}
