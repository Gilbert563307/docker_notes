import React, { useEffect } from 'react';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../controller/TasksController';
import usePaginationHook from './usePaginationHook';

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

    const fetchTasks = () => {
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.LIST });
    };

 
    usePaginationHook({ methodToCall: fetchTasks });

    useEffect(() => {
        // console.log('Component mounted, fetching tasks...');
        fetchTasks();
    }, []);

    return { tasks: state.tasks.tasks, totalTasks: state.tasks.total, totalPages: state.tasks.pages };
}

