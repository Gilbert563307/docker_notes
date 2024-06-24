import React, { useEffect } from 'react';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../controller/TasksController';
import { useParams } from 'react-router-dom';

/**
 * Custom hook to fetch and access task data by ID from the TasksController context.
 *
 * @returns {{ task: import("../controller/TasksController").Task,  dispatch: Function }}
 *   - An object containing the fetched task data or undefined if the task ID is missing or not found.
 *   - The dispatch function from the TasksController context.
 */
export default function useGetTaskHook() {
  const { taskId } = useParams(); // Destructuring for cleaner syntax
  const { state, dispatch } = useTasksControllerContext();

  useEffect(() => {
    const fetchTaskById = async (taskId) => {
      if (!taskId) return; // Early return if no taskId

      dispatch({ type: TASKS_CONTROLLER_ACTIONS.READ, payload: taskId });
    };

    fetchTaskById(taskId);
  }, []);

  return { task: state?.task, dispatch };
}
