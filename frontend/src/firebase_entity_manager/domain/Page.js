export class Page {
  #pageNumber;
  #queryItems;
  #itemsPerPage;

  /**
   *
   * @param {*} pageNumber
   * @param {*} queryItems
   * @param {*} itemsPerPage
   */
  constructor(pageNumber, queryItems, itemsPerPage) {
    this.#pageNumber = pageNumber;
    this.#queryItems = queryItems;
    this.#itemsPerPage = itemsPerPage;
  }

  getPageNumber() {
    return this.#pageNumber;
  }

  getItemsPerPage() {
    return this.#itemsPerPage;
  }

  getQueryItems() {
    return this.#queryItems;
  }

  isFirstPage(){
    const FIRST_PAGE = 1;
    return this.#pageNumber === FIRST_PAGE;
  }
}
