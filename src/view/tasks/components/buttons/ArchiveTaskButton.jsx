/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Show } from '../../../components/custom/Show';
import BS5Modal, { MODAL_SIZES } from '../../../components/bs5/BS5Modal';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../../../controller/TasksController';

/**
 * ArchiveTaskButton Component
 * 
 * This component renders a button that, when clicked, opens a modal to confirm the archiving of a task.
 *
 * @param {Object} props - The props object.
 * @param {string} props.taskId - The task id to be archived.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function ArchiveTaskButton({ taskId }) {
    const { dispatch } = useTasksControllerContext();
    const [archiveModal, setArchiveModal] = useState(false);

    /**
     * Show the archive modal
     */
    const showArchiveModal = () => {
        setArchiveModal(true);
    };

    /**
    * Hide the archive modal
    */
    const hideArchiveModal = () => {
        setArchiveModal(false);
    };

    const archiveTask = () => {
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.ARCHIVE, payload: taskId })
        hideArchiveModal();
    }

    const modalContent = <p> Archiving will move the task to the archive and it will no longer be visible in your active task list. You can restore it from the archive later if needed.
    </p>;

    return (
        <React.Fragment>
            <button onClick={showArchiveModal}>
                <i className="fa-light fa-box-archive"></i>
            </button>
            <Show>
                <Show.When isTrue={archiveModal}>
                    <BS5Modal
                        modal_id="archive_tasks_modal"
                        modal_label="archive_tasks_modal"
                        modal_title="Are you sure you want to archive this task ?"
                        modal_content={modalContent}
                        showSaveChanges={true}
                        modal_footer={true}
                        headerCentre={true}
                        closeModal={hideArchiveModal}
                        saveChangesFunction={archiveTask}
                        modalSize={MODAL_SIZES.LARGE}
                        saveChangesTitle="Archive"
                    />
                </Show.When>
            </Show>
        </React.Fragment>
    );
}
