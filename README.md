# Dyslexic Character Sheets

A library to generate character sheets for Pathfinder 2nd Edition.

See: https://www.dyslexic-charactersheets.com/.

## This is a work in progress

This library is not ready for production use.

## How to use it

The library expects to be given a character's details in the form of a plain JavaScript object, like this:

```json
{
	"game": "pathfinder2",
	"name": "Harry Potter",
	""
}
```

To use it, first install this library:

```bash
$ npm install --save dyslexic-charactersheets
```

Then run code like so.

```js
var dyslexicCharacterSheets = require('dyslexic-charactersheets');

var characterDesc = { ... character description ... };

var characterSheet = dyslexicCharacterSheets(characterDesc);

characterSheet.create(html => {
	// ... save or use the data ...
});
```

## How to test the package

Cloning the package from [source](https://github.com/dyslexic-charactersheets/lib-charactersheets), then run:

```bash
$ npm install
$ npm test
```

This will use the files in `src` to create the files in `lib`, then build a sample character sheet and save it as `test/test.html`