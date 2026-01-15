import React from "react";
import {
  TASKS_CONTROLLER_ACTIONS,
  useTasksControllerContext,
} from "../../features/kanboard/controller/TasksController";
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
export default function useTasksSearchBarHook({ searchValue }) {
  const { dispatch } = useTasksControllerContext();

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
        type: TASKS_CONTROLLER_ACTIONS.SEARCH_TASKS_BY_SEARCH_TERM,
        payload: debounceSearchInput,
      });
    };
    fetchTasksBySearchTerm();
  }, [debounceSearchInput]);

  return null;
}
