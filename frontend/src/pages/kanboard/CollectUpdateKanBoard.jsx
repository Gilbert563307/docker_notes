import React from "react";
import KanBoardForm from "../../features/kanboard/component/kanboard/KanBoardForm";
import { KAN_BOARDS_CONTROLLER_ACTIONS } from "../../features/kanboard/presentation/KanBoardsController";
import useGetKanBoardByIdHook from "../../shared/hooks/useGetKanBoardByIdHook";
import { KanBoardDto } from "../../features/kanboard/application/dto/KanBoardDto";

export default function CollectUpdateKanBoard() {
  const { board, dispatch } = useGetKanBoardByIdHook();

  /**
   *
   * @param {{name: string, color: string}} data
   */
  const onSubmit = (data) => {
    const kanBoardDto = new KanBoardDto(
      board.getId(),
      board.getUserUid(),
      data.name,
      data.color,
      board.getIsArchived(),
      board.getIsCollaborative(),
      board.getCreatedAt(),
      board.getUpdatedAt(),
    );
    dispatch({ type: KAN_BOARDS_CONTROLLER_ACTIONS.UPDATE, payload: kanBoardDto });
  };

  return <KanBoardForm onSubmit={onSubmit} board={board} submitButtonValue="update" />;
}
