import { HelpersV2 } from "./HelpersV2";

export class SessionMemoryFilter {
  #helpers;

  /**
   *
   * @param {HelpersV2} helpers
   */
  constructor(helpers) {
    this.#helpers = helpers;
  }

  /**
   *
   * @param {string} name
   * @param {any} value
   */
  static setItem(name, value) {
    if (!name || !value) {
      return;
    }
    sessionStorage.setItem(name, value);
  }

  /**
   * 
   * @param {string} name 
   * @returns 
   */
  static getItem(name){
    return sessionStorage.getItem(name);
  }
}
