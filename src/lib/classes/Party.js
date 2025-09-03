/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */


import { log } from '../log';
import { Instance } from './Instance';
import { Character } from './Character';

function parseParty(primary, request) {
  let attr = Object.assign({
    game: 'pathfinder2',
    language: 'en',
    members: []
  }, primary.attributes);

  return attr;
}

/**
 * Class representing character sheets for a whole party.
 */
export class Party extends Instance {
  constructor(primary, request, registry) {
    super();
    this.registry = registry;
    this.data = parseParty(primary, request);

    let characterDefaults = {
      game: this.data.game,
      language: this.data.language,
    };

    this.members = this.data.members.map(chardesc => {
      chardesc = Object.assign({}, characterDefaults, chardesc);
      return new Character(chardesc, request, registry);
    });
    // log("Party", "Members:", this.members);
  }

  /**
   * Turn this party request into an array of character sheets.
   * @returns {Promise} Promise representing the resulting character sheets.
   */
  render() {
    return new Promise((resolve, reject) => {
      log("Party", "Render");
      let files = [];
      let promises = [];

      // collect the character sheets
      this.members.forEach(member => {
        let promise = member.render().then(response => {
          files.push(response);
        });
        promises.push(promise);
      });

      // 
      Promise.all(promises).then(() => {
        // log("Party", `Rendered ${files.length} members`);
        resolve(files);
      });
    });
  }
}
