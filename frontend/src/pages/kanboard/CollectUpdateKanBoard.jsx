import React from "react";
import KanBoardForm from "../../features/kanboard/component/kanboard/KanBoardForm";
import { KAN_BOARDS_CONTROLLER_ACTIONS } from "../../features/kanboard/controller/KanBoardsController";
import useGetKanBoardByIdHook from "../../shared/hooks/useGetKanBoardByIdHook";

export default function CollectUpdateKanBoard() {
  const { board, dispatch } = useGetKanBoardByIdHook();

  /**
   *
   * @param {{name: string, color: string}} data
   */
  const onSubmit = (data) => {
    dispatch({ type: KAN_BOARDS_CONTROLLER_ACTIONS.UPDATE, payload: {...board, ...data} });
  };

  return <KanBoardForm onSubmit={onSubmit} board={board} submitButtonValue="update" />;
}
