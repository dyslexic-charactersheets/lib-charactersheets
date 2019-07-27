
import { log } from '../log';
import { Character } from './Character';

function parseParty(primary, request) {
  let attr = Object.assign({
    game: 'pathfinder2',
    language: 'en',
    members: []
  }, primary.attributes);

  return attr;
}

export class Party {
  constructor(primary, request, registry) {
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
  
  render(callback) {
    log("Party", "Render");
    var files = [];
    var promises = [];

    this.members.forEach(member => {
      let promise = new Promise((resolve, reject) => {
        member.render(response => {
          if (response.err) {
            reject(response.err);
          } else {
            files.push(response);
            resolve();
          }
        });
      });
      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      log("Party", `Rendered ${files.length} members`);

      callback(files);
    });
  }
}
