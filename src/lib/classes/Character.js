import * as fs from 'fs';

import * as _ from 'lodash';

import { log, error } from '../log';
import { System, ready as systemsReady, getSystem } from './System';
import { Document } from './Document';

import { zoneCompose } from '../compose';
import { applyContext } from '../context';


function parseCharacter(options) {
    // TODO: parse full character JSON
    options = _.defaults(options, {
        game: "pathfinder2",
        documentColour: '#505050',
        accentColour: '#505050',
        logo: 'images/2e-logo.png',
        portrait: 'iconics/wizard-ezren-runes.png',
        background: false,
    })

    return options;
}

export class Character {
	constructor(chardesc, registry) {
        this.registry = registry;
        this.chardesc = parseCharacter(chardesc);
    }

    create(callback) {
        var self = this;
        log("Character", "Create character");

        log("Character", `name: ${this.chardesc.name}, game: ${this.chardesc.game}`);
        log("Character", `units: ${this.chardesc.units}`);
        
        systemsReady(() => {
            try {
                var system = getSystem(this.chardesc.game);
                if (system === null) {
                    error("Character", "System not found:", this.chardesc.game);
                    return;
                }

                // start with a document
                var documentUnit = system.getUnit("document");
                var document = new Document(documentUnit);

                // TODO set character parameters
                document.title = this.chardesc.name;
                document.documentColour = this.chardesc.documentColour;
                document.accentColour = this.chardesc.accentColour;

                var units = system.getUnits(self.chardesc.units);
                units.forEach(unit => document.addUnit(unit));
                document.composeDocument(this.registry);

                // write the document out for debug
                fs.writeFile(__dirname+'/../test/prototype8.json', JSON.stringify(document.doc, null, 2), (err) => {
                    if (err)
                        error("Character", "Could not write JSON file:", err);
                });

                // render the document
                var data = document.renderDocument(this.registry);

                callback(data);
            } catch (err) {
                error("Character", "Error:", err);
            }
        })
    }
}