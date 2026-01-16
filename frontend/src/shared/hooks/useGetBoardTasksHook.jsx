import { useEffect } from "react";
import {
  BOARD_CONTROLLER_ACTIONS,
  useBoardsControllerContext,
} from "../../features/kanboard/controller/BoardsController";

/**
 *
 * @param {Object} props
 * @param {string} props.boardId
 * @returns {{tasks: Array<import("../../types/types").Task>, dispatch: Function}}
 */
export default function useGetBoardTasksHook({ boardId }) {
  const { state, dispatch } = useBoardsControllerContext();

  const fetchTasks = () => {
    dispatch({ type: BOARD_CONTROLLER_ACTIONS.LIST, payload: {boardId: boardId} });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks: state.tasks, dispatch: dispatch };
}
