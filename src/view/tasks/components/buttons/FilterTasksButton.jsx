import React, { useState } from 'react';
import { Show } from '../../../components/custom/Show';
import BS5Modal, { MODAL_SIZES } from '../../../components/bs5/BS5Modal';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../../../controller/TasksController';
import TasksFilters from '../TasksFilters';

/**
 * A button component that opens a modal for filtering tasks.
 *
 * @returns {JSX.Element} The rendered button and modal for filtering tasks.
 */
export default function FilterTasksButton() {
    const { dispatch } = useTasksControllerContext();
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

    return (
        <React.Fragment>
            <button className="btn btn-filter task-btn-plain" onClick={showFilterModal}>
                Filters
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
