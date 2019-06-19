var CharacterSheets = require('../lib/lib-charactersheets.js');

var cleric = {class: "Cleric"};

var character = CharacterSheets(cleric);
var data = character.create();
// console.log(data);