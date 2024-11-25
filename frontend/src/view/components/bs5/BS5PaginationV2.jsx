/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { PAGE_NUMBER } from "../../../config";
import { useSearchParams } from "react-router-dom";
import { Show } from "../custom/Show";
import useHelpers from "../../../helpers/useHelpers";

/**
 * Will only display the page numbers when the total page numbers is greater than 1
 * @param {Object} props
 * @param {number} [props.totalItems]
 * @param {number} props.totalPages
 * @param {boolean} [props.loadOptionsIcons]
 * @returns
 */
export default function BS5PaginationV2({
  totalItems = undefined,
  totalPages,
  loadOptionsIcons = false,
}) {
  const { setPageNumberToSessionMemory } = useHelpers();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialForcePage = () => {
    const pageNumberParam = searchParams.get(PAGE_NUMBER);
    //You must remove one otherwise : The forcePage prop provided is greater than the maximum page index from pageCount prop
    return pageNumberParam ? parseInt(pageNumberParam) - 1 : 0;
  };

  
  const [forcePage, setForcePage] = useState(getInitialForcePage());
  const nextLabelHtml =
    '<i class="fa-regular fa-chevrons-right" style="color: #0143a3;"></i>';
  const backLabelHtml =
    '<i class="fa-regular fa-chevrons-left" style="color: #0143a3;"></i>';

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const pageNumber = event.selected + 1;
    setPageNumberToSessionMemory(pageNumber);
    //Forces the page number to go the clicked number because when the user changes the items per page, the current page number was not highlighted
    if (totalItems != undefined && pageNumber < totalItems) {
      setForcePage(pageNumber - 1);
    }
  };

  const resetReactPaginate = () => {
    //get page number param from the url
    const pageNumberParam = searchParams.get(PAGE_NUMBER);
    //This checks if the total pages have changed
    if (
      totalPages &&
      //check if the pageNumber param is the url
      pageNumberParam != null &&
      //check if the total pages are smaller or equals to the pagenumber param
      totalPages <= parseInt(pageNumberParam)
    ) {
      //if all the above is true, force the react paginate page to the pagenumber thats in the url
      setForcePage(parseInt(pageNumberParam) - 1);
      return;
    }
    //when the total items change for the page back to zero index
    setForcePage(0);
    //set the use back to page one
    setPageNumberToSessionMemory(1);
  };

  useEffect(() => {
    resetReactPaginate();
  }, [totalPages]);

  return (
    <div>
      <Show>
        <Show.When isTrue={totalPages > 1}>
          <Show>
            <Show.When isTrue={totalItems != null}>
              <span className="mx-1">Total results: {totalItems}</span>
            </Show.When>
          </Show>

          <nav
            aria-label="Page navigation"
            className="mt-2 dialogic-pagination"
          >
            <ReactPaginate
              forcePage={forcePage}
              className="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              breakLabel="..."
              pageCount={totalPages}
              breakClassName="page-item"
              breakLinkClassName="page-link"
              nextLabel={
                !loadOptionsIcons ? (
                  "Next"
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: nextLabelHtml }} />
                )
              }
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              previousLabel={
                !loadOptionsIcons ? (
                  "Previous"
                ) : (
                  <span
                    dangerouslySetInnerHTML={{ __html: backLabelHtml }}
                  ></span>
                )
              }
              renderOnZeroPageCount={null}
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          </nav>
        </Show.When>
      </Show>
    </div>
  );
}
