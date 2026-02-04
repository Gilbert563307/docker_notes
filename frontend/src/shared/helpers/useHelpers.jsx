import React from "react";
import {
  ALLOWED_ITEMS_PER_PAGE,
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE_NUMBER,
  ITEMS_PER_PAGE,
  LAST_VISITED_PAGE_NUMBER_KEY,
  PAGE_NUMBER,
  SESSION_FILTERS_ARRAY_CONFIG_NAME,
} from "../../config";
import { useLocation, useSearchParams } from "react-router-dom";

export default function useHelpers() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function getItemsPerPage() {
    const itemsPerPage = getUrlParams(ITEMS_PER_PAGE);
    if (!itemsPerPage) return DEFAULT_ITEMS_PER_PAGE;

    if (ALLOWED_ITEMS_PER_PAGE.includes(parseInt(itemsPerPage))) {
      return itemsPerPage;
    }
    return DEFAULT_ITEMS_PER_PAGE;
  }

  /**
   * - Checks if there any active filters in the session tab
   * @returns {Array<{name: string, value: boolean, pathname: string }>}
   */
  function getAllActiveSessionFilters() {
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
  function getSessionFilter(paramName) {
    const allActiveFilters = getAllActiveSessionFilters();

    //If there no active filters return null
    if (allActiveFilters.length === 0) {
      return null;
    }

    //If there filters check if the given param name is the filters session array
    const matchingFilter = allActiveFilters.find((obj) => obj.name === paramName);

    //If the matching filter.value is true return true | null  will be turned into false by person who is calling this function is.
    return matchingFilter ? matchingFilter.value : null;
  }

  /**  Converts a timestamp to the Dutch date format.
   * @param {string} created_at - The input timestamp in the format 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'.
   * @returns {string} - The Dutch-formatted date.
   */
  function convertToDutchDateFormat(created_at) {
    // Create a Date object from the timestamp
    const date = new Date(created_at);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  /**
   *
   * @param {string} dateString
   * @returns
   */
  function formatToDutchStringDate(dateString) {
    if (!dateString) return "";
    const inputDate = new Date(dateString);

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Amsterdam",
    };

    // @ts-ignore
    const formattedDate = inputDate.toLocaleString("nl-NL", options);
    return formattedDate;
  }

  /**
   *
   * @param {Object} errors - errors object that comes from the useForm hook in react-hook-form
   * @param {Number | null} index - The index when you are working with a 2d>3d>4d+ form or null when you are working with a 1d form .
   * @param {string} fieldName - field name defined when using the register function
   * @returns {string}  - Returns "is-invalid" if conditions are met else just an empty string.
   */
  function checkForInvalidFields(errors, index, fieldName) {
    if (index && errors && errors[index] && errors[index].fieldName && errors[index].fieldName.type) {
      return "is-invalid";
    } else if (!index && errors.fieldName && errors.fieldName.type) {
      return "is-invalid";
    }
    return "";
  }

  /**
   * Get a notification object.
   * @param {Object} object - The input object.
   * @returns {{ message: string, type: number }} - The notification object with a message and type.
   */
  function getNotificationObject(object) {
    return { message: object?.message, type: object?.type };
  }

  /**
   * - Checks if there any active filters in the session tab
   * @returns {Array<{name: string, value: boolean, pathname: string }>}
   */
  function getAllSessionFilters() {
    const value = sessionStorage.getItem(SESSION_FILTERS_ARRAY_CONFIG_NAME);
    if (value != null) {
      return JSON.parse(value);
    }
    return [];
  }

  /**
   *
   * @returns {string} current parent path name defined in the router.jsx
   */
  function getCurrentPathName() {
    const pathName = location.pathname;
    if (!pathName) return "";
    return pathName.replace(/\//g, "");
  }

  /**
   * Get URL parameter by name.
   * @param {string} paramName - The name of the parameter.
   * @returns {string | null} - The value of the parameter or null if not found.
   */
  function getUrlParams(paramName) {
    const paramValue = searchParams.get(paramName);
    return paramValue !== null ? paramValue : null;
  }

  function getCurrentPageNumber() {
    const paramValue = getUrlParams(PAGE_NUMBER) || DEFAULT_PAGE_NUMBER;
    return parseInt(paramValue) ? parseInt(paramValue) : DEFAULT_PAGE_NUMBER;
  }

  /**
   * Sets the current clicked page number to the session storage
   * @returns {void}
   */
  function setLastVisitedPageNumber() {
    const lastVisitedPageNumber = searchParams.get(PAGE_NUMBER);
    if (!lastVisitedPageNumber) return;
    sessionStorage.setItem(LAST_VISITED_PAGE_NUMBER_KEY, lastVisitedPageNumber);
  }

  /**
   * Gets the last visited page number that has been stored into th session.
   * @returns {string| number}
   */
  function getLastVisitedPage() {
    const lastVisitedPageNumber = sessionStorage.getItem(LAST_VISITED_PAGE_NUMBER_KEY);
    if (!lastVisitedPageNumber) return 1;
    return lastVisitedPageNumber;
  }

  /**
   *
   * @param {number} max
   * @returns {number}
   */
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /**
   * @typedef Tag
   * @property {number} id
   * @property {string} name
   * @property {string} config
   */

  /**
   * Check if the current filter is active.
   * @param {string} filterToCheck
   * @returns {boolean} - True if the filter is active, false otherwise.
   */
  function isTheCurrentFilterActive(filterToCheck) {
    const currentFilterToCheckName = filterToCheck;
    const allFilters = getAllSessionFilters();
    const matchingFilter = allFilters.find((element) => currentFilterToCheckName === element.name);
    return matchingFilter ? matchingFilter.value : false;
  }

  /**
   *
   * @param {number} pageNumber
   */
  function setPageNumberToSessionMemory(pageNumber) {
    //delete the page page number because when we get all the existing url params without deleting the old one, it would keep on appending
    //the page number const with a new number &..&...&, so thats why we delete the one before
    searchParams.delete(PAGE_NUMBER);
    setSearchParams([...searchParams.entries(), [PAGE_NUMBER, pageNumber.toString()]]);
  }

  /**
   * Sets a custom search parameter to session memory.
   * @param {string} customSearchParam - The custom search parameter to set.
   * @param {any} valueToSet - The value to set for the custom search parameter.
   * @returns {boolean} Returns true if the operation is successful.
   */
  function setCustomSearchParamToSessionMemory(customSearchParam, valueToSet) {
    searchParams.delete(customSearchParam);
    setSearchParams([...searchParams.entries(), [customSearchParam, valueToSet.toString()]]);
    return true;
  }

  /**
   * Function to remove page number session parameter from the URL.
   */
  function removePageNumberSessionParam() {
    setSearchParams({});
  }

  /**
   * Function to wait for a specified number of milliseconds.
   * @param {number} ms - The number of milliseconds to wait.
   * @returns {Promise<void>} A promise that resolves after the specified time.
   */
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   *
   * @param {string} [pathName]
   * @returns
   */
  function getHowManyFiltersAreActiveByCurrentPath(pathName = "") {
    const currentPathName = pathName != "" ? pathName : getCurrentPathName();
    return getAllActiveSessionFilters().filter((obj) => obj.value === true && obj.pathname === currentPathName);
  }

  /**
   * Retrieves the current number of items per page.
   *
   * This function retrieves the number of items per page from the URL parameters.
   * If the parameter is not found or is invalid, it falls back to the default value.
   *
   * @returns {number} The current number of items per page.
   */
  function getTheCurrentItemsPerPage() {
    return parseInt(getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE);
  }

  /**
   * Calculates the total number of pages based on the total number of records and items per page.
   *
   * @param {number} totalRecords - The total number of records.
   * @returns {number} The total number of pages.
   */
  function getTotalPages(totalRecords) {
    // Get the user-set items per page.
    const size = parseInt(getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE);

    // Calculate the total number of pages.
    const pages = (totalRecords + size - 1) / size;
    return parseInt(pages);
  }


  return {
    getTotalPages,
    convertToDutchDateFormat,
    formatToDutchStringDate,
    checkForInvalidFields,
    getNotificationObject,
    getAllSessionFilters,
    getCurrentPathName,
    getUrlParams,
    setLastVisitedPageNumber,
    getLastVisitedPage,
    isTheCurrentFilterActive,
    setPageNumberToSessionMemory,
    removePageNumberSessionParam,
    wait,
    setCustomSearchParamToSessionMemory,
    getCurrentPageNumber,
    getSessionFilter,
    getAllActiveSessionFilters,
    getItemsPerPage,
    getHowManyFiltersAreActiveByCurrentPath,
    getTheCurrentItemsPerPage,
  };
}
