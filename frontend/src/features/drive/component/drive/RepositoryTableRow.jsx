/* eslint-disable react/prop-types */
import React from "react";
import BS5TruncateSpan from "../../../../shared/presentation/components/bs5/BS5TruncateSpan";
// import ArchiveFileButton from "./buttons/ArchiveFileButton";
import DeleteFileButton from "./buttons/DeleteFileButton";
import { DownloadFileDto } from "../../presentation/dto/DownloadFileDto";
import { DriveFileDto } from "../../domain/dto/DriveFileDto";

/**
 *
 * @param {Object} props - The props object.
 * @param {DriveFileDto} props.file -
 * @param {(arg: DriveFileDto) => void} props.downloadMethod
 * @returns {JSX.Element} The rendered component.
 */
export default function RepositoryTableRow({ file, downloadMethod }) {
  function downloadFile() {
    downloadMethod(file)
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
          <i className="fa-solid fa-download" onClick={downloadFile}></i>
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
