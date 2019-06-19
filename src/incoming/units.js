'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');


const baseDir = path.dirname(path.dirname(__dirname))+"/units/";
log("units", "Base dir:", baseDir);

var loadedUnits = {};
var loadingQueue = [];

const ERR_LEEWAY = 3;

function loadUnit(unit_id) {
    var filename = "units/"+unit_id+".yml";
	loadingQueue.push(new Promise(function (resolve, reject) {
        log("units", "Loading:", baseDir+filename);
		fs.readFile(baseDir+filename, 'utf-8', function (err, data) {
            if (err) {
                error("units", "Error preloading unit "+unit_id, err);
                reject(err);
                return;
            }

            // parse the data
            try {
                var unitdata = yaml.parse(data);
            } catch (exception) {
                error("units", "YAML error in "+unit_id+".yml:", exception.message);

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
                }

                reject();
                return;
            }

            // unitdata = _.defaults(unitdata, {
            //     group: '',
            //     id: false,
            //     inc: []
            // });
            log("units", `Expanding ${unit_id}`);
            unitdata = CharacterSheets.expandZone(unitdata);

            fs.writeFile(baseDir+'tmp-'+unit_id+'.yml', yaml.stringify(unitdata), err => {});

            // store the data
            loadedUnits[unit_id] = unitdata;
            resolve();
        });
    }));
}

// loadUnit('document');
// loadUnit('base-pathfinder2');

module.exports = function (unit_ids) {
    unit_ids.forEach(unit_id => {
        loadUnit(unit_id);
    });

    return {
        ready: (fn) => {
            Promise.all(loadingQueue).then(() => {
                fn();
            });
        },

        document: () => {
            log("units", "Combining units:", unit_ids);
            var document = CharacterSheets.zoneCompose(loadedUnits['document']);
            
            unit_ids.forEach(unit_id => {
                var unit = loadedUnits[unit_id];
                if (!_.has(loadedUnits, unit_id)) {
                    log("units", "Unit not loaded:", unit_id);
                    return;
                }
                // console.log("Unit:", JSON.stringify(unit, null, 2));

                if (!_.has(unit, "inc")) {
                    return;
                }
                unit.inc.forEach(include => {
                    if (_.has(include, "at")) {
                        if (_.has(include, "add"))
                            document.addAt(include.at, include.add);
                        if (_.has(include, "replace"))
                            document.replaceAt(include.at, include.replace);
                    }
                    if (_.has(include, "define")) {
                        var defaults = _.has(include, "defaults") ? include.defaults : {};
                        document.defineTemplate(include.define, defaults, include.contents);
                    }
                });
            });
            var doc = document.document();
            doc = CharacterSheets.applyContext(doc);
            return doc;
        }
    }
}