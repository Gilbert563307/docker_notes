import React, { useMemo, useState } from 'react';
import { Show } from '../../../../shared/components/custom/Show';
import BS5Modal, { MODAL_SIZES } from '../../../../shared/components/bs5/BS5Modal';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../controller/TasksController';
import TasksFilters from '../../../../view/tasks/components/TasksFilters';
import useHelpers from '../../../../helpers/useHelpers';
import "../../../../assets/css/components/DialogicFilterButton.css";

/**
 * A button component that opens a modal for filtering tasks.
 *
 * @returns {JSX.Element} The rendered button and modal for filtering tasks.
 */
export default function FilterTasksButton() {
    const { dispatch } = useTasksControllerContext();
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

    /**
     * Function to handle the filtering of tasks.
     */
    const getFilteredTasks = () => {
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.LIST });
        hideFilterModal();
    };

    //added the use memo for react to remember the active filters and only do this calculate when the modal state changes, otherwise when the
    //the list of active user session filters change this will become an expensive calculation.
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
                                <div className="total-active-filters">{activeFilters.length}</div>
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
                        modal_id="filter_tasks_modal"
                        modal_label="filter_tasks_modal"
                        modal_title="Filter Tasks"
                        modal_content={<TasksFilters />}
                        showSaveChanges={true}
                        modal_footer={true}
                        headerCentre={true}
                        closeModal={hideFilterModal}
                        saveChangesFunction={getFilteredTasks}
                        modalSize={MODAL_SIZES.LARGE}
                        saveChangesTitle="Apply Filters"
                    />
                </Show.When>
            </Show>
        </React.Fragment>
    );
}
