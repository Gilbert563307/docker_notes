import { TaskDto } from '../../features/kanboard/application/dto/TaskDto';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../features/kanboard/presentation/TasksController';
import usePaginationHook from './usePaginationHook';

/**
 * Custom hook for fetching and managing tasks.
 *
 * This hook interacts with the TasksController context to fetch and manage the list of tasks.
 * It automatically fetches tasks when the component mounts and provides the current list of tasks.
 *
 * @returns {{tasks: Array<TaskDto>, totalTasks: number, totalPages: number}} tasks - The array of tasks from the state.
 */
export default function useGetTasksHook() {
    const { state, dispatch } = useTasksControllerContext();

    const fetchTasks = () => {
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.LIST });
    };

    usePaginationHook({ methodToCall: fetchTasks });

    return {
        tasks: state.tasks.tasks,
        totalTasks: state.tasks.total,
        totalPages: state.tasks.pages
    };
}

