import React, { useState } from 'react'
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../../../controller/TasksController';
import { Show } from '../../../components/custom/Show';
import BS5Modal, { MODAL_SIZES } from '../../../components/bs5/BS5Modal';

export default function DeleteTaskButton({ taskId }) {
    const { dispatch } = useTasksControllerContext();
    const [deleteModal, setDeleteModal] = useState(false);

    /**
     * Show the archive modal
     */
    const showModal = () => {
        setDeleteModal(true);
    };

    /**
    * Hide the archive modal
    */
    const hideModal = () => {
        setDeleteModal(false);
    };

    const deleteTask = () => {
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.DELETE, payload: taskId })
        hideModal();
    }

    const modalContent = <p> Deleting this task will permanently remove it from your task list, and it cannot be restored later.
        Please confirm if you wish to proceed with this permanent deletion.
    </p>;
    return (
        <React.Fragment>
            <button onClick={showModal} type="button" className="btn btn-outline-danger delete-btn-plain">Delete task</button>
            <Show>
                <Show.When isTrue={deleteModal}>
                    <BS5Modal
                        modal_id="archive_tasks_modal"
                        modal_label="archive_tasks_modal"
                        modal_title="Are you sure you want to archive this task ?"
                        modal_content={modalContent}
                        showSaveChanges={true}
                        modal_footer={true}
                        headerCentre={true}
                        closeModal={hideModal}
                        saveChangesFunction={deleteTask}
                        modalSize={MODAL_SIZES.NONE}
                        saveChangesTitle="Archive"
                    />
                </Show.When>
            </Show>
        </React.Fragment>
    )
}
