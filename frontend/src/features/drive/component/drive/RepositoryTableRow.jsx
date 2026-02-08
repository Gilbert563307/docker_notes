/* eslint-disable react/prop-types */
import React from "react";
import BS5TruncateSpan from "../../../../shared/presentation/components/bs5/BS5TruncateSpan";
// import ArchiveFileButton from "./buttons/ArchiveFileButton";
import DeleteFileButton from "./buttons/DeleteFileButton";
import { DRIVE_CONTROLLER_ACTIONS, useDriveControllerContext } from "../../presentation/DriveController";
import { DownloadFileDto } from "../../presentation/dto/DownloadFileDto";
import { DriveFileDto } from "../../domain/dto/DriveFileDto";
import ArchiveFileButton from "./buttons/ArchiveFileButton";

/**
 *
 * @param {Object} props - The props object.
 * @param {DriveFileDto} props.file -
 * @returns {JSX.Element} The rendered component.
 */
export default function RepositoryTableRow({ file }) {
  const { dispatch } = useDriveControllerContext();
  function downloadFile() {
    dispatch({
      type: DRIVE_CONTROLLER_ACTIONS.DOWNLOAD_FILE,
      payload: new DownloadFileDto(file.getName()),
    });
  }


  return (
    <tr className="repository-table-row">
      <th scope="row">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" disabled={true} />
        </div>
      </th>
      <td>
        <BS5TruncateSpan content={file.getName()} maxWidthToSet="350px" />
      </td>
      <td>{file.getUserLocaleCreatedAt()}</td>
      <td>{file.getUserLocaleUpdatedAt()}</td>
      <td className="main-table-actions">
        <button>
          <i className="fa-light fa-download" onClick={downloadFile}></i>
        </button>
        <DeleteFileButton fileId={file.getId()} filename={file.getName()}></DeleteFileButton>
        {/* <ArchiveFileButton
          fileId={file.getId()}
          isArchived={file.getIsArchived()}
        ></ArchiveFileButton> */}
      </td>
    </tr>
  );
}
