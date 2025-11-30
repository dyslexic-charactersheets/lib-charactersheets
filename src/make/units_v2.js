/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

const fs = require('fs');
const path = require('path');

const jsYaml = require('js-yaml');
// const sass = require('node-sass');
const sass = require('sass');
const Handlebars = require('handlebars');

const i18n = require('./i18n');
const unitExpander = require('./unitExpander');
const {walkDirectory, loadFile, loadRawFile} = require('./load.js');
const {has, interpolate, isEmpty} = require('./util.js');
require('./helpers.js');


function systemDir(system, ...subdirs) {
  var dir = __dirname + '/../units/' + system;
  for (let subdir of subdirs) {
    dir = dir + '/' + subdir;
  }
  return path.normalize(dir);
}

async function loadSystem (system, systemName, callback) {
  var unitsBase = systemDir(system);
  
  if (!fs.existsSync(unitsBase)) {
    warn("units", "System not found:", systemName);
    return;
  }
  
  // find all the units in this system
  log("units", "Looking for units in", systemName);
  let units = [];
  await walkDirectory(unitsBase, (fn) => fn.match(/\.yml$/), (relfile, absfile) => {
    let unitPromise = loadUnit(system, absfile);
    unitPromise.then((unit) => {
      if (unit != null) {
        units.push(unit);
      }
    });
    return unitPromise;
  });
  log("units", `Found ${units.length} units in`, systemName);

  // load assets from all units, then wait for ALL assets
  let assetPromises = [];
  let assetStore = {
    byAsset: {},
    byUnit: {},
  };
  for (let unit of units) {
    await loadUnitAssets(unit, assetPromises, assetStore);
  }
  await Promise.allSettled(assetPromises);
  
  // fill in the JS and stylesheet for all units
  for (let unit of units) {
    unit.jsPromise = loadUnitJavascript(unit, assetStore);
    unit.cssPromise = loadUnitStylesheet(unit, assetStore);
  }

  for (let unit of units) {
    unit.js = await unit.jsPromise;
    delete unit.jsPromise;
    unit.stylesheet = await unit.cssPromise;
    delete unit.cssPromise;
  }

  // clean up the units
  for (let unit of units) {

  }

  return units;
}

async function loadUnit(system, unitfile) {
  var shortfile = path.basename(unitfile);

  // parse the unit
  let data = await loadFile(unitfile);
  let unitdata = jsYaml.safeLoad(data);

  // check the unit
  if (unitdata == null) {
    error("units", "Empty unit", shortfile);
    return null;
  }
  if (!has(unitdata, "unit")) {
    error("units", "loadUnit: No ID for unit", shortfile);
    return null;
  }
  let enabled = has(unitdata, "enabled") ? unitdata.enabled : true;
  if (!enabled) {
    log("units", "loadUnit: Disabled", shortfile);
    return;
  }

  // save ID and path data we'll need later
  unitdata.id = unitdata.unit;
  delete unitdata.unit;

  unitdata.system = system;
  unitdata.unitfile = unitfile;
  unitdata.filename = shortfile;
  unitdata.unitdir = path.dirname(unitfile);
  

  // scan the unit
  var meta = {};
  if (has(unitdata, "name")) {
    meta['Unit'] = unitdata.name.replace(/_\{(.*?)\}/g, '$1');
  }
  if (has(unitdata, "group")) {
    meta['Source'] = unitdata.group.replace(/_\{(.*?)\}/g, '$1');
  }

  i18n.scan(data, unitfile, system, meta);

  if (has(unitdata, "inc")) {
    unitdata.inc = interpolate(unitdata.inc, {
      unit: unitdata.id,
    });
    unitdata.inc = unitdata.inc.map(unitExpander.expandZone);
  }

  lintUnit();
  return unitdata;
}

function lintUnit(unitdata) {
  function walkElement(elem) {
    if (Array.isArray(elem)) {
      for (let sub of elem) {
        walkElement(sub);
      }
      return;
    }

    if (has(elem, "type")) {
      switch (elem.type) {
        case "calc":
          let output = elem.output;
          if (output.type == "field" && !has(output, "eq") && output.control != "compound") {
            warn("units", `${unitdata.id}: Calculation without eq: ${output.id}`);
          }
          break;
        case "field":
          if (!has(elem, "id") && !has(elem, "ref")) {
            warn("units", `${unitdata.id}: Field without ID or reference`, elem);
          }
          break;
      }

      if (has(elem, "contents")) {
        walkElement(elem.contents);
      }
    }
  }

  if (has(unitdata, "inc")) {
    for (let inc of unitdata.inc) {
      if (has(inc, "add")) {
        walkElement(inc.add);
      } else if(has(inc, "replace")) {
        walkElement(inc.replace);
      }
    }
  }
}

async function loadUnitAssets(unitdata, assetPromises, assetStore) {
  if (!has(assetStore.byUnit, unitdata.id)) {
    assetStore.byUnit[unitdata.id] = {};
  }

  const assetsDir = `${unitdata.unitdir}/assets`;
  if (fs.existsSync(assetsDir)) {
    // if (loadQueue.debug) log("unit", "Looking for assets:", assetsDir);
    await walkDirectory(assetsDir, fn => true, (relfile, absfile) => {
      if (relfile.match(/\.svg/) || relfile.match(/\.base64/)) {
        
        // SVG and text files -- load as a string
        let assetPromise = loadFile(absfile).then((data) => {
          if (data === null) {
            error("units", "loadUnitAssets", "No data?", unitdata.id, relfile);
            return;
          }

          assetStore.byAsset[relfile] = data;
          assetStore.byUnit[unitdata.id][relfile] = data;
        }).catch((err) => {
          error("units", "loadUnitAssets", unitdata.id, relfile, err);
        });
        assetPromises.push(assetPromise);

      } else {

        // images and font files -- load as raw data
        let assetPromise = loadRawFile(absfile).then((data) => {
          if (data === null) {
            error("units", "loadUnitAssets", "No data?", unitdata.id, relfile);
            return;
          }

          assetStore.byAsset[relfile] = data;
          assetStore.byUnit[unitdata.id][relfile] = data;
        }).catch((err) => {
          error("units", "loadUnitAssets", unitdata.id, relfile, err);
        });

        assetPromises.push(assetPromise);
      }
    });
  }
}

async function loadUnitStylesheet(unitdata, assetStore) {
  const unitStylesDir = `${unitdata.unitdir}/stylesheet`;
  var stylesheetfile = `${unitStylesDir}/${unitdata.filename.replace(/\.yml$/, '.scss')}`;
  
  if (fs.existsSync(stylesheetfile)) {
    const result = sass.compile(stylesheetfile, {
      outputStyle: 'compressed',
    });
    
    // if (result.err) {
    //   error("units", "Error rendering", unitid, err);
    //   reject(err);
    //   return;
    // }

    // log("units", "Stylesheet rendered", unitdata.id);
    var css = result.css.toString();
    var template = Handlebars.compile(css);
    var rendered = `/* ${unitdata.id} */\n` + template({
      unit: unitdata.id,
      assetStore,
    });

    // Firefox doesn't obey `color-adjust: exact`, so we cheat by replacing all the text colours
    // with zero-blur text shadows in the right colour underneath transparent text
    rendered = rendered.replace(/(?<!-)color: *(.*?);/g, function (match, colour) {
      if (colour == "transparent") {
        return match;
      }
      if (colour.match(/!important$/)) {
        // log("units", "Locked colour:", colour);
        return match;
      }

      return `text-shadow: 0 0 0 ${colour}; color: transparent;`;
    });

    // fs.writeFile(`${debugDir}/${unitid.replace(/\//g, '-')}.css`, rendered, err => {
    //   if (err) error("units", "Error saving unit", unitdata.id, err);
    // });
    // if (loadQueue.debug) log("units", "Stylesheet done", unitdata.id);
    return rendered;
  }
  return "";
}


async function loadUnitJavascript(unitdata, assetStore) {
  // log("units", "Unit dir", unitdata.unitdir);
  const jsDir = `${unitdata.unitdir}/js`;
  // log("units", "loadUnitJavascript", "Looking for script parts", jsDir);

  if (fs.existsSync(jsDir)) {
    // log("units", "loadUnitJavascript", "Looking for script parts", unitdata.id);
    let jsParts = [];
    await walkDirectory(jsDir, (fn) => fn.match(/\.js$/), (relfile, absfile) => {
      return loadFile(absfile).then((data) => {
        if (!isEmpty(data)) {
          let template = Handlebars.compile(data);
          let rendered = template({
            unit: unitdata.id,
            assetStore,
          });
          jsParts.push(rendered);
        }
      });
    });
    // log("units", "loadUnitJavascript", `Joining ${jsParts.length} parts`, unitdata.id);
    return jsParts.join("\n");
  }
  return "";
}


module.exports = {
  loadSystem
}
