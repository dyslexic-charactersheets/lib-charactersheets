import * as fs from 'fs';

import * as _ from 'lodash';

import { log, error } from '../log';
import { System, ready as systemsReady, getSystem } from './System';
import { Document } from './Document';
import { LoadQueue } from './LoadQueue';

import { zoneCompose } from '../compose';
import { applyContext } from '../context';
import { toDataURL } from '../data';


function parseCharacter(options) {
    // TODO: parse full character JSON
    options = _.defaults(options, {
        game: "pathfinder2",
        documentColour: '#505050',
        accentColour: '#505050',
        logo: 'logos/pathfinder2e.png',
        favicon: 'favicon16.png',
        portrait: 'portraits/wizard-ezren-runes.png',
        background: 'backgrounds/paper3.png',
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

        log("Character", `Name: ${this.chardesc.name}, game: ${this.chardesc.game}`);
        log("Character", `Units: ${this.chardesc.units}`);
        
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

                // Load assets
                var loadQueue = new LoadQueue();
                if (this.chardesc.favicon) {
                    loadQueue.loadEmbed(__dirname+'/assets/'+this.chardesc.favicon).then(data => {
                        document.faviconURL = toDataURL(data, this.chardesc.favicon);
                    });
                }

                if (this.chardesc.logo) {
                    loadQueue.loadEmbed(__dirname+'/assets/'+this.chardesc.logo).then(data => {
                        document.logoURL = toDataURL(data, this.chardesc.logo);
                    })
                }

                if (this.chardesc.portrait) {
                    loadQueue.loadEmbed(__dirname+'/assets/'+this.chardesc.portrait).then(data => {
                        document.portraitURL = toDataURL(data, this.chardesc.portrait);
                    });
                }

                if (this.chardesc.background) {
                    loadQueue.loadEmbed(__dirname+'/assets/'+this.chardesc.background).then(data => {
                        document.backgroundURL = toDataURL(data, this.chardesc.background);
                    });
                }

                // TODO set character parameters
                document.title = this.chardesc.name;
                document.documentColour = this.chardesc.documentColour;
                document.accentColour = this.chardesc.accentColour;

                var units = system.getUnits(self.chardesc.units);
                units.forEach(unit => document.addUnit(unit));
                document.composeDocument(this.registry);


                loadQueue.ready(() => {
                    log("Character", "Ready");
                    // write the document out for debug
                    fs.writeFile(__dirname+'/../test/prototype8.json', JSON.stringify(document.doc, null, 2), (err) => {
                        if (err)
                            error("Character", "Could not write JSON file:", err);
                    });

                    // render the document
                    var data = document.renderDocument(this.registry);
    
                    callback(data);
                });
            } catch (err) {
                error("Character", "Error:", err);
            }
        })
    }
}