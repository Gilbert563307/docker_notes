/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import BS5TruncateSpan from "../../../../shared/presentation/components/bs5/BS5TruncateSpan";
import ArchiveFolderButton from "./ArchiveFolderButton";
import { FolderDto } from "../../domain/dto/FolderDto";

/**
 *
 * @param {Object} props - The properties object.
 * @param {FolderDto } props.folder -
 * @returns {JSX.Element} The rendered  component.
 */
export default function FoldersTableRow({ folder }) {
  return (
    <tr className="repository-table-row">
      <th scope="row">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" disabled={true} />
        </div>
      </th>
      <td>
        <div className="d-flex gap-1">
          <span>
            <i
              className="fa-duotone fa-solid fa-folder"
              style={{ color: folder.getColor() }}
            ></i>
          </span>

          <BS5TruncateSpan
            title={`${folder.getName()} folder`}
            content={
              <Link
                to={`/folders/read/${folder.getId()}`}
                state={{ folder: folder }}
                className="read-link"
              >
                {folder.getName()}
              </Link>
            }
            maxWidthToSet="350px"
          />
        </div>
      </td>
      <td>{folder.getUserLocaleCreatedAt()}</td>
      <td>{folder.getUserLocaleUpdatedAt()}</td>
      <td className="main-table-actions">
        <button>
          <Link to={`/folders/read/${folder.getId()}`} state={{ folder: folder.toJson() }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </Link>
        </button>
        <button>
          <Link to={`/folders/update/${folder.getId()}`}>
            <i className="fa-solid fa-pencil"></i>
          </Link>
        </button>
        <ArchiveFolderButton
          folder={folder}
        ></ArchiveFolderButton>
      </td>
    </tr>
  );
}
