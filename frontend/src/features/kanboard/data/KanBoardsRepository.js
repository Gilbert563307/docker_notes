import { Firestore, limit, where } from "firebase/firestore";
import { CollectionRepository } from "../../../firebase_entity_manager/data/CollectionRepository";
import { db } from "../../../database/firebaseConfig";

class KanBoardsRepository extends CollectionRepository {
  /**
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(database) {
    super("kanboards", database);
  }

  /**
   *
   * @param {string} userId
   */
  async doesUserHaveMaxKanBoards(userId) {
    const query = where("user_uid", "==", userId);
    return await this.countDocumentsByQuery([query]);
  }

  /**
   *
   * @param {string} userId
   * @param {number} maxItems
   * @returns
   */
  async listKanBoardsByUser(userId, maxItems) {
    return await this.getAllDocumentsByQuery([where("user_uid", "==", userId), limit(maxItems)]);
  }

  /**
   *
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getKanBoardByProjectId(projectId) {
    const kanBaord = await this.findOrFail(projectId);
    if (kanBaord === null) return { name: "" };
    return kanBaord;
  }
}

const kanBoardsRepository = new KanBoardsRepository(db);
export default kanBoardsRepository;
