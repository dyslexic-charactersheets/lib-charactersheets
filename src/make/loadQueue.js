'use strict';

const fs = require('fs');

const _ = require('lodash');


var loadPromises = [];

class LoadQueue {
    constructor(binmode) {
        this._by_filename = {};
        this._data = {};
    }

    enqueue(filename, callback) {
        var promise = new Promise((resolve, reject) => {
            try {
                callback(resolve, reject);
            } catch (e) {
                reject(e);
            }
        });
        this._by_filename[filename] = promise;
        return promise;
    }

    loadItem(filename, callback) {
        var d = this._data;
        if (_.has(this._by_filename, filename)) {
            this.readyItem(filename, callback);
            return;
        }
    
        // Actually load a file
        var promise = new Promise((resolve, reject) => {
            var encoding = 'utf-8';
            if (filename.match(/\.(png|jpg|jpeg)$/)) encoding = 'binary';
            fs.readFile(filename, encoding, function (err, data) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        // warn("load", "No such file", filename);
                        return;
                    }
                    error("load", "Error loading file", filename);
                    reject();
                    return;
                }
                d[filename] = data;
                if (callback !== null) {
                    callback(data, filename);
                    resolve();
                }
            });
        });
    
        this._by_filename[filename] = promise;
        loadPromises.push(promise);
        return promise;
    }

    // callback(file, rel)
    walkDirectory(dir, test, callback) {
        var f = this._by_filename;
        var d = this._data;

        function walk(absdir, reldir) {
            // log("load", "Walking...", reldir);
            try {
                var files = fs.readdirSync(absdir, { withFileTypes: true });
                _.each(files, file => {
                    var absfile = absdir+"/"+file.name;
                    var relfile = (reldir == "" ? "" : reldir+"/")+file.name;
                    if (file.isDirectory()) {
                        walk(absfile, relfile);
                    } else {
                        if (test(relfile)) {
                            var filepromise = new Promise((resolve, reject) => {
                                fs.readFile(absfile, 'utf-8', (err, data) => {
                                    // log("load", "Walking file...", reldir);
                                    if (err) {
                                        error("load", "Error reading file", absfile, error);
                                        return;
                                    }

                                    d[absfile] = callback(data, relfile);
                                    resolve();
                                })
                            });
                            loadPromises.push(filepromise);
                            f[relfile] = filepromise;
                        }
                    }
                });
            } catch (e) {
                error("load", "Error walking directory", absdir, e);
                return;
            }
        };

        // log("load", "Walking dir:", dir);
        walk(dir, '');
    }

    readyItem(filename, callback) {
        if (_.has(this._data, filename)) {
            callback(this._data[filename]);
        }
        if (_.has(this._by_filename, filename)) {
            this._by_filename[filename].then(callback);
        }
    }

    getItem(filename) {
        if (_.has(this._data, filename)) {
            return this._data[filename];
        }
    }

    ready(callback) {
        Promise.all(_.values(this._by_filename)).then(callback).catch(err => {
            error("load", "Queue error", err, err.stack);
        });
    }
}

module.exports = {
    files: new LoadQueue(),
    assets: new LoadQueue(),
    stylesheets: new LoadQueue(),
    javascripts: new LoadQueue(),
    units: new LoadQueue(),
    ready: callback => {
        Promise.all(loadPromises).then(() => {
            Promise.all(loadPromises).then(callback).catch(err => {
                error("load", "Queue error:", err, err.stack);
            });
        }).catch(err => {
            error("load", "Queue error:", err, err.stack);
        });
    }
}

