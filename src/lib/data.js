
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

export function toDataURL (data, filename) {
    if (data === null) {
        warn("data", 'No data for file:', filename);
        return '';
    }

    var mime = mimeType(filename);
    switch (mime) {
        case MIME_SVG:
            data = processSVG(data);
            return 'data:'+mime+','+data;

        default:
            data = processBase64(data);
            return 'data:'+mime+';base64,'+data;
    }
}