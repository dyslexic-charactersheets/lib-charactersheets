import { error } from '../log';

/**
 * Interface represents a requested item. This may be for a character, a whole party, GM tools etc.
 */
export class Instance {
  /**
   * Render this instance as a file or files.
   * @returns {Promise} Promise representing the character sheet(s).
   */
  render() {
    error("Instance", "Not yet implemented!");
  }
}
