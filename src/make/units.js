'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const jsYaml = require('js-yaml');
const sass = require('node-sass');
const Handlebars = require('handlebars');

const load = require('./loadQueue');
const unitExpander = require('./unitExpander');

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
        
    var base64name = filename+".base64";
    var base64 = (_.has(_assets, unit) && _.has(_assets[unit], base64name) && !_.isEmpty(_assets[unit][base64name])) ?
        _assets[unit][base64name] :
        _allAssets[base64name];


    if (_.isNull(data) && _.isNull(base64)) {
        // log("data", "Data URL: Data not found", unit+":"+filename);
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
    // var data = CharacterSheets._assets[unit][filename];
    // return toDataURL(data, filename);
    // return getDataURL(filename, false);

    return getDataURL(unit, filename);
});

Handlebars.registerHelper('dataurlraw', function (filename, options) {
    // log("units", "dataurlraw:", filename, " Options:", options);
    var unit = options.data.root.unit;
    // var asset = CharacterSheets._assets[unit][filename];
    // return toDataURL(data, filename);
	// return getDataURL(filename, true);
    return getDataURL(unit, filename);
});



// function getUnit (unitcode) {
//     // log("units", "getUnit", unitcode);
//     if (_.has(_units, unitcode))
//         return _units[unitcode];
//     else
//         error("units", "getUnit: Unknown unit", unitcode);
// };

// function getUnits(unitcodes) {
//     // log("units", "getUnits", unitcodes);
//     return _.map(unitcodes, code => getUnit(code));
// };

module.exports = {
    loadSystem: function (system, callback) {
        var unitsBase = __dirname+'/../units/'+system;
        var debugDir = __dirname+'/../../test/debug/'+system;

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

                // reject();
                return;
            }

            try {
                var unitcode = unitdata.unit;
                unitdata.id = unitcode;
                var name = unitdata.name;
                // log("units", "Loading unit", unitcode, "-", name);

                // TODO: Preprocess the data??
                
                unitdata = unitExpander.expandZone(unitdata);

                var data = jsYaml.safeDump(unitdata);
                fs.mkdir(debugDir, { recursive: true }, () => {
                    fs.writeFile(`${debugDir}/${unitcode.replace(/\//g, '-')}.yml`, data, err => {
                        if (err) error("units", "Error saving unit", unitcode, err);
                    });
                });

                unitdata.stylesheet = '';
                // unitdata.assets = {};
                systemUnits.push(unitdata);
                _units[unitcode] = unitdata;
                _assets[unitcode] = {};

                // Load unit stylesheet
                var stylesheetfile = `${unitsBase}/${unitdir}/stylesheet/${shortfile.replace(/\.yml$/, '.scss')}`;

                if (fs.existsSync(stylesheetfile)) {
                    load.stylesheets.enqueue(stylesheetfile, function (resolve, reject) {
                        // log("units", "Loading stylesheet", unitcode);
                    
                        sass.render({
                            file: stylesheetfile,
                            // outputStyle: 'compressed',
                            outputStyle: 'compact',
                        }, function(err, result) {
                            if (err) {
                                error("units", "Error rendering", unitcode, err);
                                reject(err);
                                return;
                            }

                            var css = result.css.toString();
                            load.assets.ready(() => {
                                var template = Handlebars.compile(css);
                                var rendered = `/* ${unitcode} */\n`+template({
                                    unit: unitcode
                                });

                                // if (rendered.length > 0)
                                //     log("units", "Loaded stylesheet:", unitcode, rendered.substring(0, 30)+"...");
                                // else
                                //     log("units", "Empty stylesheet:", unitcode);
                                fs.writeFile(`${debugDir}/${unitcode.replace(/\//g, '-')}.css`, rendered, err => {
                                    if (err) error("units", "Error saving unit", unitcode, err);
                                });
                                _units[unitcode].stylesheet = rendered;
                                resolve();
                            });
                        });
                    });
                }

                // Load unit assets
                var assetsDir = `${unitsBase}/${unitdir}/assets`;
                if (fs.existsSync(assetsDir)) {
                    // log("unit", "Looking for assets:", assetsDir);
                    load.assets.walkDirectory(assetsDir, fn => true, (data, assetfile) => {
                        // log("units", "Asset loaded", unitcode+":"+assetfile);
                        // process asset data now, or later?

                        // unitassets[assetfile] = data;
                        _assets[unitcode][assetfile] = data;
                        _allAssets[assetfile] = data;
                    });
                    if (_.has(unitdata, "assets")) {
                        var assets = unitdata.assets;
                        load.assets.ready(() => {
                            unitdata.assets = [];
                            _.each(assets, filename => {
                                var assetdata = { name: filename };
                                if (filename.match(/\.svg$/)) {
                                    assetdata.data = (_.has(_assets, unitcode) && _.has(_assets[unitcode], filename) && !_.isEmpty(_assets[unitcode][filename])) ?
                                        _assets[unitcode][filename] :
                                        _allAssets[filename];
                                } else {
                                    var base64name = filename+".base64";
                                    assetdata.base64 = (_.has(_assets, unitcode) && _.has(_assets[unitcode], base64name) && !_.isEmpty(_assets[unitcode][base64name])) ?
                                        _assets[unitcode][base64name] :
                                        _allAssets[base64name];
                                }
                                unitdata.assets.push(assetdata);
                            })
                        });
                    }
                }
                // walkAssets(unitdir+'/assets', "", unitcode);

            } catch (exception) {
                error("units", "Error reading", shortfile, exception);
            }
        });

        // delay this for 1 second so that the list of promises is fully populated
        setTimeout(() => {
            load.ready(() => {
                callback(systemUnits);
            });
        }, 1000);
    }
}