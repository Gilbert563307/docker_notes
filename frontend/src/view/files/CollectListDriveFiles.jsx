import React from "react";
import useSetPageTitleHook from "../../hooks/useSetPageTitleHook";
import { Link } from "react-router-dom";
import RepositoryTable from "../components/drive/components/RepositoryTable";
import BS5PaginationV2 from "../components/bs5/BS5PaginationV2";
import useGetFilesHook from "../../hooks/useGetFilesHook";
import { Show } from "../components/custom/Show";
import DriveSearchBar from "./components/DriveSearchBar";

export default function CollectListDriveFiles() {
  useSetPageTitleHook({ title: "Drive " });
  const { files, total, pages } = useGetFilesHook();

  return (
    <article className="drive-article ">
      <div>
        <div className="drive-container mt-4">
          <div className="tasks-header d-flex justify-content-between">
            <div className="">
              <DriveSearchBar/>
            </div>
            <div className="tasks-article-buttons">
              <div>{/* FILTER BUTTON TODO */}</div>
              <div>
                <Link
                  aria-describedby="create task button"
                  className="add-task-button task-btn-plain "
                  to="/drive/upload"
                >
                  Upload
                </Link>
              </div>
            </div>
          </div>
          <div className="tasks-content table-responsive">
            <Show>
              <Show.When isTrue={files.length > 0}>
                <RepositoryTable files={files} />
                <BS5PaginationV2 totalItems={total} totalPages={pages} />
              </Show.When>
              <Show.Else render="No files available"></Show.Else>
            </Show>
          </div>
        </div>
      </div>
    </article>
  );
}
