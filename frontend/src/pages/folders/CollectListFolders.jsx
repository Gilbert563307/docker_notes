import React from "react";
import { Link } from "react-router-dom";
import "./css/CollectListFolders.css";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import useGetFoldersHook from "../../shared/hooks/useGetFoldersHook";
import FoldersSearchBar from "../../features/drive/component/folders/FoldersSearchBar";
import FilterFoldersButton from "../../features/drive/component/folders/FilterFoldersButton";
import FoldersTable from "../../features/drive/component/folders/FoldersTable";
import BS5PaginationV2 from "../../shared/presentation/components/bs5/BS5PaginationV2";

export default function CollectListFolders() {
  useSetPageTitleHook({ title: "Folders " });
  const { folders, total, pages } = useGetFoldersHook();

  return (
    <article className="folders-article">
      <div>
        <div className="drive-container mt-4">
          <div className="tasks-header d-flex justify-content-between">
            <div className="">
              <FoldersSearchBar />
            </div>
            <div className="tasks-article-buttons">
              <div><FilterFoldersButton></FilterFoldersButton></div>
              <div>
                <Link
                  aria-describedby="create task button"
                  className="add-task-button task-btn-plain "
                  to="/folders/create"
                >
                  create
                </Link>
              </div>
            </div>
          </div>
          <div className="tasks-content table-responsive">
            <FoldersTable folders={folders}></FoldersTable>
            <BS5PaginationV2 totalItems={total} totalPages={pages} />
          </div>
        </div>
      </div>
    </article>
  );
}
