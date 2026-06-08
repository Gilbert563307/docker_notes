export class PageAble {
  #queryItems;
  #page;
  #itemsPerPage;
  #skipCache = false;

  /**
   * //TODO GET CORRECT DATA TYPE
   * @param {Array<any>} queryItems
   * @param {number} page
   * @param {number} itemsPerPage
   * @param {boolean} skipCache
   */
  constructor(queryItems, page, itemsPerPage, skipCache) {
    this.#validate({ queryItems, page, itemsPerPage });

    this.#queryItems = queryItems;
    this.#page = page;
    this.#itemsPerPage = itemsPerPage;
    this.#skipCache = skipCache;
  }

  #validate(data) {
    const { queryItems, page, itemsPerPage } = data;
    if (queryItems === null || queryItems === undefined) {
      throw new Error("Query array is missing");
    }

    if (page === null || page === undefined || typeof page !== "number") {
      throw new Error("Page number is missing");
    }

    if (itemsPerPage === null || itemsPerPage === undefined || typeof itemsPerPage !== "number") {
      throw new Error("Page size is missing");
    }
  }

  getPage() {
    return this.#page;
  }

  getQueryItems() {
    return this.#queryItems;
  }

  getItemsPerPage() {
    return this.#itemsPerPage;
  }

  isFirstPage() {
    const FIRST_PAGE = 1;
    return this.#page === FIRST_PAGE;
  }

  skipCache() {
   return this.#skipCache;
  }
}
