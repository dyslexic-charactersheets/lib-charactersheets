'use strict';

// import { log } from '../log';

require('./log');

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

// const baseDir = path.dirname(__dirname)+"/";
// log("data", "Base dir:", baseDir);

// var loadingQueue = [];

// var storedData = {};
// var base64Data = {};
// var storedDataURLs = {};

const MIME_SVG = 'image/svg+xml';
const MIME_PNG = 'image/png';
const MIME_JPEG = 'image/jpeg';
// const MIME_WOFF = 'application/font-woff;charset=utf-8';
// const MIME_WOFF = 'application/x-font-woff;charset=utf-8';
const MIME_WOFF = 'application/x-font-woff;charset=utf-8';
// const MIME_WOFF = 'font/woff;charset=utf-8';
const MIME_WOFF2 = 'application/font-woff2;charset=utf-8'
const MIME_SCSS = 'text/x-scss';
const MIME_HANDLEBARS = 'text/x-handlebars';

function mimeType(filename) {
    var ext = filename.match(/\..*$/)[0];
    switch (ext) {
        case '.svg': return MIME_SVG;
        case '.png': return MIME_PNG;
        case '.jpg': case '.jpeg': return MIME_JPEG;
        case '.woff': return MIME_WOFF;
        case '.woff2': return MIME_WOFF2;
        case '.scss': return MIME_SCSS;
        case '.h': return MIME_HANDLEBARS;
        default: return "text/plain";
    }
}

function processBase64(data) {
    if (_.isUndefined(data) || _.isNull(data))
        return '';
    data = data.replace(/\n$/, '');
    data = data.replace(/[\r\n]/g, '');
    return data;
}

function processSVG(data) {
    // log("data", "processSVG");
    data = data.replace(/<!--.*?-->/g, '');
    data = data.replace(/[\r\n]\s*/g, ' ');
    data = data.replace(/>\s*</g, '><');
    // data = data.replace(/>[\s\r\n]*</g, '><');
    data = data.replace(/^(.|[\r\n])*?<svg/, '<svg');
    data = data.replace(/\s*$/, '');
    
    // data = replaceColours(data); // DON'T DO THIS UNTIL THE BUILD PHASE
    data = data.replace(/#/g, '%23');

    return data;
}

function processRaw(data) {
    // console.log("processRaw");
    data = data.replace(/#/g, '%23');
    return data;
}

// function waitForData (callback) {
//     Promise.all(loadingQueue).then(callback);
// };

function toDataURL (data, base64, filename) {
    var mime = mimeType(filename);
    switch (mime) {
        case MIME_SVG:
            // log("data", "Returning data for", filename);
            if (_.isNull(data) || _.isEmpty(data)) {
                warn("data", 'No data for file:', filename);
                return '';
            }
            data = processSVG(data);
            return 'data:'+mime+','+data;

        default:
            // log("data", "Returning base64 data for", filename);
            if (_.isNull(base64) || _.isEmpty(base64)) {
              warn("data", 'No base64 data for file:', filename);
              return '';
            }
            base64 = processBase64(base64);
            return 'data:'+mime+';base64,'+base64;
    }
}

function getDataURL (unit, filename) {
    // log("data", "getDataURL", unit+":"+filename);
    var data = (_.has(CharacterSheets._assets, unit) && _.has(CharacterSheets._assets[unit], filename) && !_.isEmpty(CharacterSheets._assets[unit][filename])) ?
        CharacterSheets._assets[unit][filename] :
        CharacterSheets._allAssets[filename];
        
    var base64name = filename+".base64";
    var base64 = (_.has(CharacterSheets._assets, unit) && _.has(CharacterSheets._assets[unit], base64name) && !_.isEmpty(CharacterSheets._assets[unit][base64name])) ?
        CharacterSheets._assets[unit][base64name] :
        CharacterSheets._allAssets[base64name];


    if (_.isNull(data) && _.isNull(base64)) {
        // log("data", "Data URL: Data not found", unit+":"+filename);
        return '';
    } else {
        // log("data", "Data URL: data:", _.isNull(data) ? "no" : "yes", " base64:", _.isNull(base64) ? "no" : "yes");
    }
    var url = toDataURL(data, base64, filename);
    // log("data", "URL:", url.substr(0, 30)+"...");
    return url;
}

module.exports = {
    // getDataURL: getDataURL,
    toDataURL: toDataURL,
};
