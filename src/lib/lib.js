import {Registry} from './classes/Registry';
import {Character} from './classes/Character';
import {System, loadSystemData} from './classes/System';

// start this first, it's the slow bit
loadSystemData([ "common", "pathfinder2", "dnd5e" ]);

let registry = new Registry();

function CharacterSheets(chardesc) {
    return new Character(chardesc, registry);
};

export default CharacterSheets;