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
