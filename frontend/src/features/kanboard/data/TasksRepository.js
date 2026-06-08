import { Firestore, limit, orderBy, where } from "firebase/firestore";
import { db } from "../../../database/firebaseConfig";
import { CollectionRepository } from "../../../firebase_entity_manager/data/CollectionRepository";

class TasksRepository extends CollectionRepository {
  /**
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(database) {
    super("tasks", database);
  }

  /**
   * 
   * @param {string} userUid 
   * @param {string} boardId 
   * @param {number} limitCount 
   * @returns 
   */
  async findBoardTasks(userUid, boardId, limitCount) {
    const query = this.createQuery([
      where("user_uid", "==", userUid),
      where("project_id", "==", boardId),
      orderBy("updated_at", "desc"),
      limit(limitCount),
    ]);

    return this.getDocumentsByQuery(query);
  }
}

const tasksRepository = new TasksRepository(db);
export default tasksRepository;
