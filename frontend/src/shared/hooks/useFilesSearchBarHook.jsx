import React from "react";
import {
  FOLDERS_CONTROLLER_ACTIONS,
  useFoldersControllerContext,
} from "../controller/FoldersController";
import { useDebounce } from "use-debounce";
import { DEBOUNCE_SECONDS } from "../../config";

/**
 * A custom React hook for handling task search functionality.
 * It dispatches an action to search tasks based on the provided search value.
 *
 * @param {Object} props - The props object.
 * @param {string} props.searchValue - The search value used for task search.
 * @returns {null} Returns null as this hook does not render any UI elements directly.
 */
export default function useFilesSearchBarHook({ searchValue }) {
  const { dispatch } = useFoldersControllerContext();

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
        type: FOLDERS_CONTROLLER_ACTIONS.SEARCH_FOLDERS_BY_SEARCH_TERM,
        payload: debounceSearchInput,
      });
    };
    fetchTasksBySearchTerm();
  }, [debounceSearchInput]);

  return null;
}
