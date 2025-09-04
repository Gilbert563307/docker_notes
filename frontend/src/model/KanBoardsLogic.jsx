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
    doc,
    table,
    db,
    updateDoc,
  } = DataHandler({ table: "kanboards" });

  /**
   *
   * @param {{name: string, color: string}} payload
   * @returns {Promise<{ created: boolean, message: string, type: number }>}
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

  /**
   * 
   * @param {import("../types/types").Board} payload 
   * @returns {Promise<{ updated: boolean, message: string, type: number }>}
   */
  async function updateKanBoard(payload) {
     try {
      //manualy updated the updated_at
      const updatedPayload = { ...payload, updated_at: currentServerTimestamp };

      //get document
      const kanban = doc(db, table, payload.id);

      //update document
      await updateDoc(kanban, updatedPayload);

      return {
        updated: true,
        message: "Your kanban has been succesfully been updated",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[updateKanBoard]: ${error.message}`);
      return {
        updated: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   * 
   * @returns {Promise<{ results: Array<import("../types/types").Board>, message: string, type: number }>}
   */
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

  /**
   * 
   *
   * @param {{id: string, archived: boolean}} payload - 
   * @returns {Promise<{ archived: boolean, message: string, type: number }>} - 
   * */
  async function archiveKanBoard(payload) {
    try {
      const { updated, message, type } = await updateKanBoard(payload);

      // Return the result of the update operation
      return {
        archived: updated,
        message: message,
        type: type,
      };
      
    } catch (error) {
      // Return an error response if the update operation fails
      console.log(`[archiveKanBoard]: ${error.message}`);
      return {
        archived: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
    
  }
  return { listKanBoards, createKanBoard, updateKanBoard, archiveKanBoard };
}
