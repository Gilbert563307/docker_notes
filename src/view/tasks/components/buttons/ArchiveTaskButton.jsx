/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Show } from '../../../components/custom/Show';
import BS5Modal from '../../../components/bs5/BS5Modal';

/**
 * ArchiveTaskButton Component
 * 
 * This component renders a button that, when clicked, opens a modal to confirm the archiving of a task.
 *
 * @param {Object} props - The props object.
 * @param {string} props.taskTitle - The title of the task to be archived.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function ArchiveTaskButton({ taskTitle }) {
    const [archiveModal, setArchiveModal] = useState(false);

    /**
     * Show the archive modal
     */
    const showArchiveModal = () => {
        setArchiveModal(true);
    };

    const modalTitle = `Are you sure you want to archive ${taskTitle}?`;

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
                        modal_title="Archive task"
                        modal_content={modalTitle}
                        showSaveChanges={false}
                        modal_footer={false} 
                        headerCentre={true}
                    />
                </Show.When>
            </Show>
        </React.Fragment>
    );
}
