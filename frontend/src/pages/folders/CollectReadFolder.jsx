import React from "react";
import useGetDriveFilesByFolderId from "../../shared/hooks/useGetDriveFilesByFolderId";
import { useLocation } from "react-router-dom";
import "./css/CollectReadFolder.css";
import { Show } from "../../shared/presentation/components/custom/Show";
import RepositoryTable from "../../features/drive/component/drive/RepositoryTable";
import SimplePagination from "../../shared/features/simplePagination/presentation/components/SimplePagination";

export default function CollectReadFolder() {
  let { state } = useLocation();

  const folder = state != null ? state.folder : {};

  const { files, total, pages } = useGetDriveFilesByFolderId();
  
  return (
    <article className="drive-article ">
      <div className="read-folder-name">
        <div className="d-flex gap-1">
          <span>
            <i
              className="fa-duotone fa-solid fa-folder"
              style={{ color: folder?.color }}
            ></i>
          </span>
          {folder?.name}
        </div>
      </div>
      <div className="tasks-content table-responsive">
        <Show>
          <Show.When isTrue={files.length > 0}>
            <RepositoryTable files={files} />
             <SimplePagination totalItems={total} totalPages={pages} />
          </Show.When>
          <Show.Else>
            <p>No files found</p>
          </Show.Else>
        </Show>
      </div>
    </article>
  );
}
