import React from "react";
import "../../../assets/css/components/CollectListRepository.css";
import RepositoryTable from "./components/RepositoryTable";
import { Link } from "react-router-dom";
import useGetFilesHook from "../../../hooks/useGetFilesHook";
import BS5PaginationV2 from "../bs5/BS5PaginationV2";

export default function CollectListRepository() {
  const { files, total, pages } = useGetFilesHook();

  // const [files, setFiles] = useState([
  //     { id: 1, folder_id: 1, name: "companies_demo_export.xlsx", created_at: "2021-11-04 11:54", updated_at: "" },
  //     { id: 2, folder_id: 2, name: "demo_image.jpg", created_at: "2021-11-03 22:00", size: "", updated_at: "" },
  //     { id: 3, folder_id: 3, name: "sample_demo_export.xlsx", created_at: "2021-11-02 11:09", updated_at: "" },
  //     { id: 4, folder_id: 4, name: "visit_demo_export.xlsx", created_at: "2021-10-31 17:24", updated_at: "" },
  // ]);

  return (
    <div className="drive-container mt-4">
      <div className="tasks-header d-flex justify-content-between">
        <div className=""></div>
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
  );
}
