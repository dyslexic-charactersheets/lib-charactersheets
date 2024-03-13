'use strict';

const fs = require('fs');
const fsPromises = require('node:fs/promises');
const path = require('path');

const _ = require('lodash');
const jsYaml = require('js-yaml');
const sass = require('node-sass');
const Handlebars = require('handlebars');
// const xgettext = require('xgettext-regex')

const load = require('./loadQueue');
const unitExpander = require('./unitExpander');
const util = require('./util');
const i18n = require('./i18n');

const dataURLs = require('./dataURLs');

const ERR_LEEWAY = 3;

var _units = {};
var _assets = {};
var _allAssets = {};

function getDataURL(unit, filename) {
  // log("data", "getDataURL", unit+":"+filename);
  var data = (_.has(_assets, unit) && _.has(_assets[unit], filename) && !_.isEmpty(_assets[unit][filename])) ?
    _assets[unit][filename] :
    _allAssets[filename];

  var base64name = filename + ".base64";
  var base64 = (_.has(_assets, unit) && _.has(_assets[unit], base64name) && !_.isEmpty(_assets[unit][base64name])) ?
    _assets[unit][base64name] :
    _allAssets[base64name];


  if (_.isNull(data) && _.isNull(base64)) {
    log("data", "Data URL: Data not found", unit + ":" + filename);
    return '';
  } else {
    // log("data", "Data URL: data:", _.isNull(data) ? "no" : "yes", " base64:", _.isNull(base64) ? "no" : "yes");
  }
  var url = dataURLs.toDataURL(data, base64, filename);
  // log("data", "URL:", url.substr(0, 30)+"...");
  return url;
}

// set up helpers to replace data URLs in stylesheets
Handlebars.registerHelper('dataurl', function (filename, options) {
  // log("units", "dataurl:", filename, " Options:", options);
  var unit = options.data.root.unit;
  return getDataURL(unit, filename);
});

Handlebars.registerHelper('dataurlraw', function (filename, options) {
  // log("units", "dataurlraw:", filename, " Options:", options);
  var unit = options.data.root.unit;
  return getDataURL(unit, filename);
});

Handlebars.registerHelper('dataurl-colourful', function (filename, colourname, options) {
  var unit = options.data.root.unit;
  let url = getDataURL(unit, filename);
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
    warn("units", "File not found", filename);
    return '';
  }

  var data = fs.readFileSync(filename, 'utf-8');
  return data;
});

Handlebars.registerHelper('color', function (colour, options) {
  return 'text-shadow: 0 0 0 '+colour+'; color: transparent;';
});

module.exports = {
  loadSystem: function (system, systemName, callback) {
    var unitsBase = __dirname + '/../units/' + system;
    var debugDir = __dirname + '/../../test/debug/' + system;

    if (!fs.existsSync(unitsBase)) {
      warn("units", "System not found:", systemName);
      return;
    }

    // load units
    var systemUnits = [];

    // log("units", "Searching for units in units/"+system);
    load.units.walkDirectory(unitsBase, fn => fn.match(/\.yml$/), (data, unitfile) => {
      // log("units", "Loading unit", unitfile);

      var shortfile = path.basename(unitfile);
      var unitdir = path.dirname(unitfile);

      // parse the data
      try {
        // log("units", "Loading unit", unitfile);
        var unitdata = jsYaml.safeLoad(data);
        if (unitdata == null) {
          error("units", "Empty unit", shortfile);
          return;
        }
      } catch (exception) {
        error("units", "Error parsing", shortfile, exception);

        // print an excerpt to make debugging easier
        if (_.has(exception, "source") && _.has(exception.source, "range")) {
          var range = exception.source.range;
          var start = data.lastIndexOf("\n", range.start);
          var end = data.indexOf("\n", range.end);
          for (var i = 0; i < ERR_LEEWAY; i++) {
            start = data.lastIndexOf("\n", start - 1);
            end = data.indexOf("\n", end + 1);
          }
          var excerpt = data.substring(start, end);
          error("units", excerpt);
          // console.log(excerpt);
        }

        return;
      }

      // scan the 
      var meta = {};
      if (_.has(unitdata, "name")) {
        meta['Unit'] = unitdata.name.replace(/_\{(.*?)\}/g, '$1');
      }
      if (_.has(unitdata, "group")) {
        meta['Source'] = unitdata.group.replace(/_\{(.*?)\}/g, '$1');
      }

      i18n.scan(data, unitfile, system, meta);
      // i18n.scanUnit(unitdata, unitfile, system, meta);

      try {
        if (!_.has(unitdata, "unit")) {
          return;
        }
        var unitid = unitdata.unit;
        unitdata.id = unitid;
        delete unitdata.unit;

        var enabled = _.has(unitdata, "enabled") ? unitdata.enabled : true;
        if (!enabled)
          return;

        // log("units", "Loading unit", unitid, "-", unitdata.name);

        // Only expand the 'inc' section, it messes things up if you do the whole thing.
        if (_.has(unitdata, "inc")) {
          unitdata.inc = util.interpolate(unitdata.inc, {
            unit: unitid,
          });
          unitdata.inc = unitdata.inc.map(unitExpander.expandZone);
        }

        var data;
        try {
          data = jsYaml.safeDump(unitdata);
        } catch (exception) {
          error("units", "Error writing", shortfile, exception);
          warn("units", JSON.stringify(unitdata, null, 2));
        }
        fs.mkdir(debugDir, { recursive: true }, () => {
          fs.writeFile(`${debugDir}/${unitid.replace(/\//g, '-')}.yml`, data, err => {
            if (err) error("units", "Error saving unit", unitid, err);
          });
        });

        unitdata.stylesheet = '';
        // unitdata.assets = {};
        systemUnits.push(unitdata);
        _units[unitid] = unitdata;
        _assets[unitid] = {};

        // Lint! Look for things to fix
        function walkElement(elem) {
          if (Array.isArray(elem)) {
            _.each(elem, (sub) => {
              walkElement(sub);
            });
            return;
          }

          if (_.has(elem, "type")) {
            switch (elem.type) {
              case "calc":
                var output = elem.output;
                if (output.type == "field" && !_.has(output, "eq") && output.control != "compound") {
                  warn("units", `${unitdata.id}: Calculation without eq: ${output.id}`);
                }
                break;
              case "field":
                if (!_.has(elem, "id") && !_.has(elem, "ref")) {
                  warn("units", `${unitdata.id}: Field without ID or reference`, elem);
                }
                break;
            }

            if (_.has(elem, "contents")) {
              walkElement(elem.contents);
            }
          }
        }

        if (_.has(unitdata, "inc")) {
          _.each(unitdata.inc, (inc) => {
            if (_.has(inc, "add")) {
              walkElement(inc.add);
            } else if(_.has(inc, "replace")) {
              walkElement(inc.replace);
            }
          })
        }

        // Load unit stylesheet
        var stylesheetfile = `${unitsBase}/${unitdir}/stylesheet/${shortfile.replace(/\.yml$/, '.scss')}`;

        if (fs.existsSync(stylesheetfile)) {
          load.stylesheets.enqueue(stylesheetfile, function (resolve, reject) {
            // log("units", "Loading stylesheet", unitid);

            sass.render({
              file: stylesheetfile,
              // outputStyle: 'compressed',
              outputStyle: 'compact',
            }, function (err, result) {
              if (err) {
                error("units", "Error rendering", unitid, err);
                reject(err);
                return;
              }

              var css = result.css.toString();
              load.assets.ready(() => {
                var template = Handlebars.compile(css);
                var rendered = `/* ${unitid} */\n` + template({
                  unit: unitid
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

                fs.writeFile(`${debugDir}/${unitid.replace(/\//g, '-')}.css`, rendered, err => {
                  if (err) error("units", "Error saving unit", unitid, err);
                });
                _units[unitid].stylesheet = rendered;
                resolve();
              });
            });
          });
        }

        // Load unit JavaScripts
        // var jsFile = `${unitsBase}/${unitdir}/js/${shortfile.replace(/\.yml$/, '.js')}`;
        // if (fs.existsSync(jsFile)) {
        //   load.javascripts.loadItem(jsFile, (data, filename) => {
        //     if (data != "") {
        //       // log("units", `Templating JS for ${unitid}`);
        //       var template = Handlebars.compile(data);
        //       var rendered = template({
        //         unit: unitid
        //       });

        //       _units[unitid].js = rendered;
        //     }
        //   });
        // }

        
        load.javascripts.enqueue(unitdir+"/js", (resolve, reject) => {
          let jsDir = `${unitsBase}/${unitdir}/js`;
          let jsPromises = [];
          let jsParts = [];

          if (fs.existsSync(jsDir)) {
            fs.readdir(jsDir, (err, files) => {
                if (err) {
                  error("units", "Error reading JS directory", jsDir);
                  reject();
                  return;
                }

                for (let file of files) {
                  if (file.endsWith(".js")) {
                    let filePromise = load.javascripts.loadItem(`${jsDir}/${file}`, (data, filename) => {
                      if (data != "") {
                        // log("units", `Templating JS for ${unitid}: ${file}`);
                        var template = Handlebars.compile(data);
                        var rendered = template({
                          unit: unitid
                        });
          
                        jsParts.push(rendered);
                      }
                    });
                    jsPromises.push(filePromise);
                  } else {
                    error("units", "Not a JS file?", file);
                  }
                }

                Promise.all(jsPromises).then(() => {
                  // log("units", `Found ${jsParts.length} parts for ${unitid}`);
                  _units[unitid].js = jsParts.join("\n");
                  resolve();
                });
              });
          }
        });

        // Load unit assets
        var assetsDir = `${unitsBase}/${unitdir}/assets`;
        if (fs.existsSync(assetsDir)) {
          // log("unit", "Looking for assets:", assetsDir);
          load.assets.walkDirectory(assetsDir, fn => true, (data, assetfile) => {
            // log("units", "Asset loaded", unitid+":"+assetfile);

            // unitassets[assetfile] = data;
            _assets[unitid][assetfile] = data;
            _allAssets[assetfile] = data;
          });
          if (_.has(unitdata, "assets")) {
            var assets = unitdata.assets;
            load.assets.ready(() => {
              unitdata.assets = [];
              _.each(assets, filename => {
                var assetdata = { name: filename };
                if (filename.match(/\.svg$/)) {
                  assetdata.data = (_.has(_assets, unitid) && _.has(_assets[unitid], filename) && !_.isEmpty(_assets[unitid][filename])) ?
                    _assets[unitid][filename] :
                    _allAssets[filename];
                } else {
                  var base64name = filename + ".base64";
                  assetdata.base64 = (_.has(_assets, unitid) && _.has(_assets[unitid], base64name) && !_.isEmpty(_assets[unitid][base64name])) ?
                    _assets[unitid][base64name] :
                    _allAssets[base64name];
                }
                unitdata.assets.push(assetdata);
              })
            });
          }
        }
        // walkAssets(unitdir+'/assets', "", unitid);

      } catch (exception) {
        error("units", "Error reading", shortfile, exception);
      }
    });

    // delay this for 1 second so that the list of promises is fully populated
    setTimeout(() => {
      load.ready(() => {
        // write the translation template
        i18n.writePot(system, systemName);

        // return the units
        let units = _.sortBy(systemUnits, ['id']);
        callback(units);
      });
    }, 2000);
  }
}
