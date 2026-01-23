import React, { useState } from "react";

import { Show } from "../../../../../shared/presentation/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../../shared/presentation/components/bs5/BS5Modal";
import { ArchiveFileDto } from "../../../presentation/dto/ArchiveFileDto";
import { DRIVE_CONTROLLER_ACTIONS, useDriveControllerContext } from "../../../presentation/DriveController";

export default function ArchiveFileButton({ fileId, isArchived }) {
  const { dispatch } = useDriveControllerContext();
  const [archiveModal, setArchiveModal] = useState(false);

  const showArchiveModal = () => {
    setArchiveModal(true);
  };

  const hideArchiveModal = () => {
    setArchiveModal(false);
  };

  const archiveTask = () => {
    const archived = isArchived === true ? false : true;
    dispatch({ type: DRIVE_CONTROLLER_ACTIONS.ARCHIVE, payload: new ArchiveFileDto(fileId, archived) });
    hideArchiveModal();
  };

  const modalContent = (
    <p>
      Archiving will move the file to the archive and it will no longer be
      visible in your active file list. You can restore it from the archive
      later if needed.
    </p>
  );

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
            modal_title="Are you sure you want to archive this file ?"
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