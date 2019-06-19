'use strict';

CharacterSheets.create = function (options) {
    options = _.defaults(options, {
        game: "pathfinder2",
        documentColour: '#505050',
        accentColour: '#505050',
        logo: 'images/2e-logo.png',
        portrait: 'iconics/wizard-ezren-runes.png',
        background: false,
    })

    var characterSheet = {
        characterName: options.name,
        game: options.game,
        documentColour: options.documentColour,
        accentColour: options.accentColour,
        logo: options.logo,
        portrait: options.portrait,
        background: options.background,
    };
    CharacterSheets._current = characterSheet;
    
    var units = options.units;
    units.push('document');
    characterSheet.units = CharacterSheets.getUnits(units);

    characterSheet.ready = function (callback) {
        callback();
    }

    characterSheet.getAsset = function (filename) {
        var asset = false;
        _.each(characterSheet.units, unit => {
            if (_.has(unit, "assets")) {
                _.each(unit.assets, a => {
                    if (a.name == filename)
                        asset = a;
                });
            }
        });
        return asset;
    }

    characterSheet.document = function () {
        var documentUnit = CharacterSheets.getUnit("document");
        var document = CharacterSheets.zoneCompose(documentUnit.contents[0]);

        _.each(characterSheet.units, unit => {
            if (unit == null)
                return;

            if (_.has(unit, "inc")) {
                _.each(unit.inc, include => {
                    if (_.has(include, "at")) {
                        if (_.has(include, "add"))
                            document.addAt(include.at, include.add);
                        if (_.has(include, "replace"))
                            document.replaceAt(include.at, include.replace);
                    }
                });
            }
        });
        var doc = document.document();
        doc = CharacterSheets.applyContext(doc);
        doc.title = characterSheet.characterName;
        return doc;
    }

    return characterSheet;
};

CharacterSheets.stylesheet = function() {
    var characterSheet = CharacterSheets._current;
    var stylesheets = _.map(characterSheet.units, unit => {
        var stylesheet = unit.stylesheet;
        if (unit.id != "document")
            stylesheet = replaceColours(stylesheet);
        // if (stylesheet.length > 0)
        //     log("create", "Unit stylesheet:", unit.id, stylesheet.substr(0, 30)+"...");
        return stylesheet;
    });
    var stylesheet = stylesheets.join("\n\n");

    // logo
    if (characterSheet.logo) {
        var logoURL = getDataURL(characterSheet.game+"/base", characterSheet.logo);
        if (logoURL) {
            stylesheet += ".logo{background-image:url('"+logoURL+"');}";
        }
    }

    // portrait
    if (characterSheet.portrait) {
        var portraitURL = getDataURL(characterSheet.game+"/base", characterSheet.portrait);
        if (portraitURL) {
            stylesheet += ".portrait__inner{background-image:url('"+portraitURL+"');}";
        }
    }

    // TODO animal companion portraits

    // background
    if (characterSheet.background) {
        var backgroundURL = getDataURL("core", characterSheet.background);
        if (backgroundURL) {
            stylesheet += ".page{background-image:url('"+backgroundURL+"'); background-size: 100% 100%;}";
        }
    }

    return stylesheet;
}