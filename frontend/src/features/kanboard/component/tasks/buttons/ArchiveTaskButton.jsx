/* eslint-disable react/prop-types */
import React, { useId, useState } from "react";
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from "../../../presentation/TasksController";
import { Show } from "../../../../../shared/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../../shared/components/bs5/BS5Modal";
import { TaskDto } from "../../../application/dto/TaskDto";

/**
 * ArchiveTaskButton Component
 *
 * This component renders a button that, when clicked, opens a modal to confirm the archiving of a task.
 *
 * @param {Object} props - The props object.
 * @param {TaskDto} props.task - The task id to be archived.
 * @param {boolean} props.isArchived - The task id to be archived.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function ArchiveTaskButton({ task, isArchived }) {
  const { dispatch } = useTasksControllerContext();
  const modalId = useId();
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
    const archived = isArchived === true ? false : true;
    const payload = { ...task.toJson(), archived: archived };
    dispatch({ type: TASKS_CONTROLLER_ACTIONS.ARCHIVE, payload: payload });
    hideArchiveModal();
  };


  const modalContent = isArchived ? (
    <p>
      Restoring this task will move it back to your active task list. You can archive it again later if needed.
    </p>
  ) : (
    <p>
      Archiving will move the task to the archive and it will no longer be visible in your active task list. You can restore it from the archive later if needed.
    </p>
  );

 

  const modalTitle = isArchived
    ? "Are you sure you want to restore this task ?"
    : "Are you sure you want to archive this task ?";

  const saveChangesTitle = isArchived ? "Restore" : "Archive";
  const saveChangesClass = isArchived ? 3 : 4;

  return (
    <React.Fragment>
      <button onClick={showArchiveModal}>
        <i className="fa-light fa-box-archive"></i>
      </button>
      <Show>
        <Show.When isTrue={archiveModal}>
          <BS5Modal
            modal_id={modalId}
            modal_label="archive_tasks_modal"
            modal_title={modalTitle}
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={hideArchiveModal}
            saveChangesFunction={archiveTask}
            modalSize={MODAL_SIZES.LARGE}
            saveChangesClass={saveChangesClass}
            saveChangesTitle={saveChangesTitle}
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
