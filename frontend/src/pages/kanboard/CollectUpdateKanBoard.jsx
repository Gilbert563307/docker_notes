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
    const kanBoardDto = new KanBoardDto.Builder()
    .id(board.getId())
    .userUid(board.getUserUid())
    .name(data.name)
    .color(data.color)
    .archived(board.getIsArchived())
    .collaborative(board.getIsCollaborative())
    .createdAt(board.getCreatedAt())
    .updatedAt(board.getUpdatedAt())
    .build(); 
    dispatch({ type: KAN_BOARDS_CONTROLLER_ACTIONS.UPDATE, payload: kanBoardDto });
  };

  return <KanBoardForm onSubmit={onSubmit} board={board} submitButtonValue="update" />;
}
