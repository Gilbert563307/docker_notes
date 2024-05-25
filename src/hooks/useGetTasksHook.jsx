import React, { useEffect } from 'react';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../controller/TasksController';
import usePaginationHook from './usePaginationHook';
import useHelpers from '../helpers/useHelpers';
import { DEFAULT_PAGE_NUMBER, PAGE_NUMBER } from '../config';

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
    const { getUrlParams } = useHelpers();
    const { state, dispatch } = useTasksControllerContext();

    /**
     * Fetches the list of tasks by dispatching the LIST action.
     *
     * @returns {void}
     */
    const fetchTasks = () => {
        const currentPage = getUrlParams(PAGE_NUMBER) || DEFAULT_PAGE_NUMBER;
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.LIST, payload: { currentPage: parseInt(currentPage) } });
    };

    React.useEffect(() => {
        console.log(`state`, state);
    }, [state])

    // Utilize pagination hook
    usePaginationHook({ methodToCall: fetchTasks });

    // Fetch tasks when the component mounts.
    useEffect(() => {
        fetchTasks();
    }, []); // Empty dependency array ensures this runs only once on mount.

    return { tasks: state.tasks.tasks, totalTasks: state.tasks.total, totalPages: state.tasks.pages };
}
