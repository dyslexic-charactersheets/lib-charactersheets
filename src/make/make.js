// Build the lib-charactersheets distribution libraries from the various sources

const fs = require('fs');
const _ = require('lodash');
const handlebars = require('handlebars');


const systems = [ "common", "pathfinder2" ];

// 
var registry = {};
var system = null;

global.addRegistry = function (type) {
    registry[system][type] = {};
}

global.register = function (type, id, item) {
    registry[system][type][id] = item;
}


systems.forEach(function (s) {
    system = s;
    registry[system] = {};
    console.log(system);

    // Set up the registry to recieve elements
    require("../data/"+system+"/init.js");
    
    // read all the registration files
    // ...

});

// build and write the minified library
fs.readFile("../template/lib-charactersheets.js.h", "utf-8", function (tpl) {
    var template = handlebars.compile(tpl);
    var lib = template({
        registry: registry,
    });
    fs.writeFile("../../dist/lib-charactersheets.js", lib);
});