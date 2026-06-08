import React, { useState } from 'react'
import useTasksSearchBarHook from '../../../../shared/hooks/useTasksSearchBarHook';

export default function TasksSearchBar() {
    // State for storing search input value
    const [searchValue, setSearchValue] = useState("");

    // Custom hook for handling document search
    useTasksSearchBarHook({ searchValue: searchValue });

    return (
        <input
            type="text"
            className="form-control "
            id="search_bar"
            placeholder="Search ...."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
        />
    )
}
