import React from "react";
import BS5TruncateSpan from "../../bs5/BS5TruncateSpan";
import ArchiveFileButton from "./buttons/ArchiveFileButton";
import DeleteFileButton from "./buttons/DeleteFileButton";
import {
  DRIVE_CONTROLLER_ACTIONS,
  useDriveControllerContext,
} from "../../../../controller/DriveController";

/**
 *
 * @param {Object} props - The props object.
 * @param {import("../../../../types/types").DriveFile} props.file -
 * @returns {JSX.Element} The rendered component.
 */
export default function RepositoryTableRow({ file }) {
  const { dispatch } = useDriveControllerContext();
  function downloadFile() {
    dispatch({
      type: DRIVE_CONTROLLER_ACTIONS.DOWNLOAD_FILE,
      payload: { filename: file.name },
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
        <BS5TruncateSpan content={file.name} maxWidthToSet="350px" />
      </td>
      <td>{file.created_at.toLocaleString()}</td>
      <td>{file.updated_at.toLocaleString()}</td>
      <td className="main-table-actions">
        <button>
          <i className="fa-light fa-download" onClick={downloadFile}></i>
        </button>
        <DeleteFileButton
          fileId={file.id}
          filename={file.name}
        ></DeleteFileButton>
        {/* <ArchiveFileButton
          fileId={file.id}
          isArchived={file.archived}
        ></ArchiveFileButton> */}
      </td>
    </tr>
  );
}
