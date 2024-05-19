import React, { useEffect } from 'react';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../controller/TasksController';

/**
 * Custom hook for fetching and managing tasks.
 *
 * This hook interacts with the TasksController context to fetch and manage the list of tasks.
 * It automatically fetches tasks when the component mounts and provides the current list of tasks.
 *
 * @returns {Object} The current state of tasks.
 * @returns {Array} tasks - The array of tasks from the state.
 */
export default function useGetTasksHook() {
    const { state, dispatch } = useTasksControllerContext();

    /**
     * Fetches the list of tasks by dispatching the LIST action.
     *
     * @returns {void}
     */
    const fetchTasks = () => {
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.LIST });
    };

    React.useEffect(() => {
        console.log(`state`, state);
    }, [state])

    // Fetch tasks when the component mounts.
    useEffect(() => {
        fetchTasks();
    }, []); // Empty dependency array ensures this runs only once on mount.

    return { tasks: state.tasks.tasks };
}
