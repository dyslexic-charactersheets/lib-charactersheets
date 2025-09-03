/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

const Handlebars = require('handlebars');

const {has, isEmpty, isNull} = require('./util.js');
const dataURLs = require('./dataURLs');

// set up helpers to replace data URLs in stylesheets
Handlebars.registerHelper('dataurl', function (filename, options) {
  // log("helpers", "dataurl:", filename, " Options:", options);
  var unit = options.data.root.unit;
  return getDataURL(unit, filename, options);
});

Handlebars.registerHelper('dataurlraw', function (filename, options) {
  // log("helpers", "dataurlraw:", filename, " Options:", options);
  let unit = options.data.root.unit;
  return getDataURL(unit, filename, options);
});

Handlebars.registerHelper('dataurl-colourful', function (filename, colourname, options) {
  // log("helpers", "dataurl-colourful:", filename, " Options:", options);
  let unit = options.data.root.unit;
  let url = getDataURL(unit, filename, options);
  let colourvar = '--c-'+colourname.toLowerCase();

  function colourReplace(colour) {
    colour = colour.replace('%23', '#').toLowerCase();
    if (colour == 'white' || colour == '#ffffff' || colour == 'rgb(255,255,255)' || colour == 'rgba(255,255,255,1)') {
      return colour;
    }
    // log("units", "Replacing colour", colour);
    return colourvar;
  }

  url = url.replaceAll(/#[0-9a-fA-F]{6}/g, colourReplace);
  url = url.replaceAll(/%23[0-9a-fA-F]{6}/g, colourReplace);
  url = url.replaceAll(/rgba\(.*?,.*?,.*?,(.*?)\)/g, colourReplace);
  return url;
})

Handlebars.registerHelper('embed', function (filename, options) {
  // log("units", "Embed file", filename);
  filename = path.normalize(`${__dirname}/../../${filename}`);

  if (!fs.existsSync(filename)) {
    warn("helpers", "File not found", filename);
    return '';
  }

  let data = fs.readFileSync(filename, 'utf-8');
  return data;
});

Handlebars.registerHelper('color', function (colour, options) {
  return 'text-shadow: 0 0 0 '+colour+'; color: transparent;';
});

function getDataURL(unit, filename, options) {
  let assetStore = options.data.root.assetStore;
  // log("helpers", "Asset store", assetStore);

  // log("data", "getDataURL", unit+":"+filename);
  let data = (has(assetStore.byUnit, unit) && has(assetStore.byUnit[unit], filename) && !isEmpty(assetStore.byUnit[unit][filename])) ?
    assetStore.byUnit[unit][filename] :
    assetStore.byAsset[filename];

  let base64name = filename + ".base64";
  let base64 = (has(assetStore.byUnit, unit) && has(assetStore.byUnit[unit], base64name) && !isEmpty(assetStore.byUnit[unit][base64name])) ?
    assetStore.byUnit[unit][base64name] :
    assetStore.byAsset[base64name];

  if (isNull(data) && isNull(base64)) {
    log("helpers", "Data URL: Data not found", unit + ":" + filename);
    return '';
  } else {
    // log("data", "Data URL: data:", _.isNull(data) ? "no" : "yes", " base64:", _.isNull(base64) ? "no" : "yes");
  }
  // log("helpers", `toDataURL: ${filename} data: ${data === null ? 'absent' : 'present'}, base64: ${base64 === null ? 'absent' : 'present'}`);
  let url = dataURLs.toDataURL(data, base64, filename);
  // log("data", "URL:", url.substr(0, 30)+"...");
  return url;
}
