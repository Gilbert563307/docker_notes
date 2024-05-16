import React from "react";
import {
  LAST_VISITED_PAGE_NUMBER_KEY,
  PAGE_NUMBER,
  SESSION_FILTERS_ARRAY_CONFIG_NAME,
} from "../config";
import { useLocation, useSearchParams } from "react-router-dom";

export default function useHelpers() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  /**  Converts a timestamp to the Dutch date format.
   * @param {string} created_at - The input timestamp in the format 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'.
   * @returns {string} - The Dutch-formatted date.
   */
  const convertToDutchDateFormat = (created_at) => {
    // Create a Date object from the timestamp
    const date = new Date(created_at);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

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
    if (
      index &&
      errors &&
      errors[index] &&
      errors[index].fieldName &&
      errors[index].fieldName.type
    ) {
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
  function getAllActiveSessionFilters() {
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
    const lastVisitedPageNumber = sessionStorage.getItem(
      LAST_VISITED_PAGE_NUMBER_KEY
    );
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
    const allFilters = getAllActiveSessionFilters();
    const matchingFilter = allFilters.find(
      (element) => currentFilterToCheckName === element.name
    );
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
    setSearchParams([
      ...searchParams.entries(),
      [PAGE_NUMBER, pageNumber.toString()],
    ]);
  }

  /**
   * Sets a custom search parameter to session memory.
   * @param {string} customSearchParam - The custom search parameter to set.
   * @param {any} valueToSet - The value to set for the custom search parameter.
   * @returns {boolean} Returns true if the operation is successful.
   */
  function setCustomSearchParamToSessionMemory(customSearchParam, valueToSet) {
    searchParams.delete(customSearchParam);
    setSearchParams([
      ...searchParams.entries(),
      [customSearchParam, valueToSet.toString()],
    ]);
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

  return {
    convertToDutchDateFormat,
    formatToDutchStringDate,
    checkForInvalidFields,
    getNotificationObject,
    getAllActiveSessionFilters,
    getCurrentPathName,
    getUrlParams,
    setLastVisitedPageNumber,
    getLastVisitedPage,
    isTheCurrentFilterActive,
    setPageNumberToSessionMemory,
    removePageNumberSessionParam,
    wait,
    setCustomSearchParamToSessionMemory
  };
}



