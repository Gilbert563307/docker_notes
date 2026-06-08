import { KanBoard } from "./KanBoard";
import { Task } from "./Task";

const MAX_KAN_BOARDS = 10;

// Use a Symbol as this will always be unique.
// If you don't have Symbol in your runtime,
// use a random string that nobody can reliably guess,
// such as the current time plus some other random values.
const PRIVATE_CONSTRUCTOR_KEY = Symbol();

export class KanBoardSystem {
  #kanBoard;
  #tasks;
  #totalKanBoards;

  /**
   *
   * @param {KanBoard} kanBoard
   * @param {Array<Task>} tasks
   * @param {number} totalKanBoards
   * @param {Symbol} constructorKey
   */
  constructor(kanBoard, tasks, totalKanBoards, constructorKey) {
    if (constructorKey !== PRIVATE_CONSTRUCTOR_KEY) {
      throw new Error("You must use the PrivateConstructorClass.create() to construct an instance.");
    }

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

  static Builder = class {
    #kanBoard;
    #tasks;
    #totalKanBoards;

   /**
    * 
    * @param {KanBoard} kanBoard 
    */
    kanBoard(kanBoard) {
      this.#kanBoard = kanBoard;
      return this;
    }

    /**
     * 
     * @param {Array<Task} tasks 
     */
    tasks(tasks) {
      this.#tasks = tasks;
      return this;
    }

    /**
     * 
     * @param {number} totalKanBoards 
     */
    totalKanBoards(totalKanBoards) {
      this.#totalKanBoards = totalKanBoards;
      return this;
    }

    build() {
      return new KanBoardSystem(this.#kanBoard, this.#tasks, this.#totalKanBoards, PRIVATE_CONSTRUCTOR_KEY);
    }
  };

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
