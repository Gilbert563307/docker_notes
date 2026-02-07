import { KanBoard } from "./KanBoard";
import { Task } from "./Task";

const MAX_KAN_BOARDS = 10;
export class KanBoardSystem {
  #kanBoard;
  #tasks;
  #totalKanBoards;

  /**
   *
   * @param {KanBoard} kanBoard
   * @param {Array<Task>} tasks
   * @param {number} totalKanBoards
   */
  constructor(kanBoard, tasks, totalKanBoards) {
    this.#validate({ totalKanBoards });
    this.#kanBoard = kanBoard;
    this.#tasks = tasks;
    this.#totalKanBoards = totalKanBoards;
  }

  getKanBoard() {
    return this.#kanBoard;
  }

  getTasks() {
    return this.#tasks;
  }

  getTotalKanBoards() {
    return this.#totalKanBoards;
  }

  /**
   *
   * @param {Object} data
   */
  #validate(data) {
    const { totalKanBoards } = data;
    if (totalKanBoards === MAX_KAN_BOARDS) {
      const maximumReached = totalKanBoards >= MAX_KAN_BOARDS;
      const message = maximumReached
        ? `You have reached the maximum number of Kanboards (${MAX_KAN_BOARDS}).`
        : `You have created ${totalKanBoards} out of ${MAX_KAN_BOARDS} Kanboards.`;
      throw new Error(message);
    }
  }
}
