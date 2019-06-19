# Dyslexic Character Sheets

A library to generate character sheets.

See: https://www.dyslexic-charactersheets.com/.

## How to use it

The library expects to be given a character's details in the form of a plain JavaScript object, like this:

```json
{
	"game": "pathfinder2",
	"name": "Harry Potter",
	""
}
```

A full specification can be found here: ...

```js
var dyslexic = require('dyslexic-charactersheets');

var character = { ... character description ... };

var charactersheet = dyslexic(character);


```

## How to build the package

After cloning the package from source, run:

```bash
$ npm install
$ npm run build
```

This will use the files in src/ to create the files in lib/. Follow this with

```bash
$ npm test
```

This will build a sample character sheet and save it as test/test.html