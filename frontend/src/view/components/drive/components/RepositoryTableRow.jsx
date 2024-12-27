import React from "react";
import BS5TruncateSpan from "../../bs5/BS5TruncateSpan";
import ArchiveFileButton from "./buttons/ArchiveFileButton";

/**
 * ArchiveTaskButton Component
 *
 * This component renders a button that, when clicked, opens a modal to confirm the archiving of a task.
 *
 * @param {Object} props - The props object.
 * @param {import("../../../../types/types").DriveFile} props.file - The task id to be archived.
 * @returns {JSX.Element} The rendered component.
 */
export default function RepositoryTableRow({ file }) {
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
        <ArchiveFileButton
          fileId={file.id}
          isArchived={file.archived}
        ></ArchiveFileButton>
        <button>
          <i className="fa-light fa-download"></i>
        </button>
      </td>
    </tr>
  );
}
