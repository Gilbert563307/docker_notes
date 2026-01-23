import React from "react";
import "../../../assets/css/ItemsPerPageFilter.css";
import { useSearchParams } from "react-router-dom";
import {
  AVAILABLE_ITEMS_PER_PAGE,
  ITEMS_PER_PAGE,
  PAGE_NUMBER,
} from "../../../../config";

/**
 * 
 * @param {Object} props 
 * @param {string} props.title 
 * @returns {JSX.Element}
 */
export default function ItemsPerPageFilter({ title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOption = React.useRef(searchParams.get(ITEMS_PER_PAGE));

  /**
   * Set items per page to URL search parameters.
   * @param {Event} e - The event object.
   */
  const setItemsPerPageToUrl = (e) => {
    if (e == null || e.target == null) return;
    // @ts-ignore
    const number = e.target.value;
    searchParams.delete(PAGE_NUMBER);
    searchParams.delete(ITEMS_PER_PAGE);
    setSearchParams([
      ...searchParams.entries(),
      [PAGE_NUMBER, "1"],
      [ITEMS_PER_PAGE, number.toString()],
    ]);
  };

  return (
    <div className="dialogic-items-per-page">
      <div>
        <p className="dialogic-items-per-page-title">{title}</p>
      </div>
      <div>
        <select
          className="form-select form-select-sm"
          aria-label="Small select example"
          // @ts-ignore
          onChange={(e) => setItemsPerPageToUrl(e)}
          defaultValue={selectedOption?.current ? selectedOption.current : "15"}
        >
          {AVAILABLE_ITEMS_PER_PAGE.map((number) => {
            return (
              <option value={number} key={number}>
                {number}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

