import React from "react";
import SessionMemoryFilter from "../../components/custom/SessionMemoryFilter";
import { FOLDERS_ARCHIVED_SESSION_FILTER } from "../../../../config";

export default function FoldersFilters() {
  return (
    <div className="tasks-filters">
      <SessionMemoryFilter
        FILTER_TO_CHECK={FOLDERS_ARCHIVED_SESSION_FILTER}
        LABEL="Archived folders"
        ID="archived_folders"
      />
    </div>
  );
}
