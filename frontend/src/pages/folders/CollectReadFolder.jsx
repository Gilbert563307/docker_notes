import React, { useEffect, useState } from "react";
import useGetDriveFilesByFolderId from "../../shared/hooks/useGetDriveFilesByFolderId";
import RepositoryTable from "../components/drive/components/RepositoryTable";
import BS5PaginationV2 from "../components/bs5/BS5PaginationV2";
import { useLocation } from "react-router-dom";
import "../../assets/css/views/folders/CollectReadFolder.css";
import { Show } from "../components/custom/Show";

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
            <BS5PaginationV2 totalItems={total} totalPages={pages} />
          </Show.When>
          <Show.Else>
            <p>No files found</p>
          </Show.Else>
        </Show>
      </div>
    </article>
  );
}
