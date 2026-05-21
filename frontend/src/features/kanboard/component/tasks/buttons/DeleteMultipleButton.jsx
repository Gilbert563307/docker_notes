import React, { useId, useState } from "react";
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from "../../../presentation/TasksController";
import { Show } from "../../../../../shared/presentation/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../../shared/presentation/components/bs5/BS5Modal";

/**
 * Component representing a table of tasks.
 *
 * @param {Object} props - The properties object.
 * @param {Map<string, boolean>} props.mapIdsToDelete -
 * @param {Function} props.resetSelectedTasks -
 * @returns {JSX.Element}
 */
export default function DeleteMultipleButton({ mapIdsToDelete, resetSelectedTasks }) {
  const { dispatch } = useTasksControllerContext();
  const modalId = useId();
  const [deleteModal, setDeleteModal] = useState(false);

  const showModal = () => {
    setDeleteModal(true);
  };

  const hideModal = () => {
    setDeleteModal(false);
  };

  const deleteAll = () => {
    if (mapIdsToDelete.size === 0) return;
    dispatch({ type: TASKS_CONTROLLER_ACTIONS.DELETE_MULTIPLE, payload: mapIdsToDelete });
    resetSelectedTasks();
    hideModal();
  };

  const modalTitle = "Are you sure you want to delete all of these tasks?";
  const modalContent = "After deleting these tasks they cannot be restored";

  return (
    <>
      <button aria-describedby="delete mulitple task button" className="delete-btn-plain" onClick={showModal}>
        Delete multiple
      </button>
      <Show>
        <Show.When isTrue={deleteModal}>
          <BS5Modal
            modal_id={modalId}
            modal_label="delete_tasks_modal"
            modal_title={modalTitle}
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={hideModal}
            saveChangesFunction={deleteAll}
            modalSize={MODAL_SIZES.LARGE}
            saveChangesClass={4}
            saveChangesTitle="Delete All"
          />
        </Show.When>
      </Show>
    </>
  );
}
