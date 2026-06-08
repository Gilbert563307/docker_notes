/* eslint-disable react/prop-types */
import React, { useId, useState } from "react";
import { FOLDERS_CONTROLLER_ACTIONS, useFoldersControllerContext } from "../../presentation/FoldersController";
import { Show } from "../../../../shared/presentation/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../shared/presentation/components/bs5/BS5Modal";
import { FolderDto } from "../../domain/dto/FolderDto";
import { ArchiveFolderDto } from "../../presentation/dto/ArchiveFolderDto";

/**
 *
 *
 * @param {Object} props - The props object.
 * @param {FolderDto} props.folder
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function ArchiveFolderButton({ folder }) {
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
    const archived = folder.getIsArchived() === true ? false : true;
    dispatch({
      type: FOLDERS_CONTROLLER_ACTIONS.ARCHIVE,
      payload: new ArchiveFolderDto(
        folder.getId(),
        folder.getUserUid(),
        folder.getName(),
        folder.getColor(),
        archived,
        folder.getCreatedAt(),
        folder.getUpdatedAt(),
      ),
    });
    closeModal();
  };

  const modalContent = folder.getIsArchived() ? (
    <p>
      Restoring this folder will move it back to your active folders list. You can archive it again later if needed.
    </p>
  ) : (
    <p>
      Archiving will move the folder to the archive and it will no longer be visible in your active folders list. You
      can restore it from the archive later if needed.
    </p>
  );

  const modalTitle = folder.getIsArchived()
    ? "Are you sure you want to restore this folder ?"
    : "Are you sure you want to archive this folder ?";

  const saveChangesTitle = folder.getIsArchived() ? "Restore" : "Archive";
  const saveChangesClass = folder.getIsArchived() ? 3 : 4;

  return (
    <React.Fragment>
      <button onClick={showModal}>
        <i className="fa-solid fa-box-archive"></i>
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
