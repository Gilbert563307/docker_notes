import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/views/folders/CollectListFolders.css";
import BS5PaginationV2 from "../components/bs5/BS5PaginationV2";
import useSetPageTitleHook from "../../hooks/useSetPageTitleHook";
import useGetFoldersHook from "../../hooks/useGetFoldersHook";
import FoldersTable from "./components/FoldersTable";

export default function CollectListFolders() {
  useSetPageTitleHook({ title: "Folders " });
  const { folders, total, pages } = useGetFoldersHook();

  return (
    <article className="folders-article">
      <div className="tasks-content table-responsive">
        <FoldersTable folders={folders}></FoldersTable>
        <BS5PaginationV2 totalItems={total} totalPages={pages} />
      </div>

      </article>
  );
}
