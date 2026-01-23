import React from "react";

import { useDebounce } from "use-debounce";
import { DEBOUNCE_SECONDS } from "../../config";
import { DRIVE_CONTROLLER_ACTIONS, useDriveControllerContext } from "../../features/drive/presentation/DriveController";
import { ListFilesBySearchTermDto } from "../../features/drive/presentation/dto/ListFilesBySearchTermDto";

/**
 * @param {Object} props - The props object.
 * @param {string} props.searchValue - The search value used for  search.
 * @returns {null} Returns null as this hook does not render any UI elements directly.
 */
export default function useDriveSearchBarHook({ searchValue }) {
  const { dispatch } = useDriveControllerContext();

  // Debounce the search value to prevent frequent API calls
  const [debounceSearchInput] = useDebounce(searchValue, DEBOUNCE_SECONDS);

  // Effect hook to dispatch search action when debounceSearchInput changes
  React.useEffect(() => {
    /**
     * Fetch tasks by search term.
     * Dispatches an action to search tasks based on the debounced search input.
     */
    const fetchTasksBySearchTerm = () => {
      dispatch({
        type: DRIVE_CONTROLLER_ACTIONS.SEARCH_FILES_BY_SEARCH_TERM,
        payload: new ListFilesBySearchTermDto(debounceSearchInput),
      });
    };
    fetchTasksBySearchTerm();
  }, [debounceSearchInput]);

  return null;
}
