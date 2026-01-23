/* eslint-disable react/prop-types */
import React from "react";

import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_PAGE_NUMBER,
  PAGE_NUMBER,
  SESSION_FILTERS_ARRAY_CONFIG_NAME,
} from "../../../../config";
import useHelpers from "../../../helpers/useHelpers";
import BS5Switch from "../bs5/BS5Switch";

/**
 * This Hook can be used with the Pagination hook, because it resets a page number to 1 when a filter is applied.
 * @param {Object} props
 * @param {string} props.FILTER_TO_CHECK - CONSTANT
 * @param {string} props.LABEL - CONSTANT
 * @param {string} props.ID- CONSTANT
 * @param {Function} [props.callBack] - Function
 * @returns {JSX.Element}
 */
export default function SessionMemoryFilter({
  FILTER_TO_CHECK,
  LABEL,
  ID,
  callBack = undefined,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    getAllSessionFilters,
    getCurrentPathName,
    isTheCurrentFilterActive,
  } = useHelpers();

  const [showFilter, setShowFilter] = React.useState(
    isTheCurrentFilterActive(FILTER_TO_CHECK)
  );

  const resetPageNumber = () => {
    searchParams.delete(PAGE_NUMBER);
    setSearchParams([
      ...searchParams.entries(),
      [PAGE_NUMBER, DEFAULT_PAGE_NUMBER.toString()],
    ]);
  };

  /**
   * @typedef {Object} Filter
   * @property {string} name
   * @property {boolean} value
   * @property {string} pathname
   */

  /**
   *
   * @param {Filter} currentFilterObj
   * @param {Array<Filter>} allFilters
   * @returns {Array<Filter>}
   */
  const getFiltersToSave = (currentFilterObj, allFilters) => {
    //check if the session storage KEY: Filters is an empty array, then return a new array with the currentFilter object
    if (allFilters.length === 0) return [currentFilterObj];

    /** @type {Filter | undefined} */
    const isThisFilterInSession = allFilters.find(
      (element) => element.name === currentFilterObj.name
    );
    // If the currentFilterObject is not already in the session,  just save it to the current Session filters and do nothing
    if (!isThisFilterInSession) {
      return [...allFilters, currentFilterObj];
    }

    //loop through the current filters saved the Session if the one of them is present, and the old value is not the same as the current passed one
    //change that value to the current passed one and then return the updated one + the rest of the active filters;

    /**@type {Array<Filter>} */
    const updatedFilters = allFilters.map((oldFiltersObj) => {
      const results =
        oldFiltersObj.name === currentFilterObj.name &&
          oldFiltersObj.value != currentFilterObj.value
          ? currentFilterObj
          : oldFiltersObj;
      return results;
    });

    return updatedFilters;
  };

  /**
   * This function toggles the BS5 checkbox on and off.
   * Then it creates a current filter object, gets the var/constant FILTER_TO_CHECK name passed in by the user,
   * The value of the toggle, and the current pathname/url
   * Then it checks the session storage with the getFiltersToSave() function read....
   * And then it saved the data to the session.
   */
  const setFilterToMemory = () => {
    const changedBoolean = !showFilter;
    setShowFilter(changedBoolean);

    /** @type {Filter} */
    const filter = {
      name: FILTER_TO_CHECK,
      value: changedBoolean,
      pathname: getCurrentPathName(),
    };
    const allActiveFilters = getAllSessionFilters();

    const newFiltersToSave = getFiltersToSave(filter, allActiveFilters);

    sessionStorage.setItem(
      SESSION_FILTERS_ARRAY_CONFIG_NAME,
      JSON.stringify(newFiltersToSave)
    );

    // Check if any filters have been activated; if so, reset the page number to one.
    // This is necessary because if a user activates a filter such as archived projects or documents,
    // and the page number remains on a page that doesn't contain any documents or projects,
    // the API will return "no docs found."
    if (searchParams.get(PAGE_NUMBER) != undefined) {
      resetPageNumber();
    }

    //custom callback
    if (callBack != undefined) {
      callBack();
    }
  };

  return (
    <BS5Switch
      label={LABEL}
      id={ID}
      isTheInputChecked={showFilter}
      onChange={setFilterToMemory}
    />
  );
}



