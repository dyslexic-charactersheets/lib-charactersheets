import { log, warn, error } from '../log';
import { LoadQueue } from './LoadQueue';
import { isString, isObject, isNull, isArray, isEmpty } from '../util';
import { has } from '../util/objects';
import { locateAsset, toDataURL, inferMimeType } from '../data';

/**
 * Interface represents a requested item. This may be for a character, a whole party, GM tools etc.
 */
export class Instance {
  constructor() {
    this.loadQueue = new LoadQueue();
  }

  getAsset(asset, callback) {
    if (isString(asset) && !isEmpty(asset) && has(this.data.instances, asset)) {
      // log("Instance", "getAsset: known instance (str)", asset);
      asset = this.data.instances[asset];
    }

    if (isObject(asset) && has(asset, "id") && !has(asset, "data")) {
      // log("Instance", "getAsset: looking for", asset);
      // log("Instance", "known instances", Object.keys(this.data.instances));
      if (has(this.data.instances, asset.id)) {
        let instance = this.data.instances[asset.id];
        if (!has(asset, "type") || asset.type == instance.type) {
          // log("Instance", "getAsset: known instance (obj)", asset);
          asset = instance;
        } else {
          warn("Instance", "getAsset: known instance (obj) but wrong type: %s != %s", asset.type, instance.type, asset);
        }
      }  
    }
  

    if (asset === null) {
      // log("Instance", "getAsset: null");
      return;
    } else if (isObject(asset)) {
      // log("Instance", "getAsset: object");
      if (!has(asset, "data")) {
        error("Instance", "getAsset: No data", asset);
      }
      const dataURL = toDataURL(asset.data, asset.mimeType);
      callback(dataURL, true, asset);
    } else if (isString(asset)) {
      // log("Instance", "getAsset: string", asset);
      locateAsset(asset, assetFile => {
        this.loadQueue.loadEmbed(assetFile).then(data => {
          const mimeType = inferMimeType(asset);
          const dataURL = toDataURL(data, mimeType);
          callback(dataURL, false, asset);
        })
      });
    } else {
      warn("Instance", "Unknown asset", asset);
    }
  }

  getDataUnits(isLoggedIn, isNoCalc) {
    if (isLoggedIn && !isNoCalc) {
        return [
        "data/edit",
        "data/calc",
        "data/save",
        // "data/search",
        // "data/note",
        // "data/roll",
        "document/zoom",
        // "document/spotlight",
      ];
    } else {
      return [ "data/no-edit" ];
    }
  }

  /**
   * Render this instance as a file or files.
   * @returns {Promise} Promise representing the character sheet(s).
   */
  render() {
    error("Instance", "Not yet implemented!");
  }
}
