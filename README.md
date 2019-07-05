# Dyslexic Character Sheets

A library to generate character sheets for Pathfinder 2nd Edition.

See: https://www.dyslexic-charactersheets.com/.

## This is a work in progress

This library is not ready for production use.

You can follow progress on [the project's Patreon page](https://www.patreon.com/dyslexic_charactersheets).

## How to use it

The library expects to be given a character's details in the form of a plain JavaScript object. Details of the format can be found [in this repo](https://github.com/dyslexic-charactersheets/std).

To use the library, first install it in your package:

```bash
$ npm install --save dyslexic-charactersheets
```

Then run code like so:

```js
var dyslexicCharacterSheets = require('dyslexic-charactersheets');

var characterDesc = { ... character description ... };

var characterSheet = dyslexicCharacterSheets(characterDesc);

characterSheet.create(html => {
	// ... save or use the data ...
});
```

## How to test the package

Clone the package from [source](https://github.com/dyslexic-charactersheets/lib-charactersheets), then run:

```bash
$ npm install
$ npm test
```

This will use the files in `src` to create the files in `lib`, then build a sample character sheet and save it as `test/test.html`