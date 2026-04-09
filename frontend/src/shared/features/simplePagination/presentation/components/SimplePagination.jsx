import React from "react";
import { Show } from "../../../../presentation/components/custom/Show";

export const PAGE_CHANGED_EVENT = "PAGE_CHANGED_EVENT";

/**
 * Will only display the page numbers when the total page numbers is greater than 1
 * @param {Object} props
 * @param {number} [props.totalItems]
 * @param {number} props.totalPages
 * @returns
 */
export default function SimplePagination({ totalItems, totalPages }) {
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
    let currentPageNumber = url.searchParams.get("page");

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

    url.searchParams.set("page", currentPageNumber);
    history.replaceState(history.state, "", url.href);
    dispatchCustomEvent(parseInt(currentPageNumber));
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
              <span className="mx-1">Total results: {totalItems}</span>
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
