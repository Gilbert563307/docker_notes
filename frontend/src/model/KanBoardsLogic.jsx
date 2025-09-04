import DataHandler from "./DataHandler";
import { MAX_KAN_BOARDS } from "../config";
import { ALERT_TYPES } from "../view/components/bs5/BS5Alert";

export default function KanBoardsLogic() {
  const {
    collectionRef,
    userUid,
    query,
    limit,
    where,
    orderBy,
    getDocs,
    currentServerTimestamp,
    convertQuerySnapShotDocs,
    addDoc,
  } = DataHandler({ table: "kanboards" });

  /**
   *
   * @param {{name: string, color: string}} payload
   */
  async function createKanBoard(payload) {
    try {
      const defaultValues = {
        name: payload.name,
        user_uid: userUid,
        archived: false,
        color: payload.color,
        created_at: currentServerTimestamp,
        updated_at: currentServerTimestamp,
      };

      const created = addDoc(collectionRef, defaultValues);;

      return {
        created: Boolean(created),
        message: "Your kan board has been created",
        type: ALERT_TYPES.SUCCESS,
      };
      
    } catch (error) {
      return {
        created: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  async function listKanBoards() {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const kanBoardsQuery = query(
        collectionRef,
        where("user_uid", "==", userUid),
        // where("archived", "==", tasksArchived),
        orderBy("updated_at", "desc"),
        limit(MAX_KAN_BOARDS)
      );

      // Execute the query to get the tasks.
      const querySnapshot = await getDocs(kanBoardsQuery);

      const { results, message, type } =
        convertQuerySnapShotDocs(querySnapshot);

      return {
        results: results,
        message: message,
        type: type,
      };
    } catch (error) {
      console.log(`[listKanBoards]: ${error.message}`);
      return {
        results: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }
  return { listKanBoards, createKanBoard };
}
