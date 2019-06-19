'use strict';

import { log } from '../log';

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const Handlebars = require('handlebars');

// select stylesheet parts
var stylesheetsUnits = [
    "frame",
    "fonts_pathfinder",
    "base",
    "size_normal",
    "style_pathfinder"
];

var stylesheets = {};

stylesheetsUnits.forEach(unit => {
    preloadQueue(new Promise(function (resolve, reject) {
        var filename = path.dirname(__dirname)+"/style/"+unit+"/"+unit+".scss";
        sass.render({
            file: filename,
            outputStyle: 'compressed',
            
        }, function(err, result) {
            if (err) {
                error("stylesheet", "Error preloading "+filename, err);
                reject(err);
                return;
            }

            // substitute 
            var css = result.css.toString();
            preloadLinkedData(css, filename);
            stylesheets[unit] = css;
            resolve();
        });
    }));
});

Handlebars.registerHelper('dataurl', function (filename) {
	return getDataURL(filename, false);
});

Handlebars.registerHelper('dataurlraw', function (filename) {
	return getDataURL(filename, true);
});


CharacterSheets.loadStylesheet = function (content) {
    
}


CharacterSheets.stylesheet = function () {
    // find both SASS-compiled and data-URL-embedded parts for each of those
    var cssParts = [];
    stylesheetsUnits.forEach(unit => {
        css = stylesheets[unit];
        var template = Handlebars.compile(css);
        var rendered = template({});
        if (unit != "frame")
            rendered = replaceColours(rendered);
        cssParts.push(rendered);
    });

    // put it all together
    log("stylesheet", "Found", cssParts.length, "stylesheet parts");
    return cssParts.join("");
};