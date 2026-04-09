export class ListTasksDto {
  #currentPage;
  #itemsPerPage;
  #searchTerm;

  /**
   *
   * @param {number} currentPage
   * @param {number} [itemsPerPage]
   * @param {string} [searchTerm]
   */
  constructor(currentPage, itemsPerPage, searchTerm) {
    //validate
    if (currentPage === null || currentPage === undefined) {
      throw new Error("Current page is missing");
    }

    this.#currentPage = currentPage;
    this.#itemsPerPage = itemsPerPage;
    this.#searchTerm = searchTerm;
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
}
