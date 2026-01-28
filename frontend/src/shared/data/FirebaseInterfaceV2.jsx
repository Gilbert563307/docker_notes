import React from "react";
import { useAuthProvider } from "../context/AuthProvider";
import { DEFAULT_ITEMS_PER_PAGE, ITEMS_PER_PAGE } from "../../config";
import useHelpers from "../helpers/useHelpers";

export default function FirebaseInterfaceV2() {
  const { user } = useAuthProvider();
  const { getUrlParams } = useHelpers();
  const userUid = user ? user.getUid() : null;
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const X_TOKEN = user ? user.getToken() : null;

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

  /**
   * Retrieves the current number of items per page.
   *
   * This function retrieves the number of items per page from the URL parameters.
   * If the parameter is not found or is invalid, it falls back to the default value.
   *
   * @returns {number} The current number of items per page.
   */
  function getTheCurrentItemsPerPage(){
    return parseInt(getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE);
  }
  
  return { userUid, BACKEND_URL, X_TOKEN, getTotalPages, getTheCurrentItemsPerPage };
}
