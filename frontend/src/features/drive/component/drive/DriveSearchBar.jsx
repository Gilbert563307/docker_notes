import React, { useState } from "react";
import useDriveSearchBarHook from "../../../../shared/hooks/useDriveSearchBarHook";

export default function DriveSearchBar() {
  // State for storing search input value
  const [searchValue, setSearchValue] = useState("");

  // Custom hook for handling document search
  useDriveSearchBarHook({ searchValue: searchValue });

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