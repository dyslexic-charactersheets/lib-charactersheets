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
    portrait: 'portraits/Barbarian - Amiri - Yeti Hide.jpg',
    background: 'backgrounds/frost1.jpg',
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
    portrait: 'portraits/wizard-ezren-runes.png',
    background: 'backgrounds/paper3.jpg',
};

// Cleric
var cleric = {
    name: "Hallundan, Cleric",
    units: [
        'core',
        'theme/pathfinder',
        'base',
        'ancestry/elf',
        'background/noble',
        'class/cleric',
        'option/spellbook',
        // 'option/animal-companion',
    ],
    documentColour: '#102820',
    accentColour: '#a6085e',
    portrait: 'portraits/Priestess of Torag.jpg',
    background: 'backgrounds/paper3.jpg',
}

// Druid
var druid = {
    name: "Estrelle, Druid",
    units: [
        'core',
        'theme/pathfinder',
        'base',
        'ancestry/elf',
        'background/nomad',
        'class/druid',
        'select/druid/order/leaf',
        'option/build',
        'option/spellbook',
        'option/animal-companion',
        // 'feat/druid/wild-shape',
    ],
    documentColour: '#102820',
    accentColour: '#a6085e',
    portrait: 'portraits/Elf Druid.jpg',
    animal: 'portraits/vine-leshy.png',
    background: 'backgrounds/paper3.jpg',
}

var test = {
    name: "Test",
    units: [
        'core',
        'theme/pathfinder',
        'test'
    ]
}

var druid5e = {
    name: "5e Druid",
    game: 'dnd5e',
    units: [
        'core',
        'theme/pathfinder',
        'base',
        'ancestry/elf',
        'class/druid',
        'subclass/druid/circle-of-the-land',
    ],
    logo: '',
    documentColour: '#102820',
    accentColour: '#a6085e',
    portrait: 'portraits/Elf Druid.jpg',
    animal: 'portraits/large_riding_dog.jpg',
    background: 'backgrounds/paper3.jpg',
}

var character = CharacterSheets(druid);
character.create(data => {
    // console.log(JSON.stringify(data, null, 2));
    var filename = __dirname+'/test.html';
    log("test", filename);
    fs.writeFile(filename, data, (err) => {
        if (!!err)
            error("test", err);
        log("test", "OK");
    });
});
// console.log(data);