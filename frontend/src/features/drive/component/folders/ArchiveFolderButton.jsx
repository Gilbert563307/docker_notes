import React, { useId, useState } from "react";
import { FOLDERS_CONTROLLER_ACTIONS, useFoldersControllerContext } from "../../presentation/FoldersController";
import { Show } from "../../../../shared/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../shared/components/bs5/BS5Modal";

/**
 *
 *
 * @param {Object} props - The props object.
 * @param {string} props.folderId
 * @param {boolean} props.isArchived
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function ArchiveFolderButton({ folderId, isArchived }) {
  const { dispatch } = useFoldersControllerContext();
  const modalId = useId();
  const [modal, setModal] = useState(false);

  const showModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const archiveFolder = () => {
    const archived = isArchived === true ? false : true;
    const payload = { id: folderId, archived: archived };
    dispatch({ type: FOLDERS_CONTROLLER_ACTIONS.ARCHIVE, payload: payload });
    closeModal();
  };

  const modalContent = isArchived ? (
    <p>
      Restoring this folder will move it back to your active folders list. You can archive it again later if needed.
    </p>
  ) : (
    <p>
      Archiving will move the folder to the archive and it will no longer be visible in your active folders list. You can restore it from the archive later if needed.
    </p>
  );

  const modalTitle = isArchived
    ? "Are you sure you want to restore this folder ?"
    : "Are you sure you want to archive this folder ?";

  const saveChangesTitle = isArchived ? "Restore" : "Archive";
  const saveChangesClass = isArchived ? 3 : 4;

  return (
    <React.Fragment>
      <button onClick={showModal}>
        <i className="fa-light fa-box-archive"></i>
      </button>
      <Show>
        <Show.When isTrue={modal}>
          <BS5Modal
            modal_id={modalId}
            modal_label="archive_tasks_modal"
            modal_title={modalTitle}
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={closeModal}
            saveChangesFunction={archiveFolder}
            modalSize={MODAL_SIZES.LARGE}
            saveChangesClass={saveChangesClass}
            saveChangesTitle={saveChangesTitle}
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
