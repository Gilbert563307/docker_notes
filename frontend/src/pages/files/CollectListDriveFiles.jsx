import React from "react";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { Link } from "react-router-dom";
import useGetFilesHook from "../../shared/hooks/useGetFilesHook";
import RepositoryTable from "../../features/drive/component/drive/RepositoryTable";
import BS5PaginationV2 from "../../shared/components/bs5/BS5PaginationV2";
import DriveSearchBar from "../../features/drive/component/drive/DriveSearchBar";

export default function CollectListDriveFiles() {
  useSetPageTitleHook({ title: "Drive " });
  const { files, total, pages } = useGetFilesHook();

  return (
    <article className="drive-article ">
      <div>
        <div className="drive-container mt-4">
          <div className="tasks-header d-flex justify-content-between">
            <div className="">
              <DriveSearchBar />
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
            <RepositoryTable files={files} />
            <BS5PaginationV2 totalItems={total} totalPages={pages} />
          </div>
        </div>
      </div>
    </article>
  );
}
