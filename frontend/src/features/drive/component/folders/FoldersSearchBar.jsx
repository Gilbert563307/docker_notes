import React, { useState } from "react";
import useFilesSearchBarHook from "../../../../shared/hooks/useFilesSearchBarHook";

export default function FoldersSearchBar() {
  // State for storing search input value
  const [searchValue, setSearchValue] = useState("");

  // Custom hook for handling document search
  useFilesSearchBarHook({ searchValue: searchValue });

  return (
    <input
      type="text"
      className="form-control "
      id="search_bar"
      placeholder="Search ...."
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  );
}
