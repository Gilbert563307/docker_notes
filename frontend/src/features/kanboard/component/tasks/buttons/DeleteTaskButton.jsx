import React, { useState } from 'react'
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../../presentation/TasksController';
import { Show } from '../../../../../shared/components/custom/Show';
import BS5Modal, { MODAL_SIZES } from '../../../../../shared/components/bs5/BS5Modal';

export default function DeleteTaskButton({ taskId }) {
    const { dispatch } = useTasksControllerContext();
    const [deleteModal, setDeleteModal] = useState(false);

    const showModal = () => {
        setDeleteModal(true);
    };

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
        <button
          onClick={showModal}
          type="button"
          className="btn btn-outline-danger delete-btn-plain"
        >
          Delete task
        </button>
        <Show>
          <Show.When isTrue={deleteModal}>
            <BS5Modal
              modal_id="delete_tasks_modal"
              modal_label="delete_tasks_modal"
              modal_title="Are you sure you want to delete this task?"
              modal_content={modalContent}
              showSaveChanges={true}
              modal_footer={true}
              headerCentre={true}
              closeModal={hideModal}
              saveChangesFunction={deleteTask}
              modalSize={MODAL_SIZES.NONE}
              saveChangesTitle="Delete"
              saveChangesClass={4}
            />
          </Show.When>
        </Show>
      </React.Fragment>
    );
}
