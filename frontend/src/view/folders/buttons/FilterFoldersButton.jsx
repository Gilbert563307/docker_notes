import React, { useMemo, useState } from "react";
import {
  FOLDERS_CONTROLLER_ACTIONS,
  useFoldersControllerContext,
} from "../../../controller/FoldersController";
import useHelpers from "../../../helpers/useHelpers";
import { Show } from "../../components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../components/bs5/BS5Modal";
import FoldersFilters from "../components/FoldersFilters";

export default function FilterFoldersButton() {
  const { dispatch } = useFoldersControllerContext();
  const { getHowManyFiltersAreActiveByCurrentPath } = useHelpers();
  const [filterModal, setFilterModal] = useState(false);

  /**
   * Show the filter modal.
   */
  const showFilterModal = () => {
    setFilterModal(true);
  };

  /**
   * Hide the filter modal.
   */
  const hideFilterModal = () => {
    setFilterModal(false);
  };

  const getFilteredResults = () => {
    dispatch({ type: FOLDERS_CONTROLLER_ACTIONS.LIST });
    hideFilterModal();
  };

  const activeFilters = useMemo(() => {
    return getHowManyFiltersAreActiveByCurrentPath();
  }, [filterModal]);

  return (
    <React.Fragment>
      <button
        className="filter-div"
        tabIndex={0}
        role="button"
        onClick={showFilterModal}
      >
        <div className="dialogic-filter active-filters">
          <div className="dialogic-filter-info ">
            <p>Filters</p>
            <Show>
              <Show.When isTrue={activeFilters && activeFilters.length > 0}>
                <div className="total-active-filters">
                  {activeFilters.length}
                </div>
              </Show.When>
            </Show>
          </div>
          <div className="filter-icons">
            <div>
              <i className="fa-solid fa-angle-down"></i>
            </div>
          </div>
        </div>
      </button>
      <Show>
        <Show.When isTrue={filterModal}>
          <BS5Modal
            modal_id="filter_folders_modal"
            modal_label="filter_folders_modal"
            modal_title="Filter Folders"
            modal_content={<FoldersFilters />}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={hideFilterModal}
            saveChangesFunction={getFilteredResults}
            modalSize={MODAL_SIZES.LARGE}
            saveChangesTitle="Apply Filters"
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
