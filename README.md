# Dyslexic Character Sheets

A library to generate character sheets for Pathfinder 2nd Edition and other games.

See the website: https://www.dyslexic-charactersheets.com/.

This project is a Node.js module: https://npmjs.com/package/dyslexic-charactersheets

## This is a work in progress

This library is not ready for production use.

You can follow progress on [the project's Patreon page](https://www.patreon.com/dyslexic_charactersheets).

# Install

To install this library in another project:
```sh
$ npm install dyslexic-charactersheets
```

To clone this library for development:
```sh
$ git clone https://github.com/dyslexic-charactersheets/lib-charactersheets.git
$ cd lib-charactersheets
$ npm install  # install dependencies
```

You can make changes, then import your version of this module into another project with:

```sh
$ npm test  # compile and run the code
$ sudo npm link -g  # export this library folder
$ cd ../your-project
$ npm link dyslexic-charactersheets  # import the library into your project
```


# Usage

The library expects to be given a character's details in the form of a plain JavaScript object (details below)

```javascript
let request = {
  data: {
    type: 'character',
    id: '76af3e1',
    attributes: {
      game: 'pathfinder2',
      name: 'Valeros',
      class: 'druid',
      ...a lot more details...
    }
  }
};

const CharacterSheets = require('dyslexic-charactersheets');
let characterSheet = CharacterSheets.create(request);

characterSheet.render(html => {
  fs.writeFile('file.html', data, err => {});
});
```

# API

## Character objects

### create(...)

Calling the constructor creates an instance of CharacterSheet.

```javascript
const CharacterSheets = require('dyslexic-charactersheets');
let characterSheet = CharacterSheets.create(request);
```

* `create()`
   * `request` \<Object\> - The request object (see below).
   * Returns: \<CharacterSheet\>, a character sheet object.

### render(...)

The `render` method produces a file for the request. It takes a callback which gives you either data to save, or an error.

```javascript
characterSheet.render((data, err) => {
  // ... your code ...
});
```

* `CharacterSheet.render(callback)`
  * `callback` \<Function\>
    * `data` \<String\> - The rendered data (in HTML)
    * `err` \<Error\> - Optional error object

## Global functions

### addAssetsDir(...)

Register a directory with asset files. Do this before calling `create`, and it will refer to this directory when looking for portraits, logos and background images.

```javascript
CharacterSheets.addAssetsDir('./assets');
```

* `addAssetsDir()`
  * `dir` \<String\> - A directory

### addTranslator(...)

Add a callback that supplies translations. The callback accepts a `message`, a `language` and an object with metadata; it returns either a translation, or `null`.

```javascript
CharacterSheets.addTranslator(function (message, language, meta) {
  // ...
});
```

* `addTranslator(callback)`
  * `callback` \<Function\> - A callback
    * `message` \<String\> - A string to translate
    * `language` \<String\> - A locale code, `en` or `en-GB`
    * `context` \<Object\> - Metadata for that message

### getFormData(...)

Load the data needed to render a selection form with all the options. Takes a callback that will process the data.

```javascript
CharacterSheets.getFormData(system, function (data) {
  // ...
});
```

* `getFormData(system, callback)`
  * `system` \<String\> - for example, `pathfinder2`
  * `callback` \<Function\>
    * `data` \<Object\> - The form data

The form data is in the format:

```javascript
{
  selects: [
    {
      select: "class",
      name: "Class",
      max: 1,
      base: true,
      units: {
        "class/alchemist": {
          id: "class/alchemist",
          name: "Alchemist"
        },
        "class/fighter": {
          id: "class/fighter",
          name: "Fighter"
        },
        ...
      },
      groups: [
        {
          group: "crb",
          name: "Core Rulebook",
          units: [
            "class/alchemist",
            "class/fighter",
            ...
          ]
        },
        ...
      ]
    },
    ...
  ],
  options: [
    {
      option: "permission",
      name: "Permission to Print",
      unit: "option/permission",
      base: true
    },
    ...
  ]
}
```

## Events

### onCreate(...)

A hook that is called when a character is created, before any other actions.

```javascript
CharacterSheets.onCreate(request => {
  // ...
});
```

* `onCreate(callback)`
  * `callback` \<Function\>
    * `request` \<Object\> - The requested character.

Note that you may not modify the request during the callback.

### onCreateElementTree(...)

A hook that is called after the element tree has been processed, but before it's rendered into HTML. Used for debugging the resulting element tree.

```javascript
CharacterSheets.onCreateElementTree((elements, title, request) => {
  // ...
});
```

* `onCreateElementTree(callback)`
  * `callback` \<Function\>
    * `elements` \<Object\> - The element tree
    * `title` \<String\> - The character or party's name
    * `request` \<Object\> - The requested character

Note that you may not modify the element tree during the callback.

### onError(...)

A hook that is called when an error occurs.

```javascript
CharacterSheets.onError((err, request) => {
  // ...
});
```

* `onError(callback)`
  * `callback` \<Function\>
    * `err` \<Error\> - Error object
    * `request` \<Object\> - The requested character

# Request format

The request object describes a character, a party, or various other things you may want the library to produce.

For a detailed description of the format, see [the character sheets schema repo](https://github.com/dyslexic-charactersheets/charactersheets-schema).

## Example character

```json
{
  "version": 0,
  "data": {
    "type": "character",
    "id": "76af3e1",
    "attributes": {
      "game": "pathfinder2",
      "name": "Bob the Destroyer",
      "ancestry": "half-orc",
      "background": "hunter",
      "class": "barbarian",
      "printColor": "#f04312"
    }
  }
}
```

## Example party

```json
{
  "version": 0,
  "data": {
    "type": "party",
    "game": "pathfinder2",
    "attributes": {
      "name": "The Gravy Bunch"
    },
    "relationships": {
      "members": {
        "data": [
          { "type": "character", "id": "76af3e1" },
        ]
      }
    }
  },
  "included": [
    {
      "type": "character",
      "id": "76af3e1",
      "game": "pathfinder2",
      "name": "Bob the Destroyer",
      "ancestry": "half-orc",
      "background": "hunter",
      "class": "barbarian",
      "printColor": "#f04312"
    }
  ]
}
```


# Testing

To test this package, clone the package from [source](https://github.com/dyslexic-charactersheets/lib-charactersheets), then run:

```bash
$ cd lib-charactersheets
$ npm install
$ npm test
```

This will:
 - Compile the sources in `src` to create the files in `lib`
 - Build character sheets from the JSON files in `test/in`
 - Save them into `test/out`


# Contributing

## Adding content

The most likely form of contributions will be adding classes, ancestries, feats etc. This should be done by adding units to `src/units`. Units are written in YAML, and may also contain a stylesheet and asset files.

## Bugs

Please raise issues or pull requests on this project.

# License

Artistic License 2.0 © Marcus Downing
