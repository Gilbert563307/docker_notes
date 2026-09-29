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
   * @param {Object} board
   * @returns {KanBoardDto}
   */
  static toDto(board) {
    return new KanBoardDto.Builder()
      .id(board.id)
      .userUid(board.user_uid)
      .name(board.name)
      .color(board.color)
      .archived(board.archived)
      .collaborative(board.collaborative)
      .imageUrl(board.imageUrl)
      .createdAt(board.updated_at)
      .updatedAt(board.updated_at)
      .build();
  }

  /**
   *
   * @param {KanBoardDto} KanBoardDto
   * @returns {KanBoard}
   */
  static fromDtoToEntity(KanBoardDto) {
    return new KanBoard.Builder()
      .id(KanBoardDto.getId())
      .userUid(KanBoardDto.getUserUid())
      .name(KanBoardDto.getName())
      .color(KanBoardDto.getColor())
      .archived(KanBoardDto.getIsArchived())
      .collaborative(KanBoardDto.getIsCollaborative())
      .imageUrl(KanBoardDto.getImageUrl())
      .createdAt(KanBoardDto.getCreatedAt())
      .updatedAt(KanBoardDto.getUpdatedAt)
      .build();
  }
}
