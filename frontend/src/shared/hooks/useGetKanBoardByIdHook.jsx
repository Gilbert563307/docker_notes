import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  KAN_BOARDS_CONTROLLER_ACTIONS,
  useKanBoardsControllerContext,
} from "../../features/kanboard/controller/KanBoardsController";

export default function useGetKanBoardByIdHook() {
  const { kanBoardId } = useParams();
  const { state, dispatch } = useKanBoardsControllerContext();

  useEffect(() => {
    /**
     *
     * @param {string | undefined} id
     * @returns {Void}
     */
    function fetchKanBoardById(id) {
      if (!id) return;

      dispatch({
        type: KAN_BOARDS_CONTROLLER_ACTIONS.READ,
        payload: id,
      });
    }
    fetchKanBoardById(kanBoardId);

  }, [kanBoardId]);

  return { board: state.board, dispatch };
}
