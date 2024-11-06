import React, { useEffect } from 'react'
import { BOARD_CONTROLLER_ACTIONS, useBoardsControllerContext } from '../controller/BoardsController';

export default function useGetBoardTasksHook() {
    const { state, dispatch } = useBoardsControllerContext();

    const fetchTasks = () => {
        dispatch({ type: BOARD_CONTROLLER_ACTIONS.LIST });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return { tasks: state.tasks, dispatch: dispatch }
}
