import { existsSync } from "fs";
import { log, error } from './log';

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

export function inferMimeType(filename) {
  if (!filename.match(/\..*$/))
    return 'text/plain';
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
  if (data === null)
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

function needsBase64(filename) {
  var mime = inferMimeType(filename);
  switch (mime) {
    case MIME_SVG:
      return false;
    default:
      return true;
  }
}

export function toDataURL(data, mimeType) {
  if (data === null) {
    warn("data", 'No data for file:', filename);
    return '';
  }

  // var mime = mimeType(filename);
  switch (mimeType) {
    case MIME_SVG:
      data = processSVG(data);
      return 'data:' + mimeType + ',' + data;

    default:
      data = processBase64(data);
      return 'data:' + mimeType + ';base64,' + data;
  }
}

// Assets on disk
var assetsDirs = [
  __dirname + '/assets/'
];

export function addAssetsDir(dir) {
  if (!dir.match(/\/$/))
    dir = dir + '/';
  assetsDirs.push(dir);
}

export function locateAsset(filename, cb) {
  // log("data", "Locating asset:", filename, assetsDirs);
  assetsDirs.flatMap(dir => {
    let name = dir + filename;
    let file = needsBase64(filename) ? (name + '.base64') : name;
    if (existsSync(file)) {
      // log("data", "Located asset", name);
      cb(name);
      return;
    }
  })
}
