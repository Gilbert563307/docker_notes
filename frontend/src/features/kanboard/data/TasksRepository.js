import { Firestore } from "firebase/firestore";
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
      this.whereQuery("user_uid", "==", userUid),
      this.whereQuery("project_id", "==", boardId),
      this.orderByQuery("updated_at", "desc"),
      this.limitByQuery(limitCount),
    ]);

    return this.getDocumentsByQuery(query);
  }
}

const tasksRepository = new TasksRepository(db);
export default tasksRepository;
