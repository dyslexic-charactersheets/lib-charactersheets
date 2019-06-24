var fs = require('fs');

var CharacterSheets = require('../lib/lib-charactersheets.js');
require('../src/make/log.js');

// Barbarian
var barbarian = {
    name: "Amiri, Barbarian",
    units: [
        'core',
        'theme/pathfinder',
        'base',
        'option/build',
        'ancestry/human',
        'class/barbarian',
        'option/permission',
    ],
    // documentColour: '#661b14',
    // accentColour: '#a65e08',
    documentColour: '#264e80',
    accentColour: '#a65e08',
    portrait: 'images/Barbarian - Amiri - Yeti Hide.jpg',
    background: 'images/frost1.jpg',
};

// Wizard
var wizard = {
    name: "Ezren, Wizard",
    units: [
        'core',
        'theme/pathfinder',
        'base',
        'option/build',
        'ancestry/human',
        'background/scholar',
        'class/wizard',
        'option/permission',
        'option/spellbook',
        'feat/wizard/counterspell',
        'feat/wizard/familiar',
        'option/animal-companion',
    ],
    documentColour: '#264e80',
    accentColour: '#a65e08',
    portrait: 'images/wizard-ezren-runes.png',
    background: 'images/paper3.jpg',
};

// Cleric
var cleric = {
    name: "Hallundan, Cleric",
    units: [
        'core',
        'theme/pathfinder',
        'base',
        // 'ancestry/dwarf',
        // 'background/barkeep',
        // 'class/cleric',
        // 'option/spellbook',
    ],
    documentColour: '#102820',
    accentColour: '#a6085e',
    portrait: 'images/Priestess of Torag.jpg',
    background: 'images/paper3.jpg',
}

var test = {
    name: "Test",
    units: [
        'core',
        'theme/pathfinder',
        'test'
    ]
}

var character = CharacterSheets(cleric);
character.create(data => {
    // console.log(JSON.stringify(data, null, 2));
    var filename = __dirname+'/prototype8.html';
    log("test", filename);
    fs.writeFile(filename, data, (err) => {
        if (!!err)
            error("test", err);
        log("test", "OK");
    });
});
// console.log(data);