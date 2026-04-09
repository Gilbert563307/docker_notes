export class ListFilesDto {
  #currentPage;
  #itemsPerPage;
  #searchTerm;
  #folderId;
  #byPassCache = false;

  /**
   *
   * @param {number} currentPage
   * @param {number} [itemsPerPage]
   * @param {string} [searchTerm]
   * @param {string} [folderId]
   * @param {boolean} byPassCache
   */
  constructor(currentPage, itemsPerPage, searchTerm, folderId ,byPassCache) {
    //validate
    if (currentPage === null || currentPage === undefined) {
      throw new Error("Current page is missing");
    }

    this.#currentPage = currentPage;
    this.#itemsPerPage = itemsPerPage;
    this.#searchTerm = searchTerm;
    this.#folderId = folderId;
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

  getFolderId() {
    return this.#folderId;
  }

  getByPassCache(){
    return this.#byPassCache;
  }
}
