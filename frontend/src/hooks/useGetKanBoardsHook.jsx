import { useEffect } from "react";
import {
  KAN_BOARDS_CONTROLLER_ACTIONS,
  useKanBoardsControllerContext,
} from "../controller/KanBoardsController";

export default function useGetKanBoardsHook() {
  const { state, dispatch } = useKanBoardsControllerContext();

  useEffect(() => {
    const fetchTasks = () => {
      dispatch({ type: KAN_BOARDS_CONTROLLER_ACTIONS.LIST });
    };

    fetchTasks();
  }, []);
  console.log(state);
  return { boards: state.boards };
}
