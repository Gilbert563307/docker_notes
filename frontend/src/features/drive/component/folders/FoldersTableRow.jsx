import React from "react";
import { Link } from "react-router-dom";
import BS5TruncateSpan from "../../../../shared/presentation/components/bs5/BS5TruncateSpan";
import ArchiveFolderButton from "./ArchiveFolderButton";

/**
 *
 * @param {Object} props - The properties object.
 * @param {import("../../../../types/types").Folder } props.folder -
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
              style={{ color: folder.color }}
            ></i>
          </span>

          <BS5TruncateSpan
            title={`${folder.name} folder`}
            content={
              <Link
                to={`/folders/read/${folder.id}`}
                state={{ folder: folder }}
                className="read-link"
              >
                {folder.name}
              </Link>
            }
            maxWidthToSet="350px"
          />
        </div>
      </td>
      <td>{folder.created_at.toLocaleString()}</td>
      <td>{folder.updated_at.toLocaleString()}</td>
      <td className="main-table-actions">
        <button>
          <Link to={`/folders/read/${folder.id}`} state={{ folder: folder }}>
            <i className="fa-light fa-magnifying-glass"></i>
          </Link>
        </button>
        <button>
          <Link to={`/folders/update/${folder.id}`}>
            <i className="fa-sharp fa-light fa-pencil"></i>
          </Link>
        </button>
        <ArchiveFolderButton
          folderId={folder.id}
          isArchived={folder.archived}
        ></ArchiveFolderButton>
      </td>
    </tr>
  );
}
