import { log } from '../log';

export class Character {
	constructor(chardesc, registry) {
        this.chardesc = chardesc;
        this.registry = registry;
    }

    create() {
        log("Character", "Create character");

        // ...
    }
}