import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE_NUMBER,
  ITEMS_PER_PAGE,
  PAGE_NUMBER,
  SESSION_FILTERS_ARRAY_CONFIG_NAME,
} from "../../config";

//TODO RE WRITE HELPER
export class HelpersV2 {
  /**
   * Get URL parameter by name.
   * @param {string} paramName - The name of the parameter.
   * @returns {string | null} - The value of the parameter or null if not found.
   */
  getUrlParams(paramName) {
    const currentUrl = new URL(window.location.href);
    const paramValue = currentUrl.searchParams.get(paramName);
    return paramValue !== null ? paramValue : null;
  }

  getCurrentPageNumber() {
    const paramValue = this.getUrlParams(PAGE_NUMBER) || DEFAULT_PAGE_NUMBER;
    return parseInt(paramValue) ? parseInt(paramValue) : DEFAULT_PAGE_NUMBER;
  }

  /**
   * Retrieves the current number of items per page.
   *
   * This function retrieves the number of items per page from the URL parameters.
   * If the parameter is not found or is invalid, it falls back to the default value.
   *
   * @returns {number} The current number of items per page.
   */
  getTheCurrentItemsPerPage() {
    return parseInt(this.getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE);
  }

  /**
   * Calculates the total number of pages based on the total number of records and items per page.
   *
   * @param {number} totalRecords - The total number of records.
   * @returns {number} The total number of pages.
   */
  getTotalPages(totalRecords) {
    // Get the user-set items per page.
    const size = parseInt(this.getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE);

    // Calculate the total number of pages.
    const pages = (totalRecords + size - 1) / size;
    return parseInt(pages);
  }

  /**
   *
   * @returns {string} current parent path name defined in the router.jsx
   */
  getCurrentPathName() {
    const pathName = location.pathname;
    if (!pathName) return "";
    return pathName.replace(/\//g, "");
  }

  /**
   *
   * @param {string} [pathName]
   * @returns
   */
  getHowManyFiltersAreActiveByCurrentPath(pathName = "") {
    const currentPathName = pathName != "" ? pathName : this.getCurrentPathName();
    return this.getAllActiveSessionFilters().filter((obj) => obj.value === true && obj.pathname === currentPathName);
  }

  /**
   * - Checks if there any active filters in the session tab
   * @returns {Array<{name: string, value: boolean, pathname: string }>}
   */
  getAllActiveSessionFilters() {
    const value = sessionStorage.getItem(SESSION_FILTERS_ARRAY_CONFIG_NAME);
    if (value != null) {
      return JSON.parse(value);
    }
    return [];
  }

  /**
   * This function returns the boolean that is stored, the session storage given by the param name
   * @param {string} paramName - This is a constant from .config file
   * @returns {boolean | null} - When the given param filter is active or not
   */
  getSessionFilter(paramName) {
    const allActiveFilters = this.getAllActiveSessionFilters();

    //If there no active filters return null
    if (allActiveFilters.length === 0) {
      return null;
    }

    //If there filters check if the given param name is the filters session array
    const matchingFilter = allActiveFilters.find((obj) => obj.name === paramName);

    //If the matching filter.value is true return true | null  will be turned into false by person who is calling this function is.
    return matchingFilter ? matchingFilter.value : null;
  }

  getSessionStorageFilter(name){
    return sessionStorage.getItem(name);
  }
}
