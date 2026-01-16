import React, { useState } from "react";
import { Show } from "../../../../../shared/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../../shared/components/bs5/BS5Modal";
import { DRIVE_CONTROLLER_ACTIONS, useDriveControllerContext } from "../../../controller/DriveController";

/**
 * 
 * @param {Object} props 
 * @param {string} props.fileId
 * @param {string} props.filename
 * @returns 
 */
export default function DeleteFileButton({ fileId, filename }) {
  const { dispatch } = useDriveControllerContext();
  const [modal, setModal] = useState(false);

  const showArchiveModal = () => {
    setModal(true);
  };

  const hideArchiveModal = () => {
    setModal(false);
  };

  function deleteFile() {
    dispatch({
      type: DRIVE_CONTROLLER_ACTIONS.DELETE,
      payload: { id: fileId, filename: filename },
    });
    hideArchiveModal();
  }

  const modalContent = (
    <p>
      Deleting this file will permanently remove it from your active file list.
      You will no longer be able to access it unless it has been backed up or
      archived elsewhere. Please confirm if you wish to proceed.
    </p>
  );

  return (
    <React.Fragment>
      <button onClick={showArchiveModal}>
        <i className="fa-solid fa-trash"></i>
      </button>
      <Show>
        <Show.When isTrue={modal}>
          <BS5Modal
            modal_id="archive_tasks_modal"
            modal_label="archive_tasks_modal"
            modal_title="Are you sure you want to delete this file ?"
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            saveChangesClass={4}
            closeModal={hideArchiveModal}
            saveChangesFunction={deleteFile}
            modalSize={MODAL_SIZES.LARGE}
            saveChangesTitle="Delete"
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
