import { KanBoardDto } from "../../dto/KanBoardDto";

export class ArchiveKanBoardDto {
  #kanBoardDto;
  #archived;

  /**
   *
   * @param {KanBoardDto} kanBoardDto
   * @param {boolean} archived
   */
  constructor(kanBoardDto, archived) {
    this.#kanBoardDto = kanBoardDto;
    this.#archived = archived;
  }

  getKanBoardDto() {
    return this.#kanBoardDto;
  }

  getArchived() {
    return this.#archived;
  }
}
