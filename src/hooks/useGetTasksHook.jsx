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

    const fetchTasks = () => {
        const currentPage = getUrlParams(PAGE_NUMBER) || DEFAULT_PAGE_NUMBER;
        console.log('Dispatching LIST action with currentPage:', currentPage);
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.LIST, payload: { currentPage: parseInt(currentPage) } });
    };

    React.useEffect(() => {
        console.log('State has changed:', state);
    }, [state]);

    usePaginationHook({ methodToCall: fetchTasks });

    useEffect(() => {
        console.log('Component mounted, fetching tasks...');
        fetchTasks();
    }, []);

    return { tasks: state.tasks.tasks, totalTasks: state.tasks.total, totalPages: state.tasks.pages };
}

