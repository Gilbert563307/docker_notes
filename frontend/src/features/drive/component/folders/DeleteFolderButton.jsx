import React, { useState } from "react";
import { FOLDERS_CONTROLLER_ACTIONS, useFoldersControllerContext } from "../../presentation/FoldersController";
import { Show } from "../../../../shared/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../shared/components/bs5/BS5Modal";

export default function DeleteFolderButton({ folderId }) {
  const { dispatch } = useFoldersControllerContext();
  const [deleteModal, setDeleteModal] = useState(false);

  const showModal = () => {
    setDeleteModal(true);
  };

  const hideModal = () => {
    setDeleteModal(false);
  };

  const deleteFolder = () => {
    dispatch({ type: FOLDERS_CONTROLLER_ACTIONS.DELETE, payload: folderId });
    hideModal();
  };

  const modalContent = (
    <p>
      {" "}
      Deleting this folder will permanently remove it from your folder's list,
      and it cannot be restored later. Please confirm if you wish to proceed
      with this permanent deletion.
    </p>
  );
  return (
    <React.Fragment>
      <button
        onClick={showModal}
        type="button"
        className="btn btn-outline-danger delete-btn-plain"
      >
        Delete folder
      </button>
      <Show>
        <Show.When isTrue={deleteModal}>
          <BS5Modal
            modal_id="archive_tasks_modal"
            modal_label="archive_tasks_modal"
            modal_title="Are you sure you want to delete this folder?"
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={hideModal}
            saveChangesFunction={deleteFolder}
            modalSize={MODAL_SIZES.NONE}
            saveChangesTitle="Delete"
            saveChangesClass={4}
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
