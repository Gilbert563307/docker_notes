export class FilesQueries {
  #queryItems;

  /**
   * @param {Array<any>} baseQueryItems
   */
  constructor(baseQueryItems) {
    this.#validate({
      baseQueryItems,
    });
    this.#queryItems = [...baseQueryItems];
  }

  #validate({ baseQueryItems }) {
    // baseQueryItems
    if (!Array.isArray(baseQueryItems)) {
      throw new TypeError(`Invalid "baseQueryItems": expected an array of Firestore Query objects`);
    }
  }

  addQueryItem(queryItem) {
    if (queryItem === null || queryItem === undefined) {
      throw new Error("Query item must not be null or undefined");
    }

    this.#queryItems.push(queryItem);
  }

 

  getQueryItems() {
    return this.#queryItems;
  }
}
