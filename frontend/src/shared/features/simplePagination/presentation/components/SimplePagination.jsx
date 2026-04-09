import React, { useState } from "react";
import { Show } from "../../../../presentation/components/custom/Show";

export const PAGE_CHANGED_EVENT = "PAGE_CHANGED_EVENT";
const PAGE = "page";

/**
 * Will only display the page numbers when the total page numbers is greater than 1
 * @param {Object} props
 * @param {number} [props.totalItems]
 * @param {number} props.totalPages
 * @returns
 */
export default function SimplePagination({ totalItems, totalPages }) {
  const currentUrl = new URL(window.location.href);

  const [currentPageNumber, setCurrentPageNumber] = useState(currentUrl.searchParams.get(PAGE) || 1);
  /**
   *  @enum { typeof PAGINATION_OPTIONS[keyof typeof PAGINATION_OPTIONS]}
   *
   */
  const PAGINATION_OPTIONS = /**  @type { const} */ ({
    NEXT: "NEXT",
    PREVIOUS: "PREVIOUS",
  });

  /**
   *
   * @param {PAGINATION_OPTIONS} option
   */
  function paginate(option) {
    const url = new URL(window.location.href);
    let currentPageNumber = url.searchParams.get(PAGE);

    if (currentPageNumber === null) {
      currentPageNumber = "1";
    }

    if (option === PAGINATION_OPTIONS.NEXT) {
      const newPageNumber = parseInt(currentPageNumber) + 1;
      if (newPageNumber <= totalPages) {
        currentPageNumber = String(newPageNumber);
      }
    }

    if (option === PAGINATION_OPTIONS.PREVIOUS) {
      const newPageNumber = parseInt(currentPageNumber) - 1;
      if (newPageNumber >= 1) {
        currentPageNumber = String(newPageNumber);
      }
    }

    url.searchParams.set(PAGE, currentPageNumber);
    history.replaceState(history.state, "", url.href);
    dispatchCustomEvent(parseInt(currentPageNumber));
    setCurrentPageNumber(currentPageNumber);
  }

  /**
   *
   * @param {number} pageNumber
   */
  function dispatchCustomEvent(pageNumber) {
    const event = new CustomEvent(PAGE_CHANGED_EVENT, {
      detail: {
        page: pageNumber,
      },
    });
    document.dispatchEvent(event);
  }

  return (
    <div>
      <Show>
        <Show.When isTrue={totalPages > 1}>
          <Show>
            <Show.When isTrue={totalItems != null}>
              <div>
                <span className="mx-1">Total results: {totalItems}</span>
                <span>Page: {currentPageNumber} </span>
              </div>
            </Show.When>
          </Show>

          <nav aria-label="pagination navigation" className="mt-2 dialogic-pagination">
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(PAGINATION_OPTIONS.PREVIOUS)}>
                  Previous
                </button>
              </li>

              <li className="page-item">
                <button className="page-link" onClick={() => paginate(PAGINATION_OPTIONS.NEXT)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </Show.When>
      </Show>
    </div>
  );
}
