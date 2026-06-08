export class ListTasksDto {
  #currentPage;
  #itemsPerPage;
  #searchTerm;
  #byPassCache = false;

  /**
   *
   * @param {number} currentPage
   * @param {number} [itemsPerPage]
   * @param {string} [searchTerm]
   * @param {boolean} byPassCache
   */
  constructor(currentPage, itemsPerPage, searchTerm, byPassCache) {
    //validate
    if (currentPage === null || currentPage === undefined) {
      throw new Error("Current page is missing");
    }

    this.#currentPage = currentPage;
    this.#itemsPerPage = itemsPerPage;
    this.#searchTerm = searchTerm;
    this.#byPassCache = byPassCache;
  }

  getCurrentPage() {
    return this.#currentPage;
  }

  /**
   *
   * @returns {number}
   */
  getItemsPerPage() {
    return this.#itemsPerPage;
  }

  getSearchTerm() {
    return this.#searchTerm;
  }

  getByPassCache() {
    return this.#byPassCache;
  }
}
