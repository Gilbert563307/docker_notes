import { KanBoard } from "../../domain/KanBoard.js";
import { KanBoardDto } from "../dto/KanBoardDto.js";

export class KanBoardMapper {
  /**
   * Convert an array of KanBoard entities into an array of DTOs
   * @returns {Array<KanBoardDto>}
   */
  static arrayToDtoList(boards) {
    return boards.map((board) => this.toDto(board));
  }

  /**
   * Convert a single KanBoard entity to a DTO
   * @returns {KanBoardDto}
   */
  static toDto(board) {
    return new KanBoardDto(
      board.id,
      board.user_uid,
      board.name,
      board.color,
      board.archived,
      board.collaborative,
      board.updated_at,
      board.created_at,
    );
  }

  /**
   * 
   * @param {KanBoardDto} KanBoardDto 
   * @returns {KanBoard}
   */
  static fromDtoToEntity(KanBoardDto){
    return new KanBoard(
      KanBoardDto.getId(),
      KanBoardDto.getUserUid(),
      KanBoardDto.getName(),
      KanBoardDto.getColor(),
      KanBoardDto.getIsArchived(),
      KanBoardDto.getIsCollaborative(),
      KanBoardDto.getUpdatedAt(),
      KanBoardDto.getCreatedAt(),
    );
  }
}
