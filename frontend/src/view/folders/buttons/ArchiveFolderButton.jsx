import React, { useId, useState } from "react";
import {
  FOLDERS_CONTROLLER_ACTIONS,
  useFoldersControllerContext,
} from "../../../controller/FoldersController";
import { Show } from "../../components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../components/bs5/BS5Modal";

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

  const modalContent = (
    <p>
      Archiving will move the fodler to the archive and it will no longer be
      visible in your active fodlers list. You can restore it from the archive
      later if needed.
    </p>
  );

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
            modal_title="Are you sure you want to archive this task ?"
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={closeModal}
            saveChangesFunction={archiveFolder}
            modalSize={MODAL_SIZES.LARGE}
            saveChangesClass={4}
            saveChangesTitle="Archive"
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
