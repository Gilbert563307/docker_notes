import { MAX_KAN_BOARDS } from "../../../config";
import { ALERT_TYPES } from "../../../shared/components/bs5/BS5Alert";
import FirebaseInterface from "../../../shared/data/FirebaseInterface";

export default function KanBoardsService() {
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
    getCountFromServer,
    getDocument,
  } = FirebaseInterface({ table: "kanboards" });

  async function doesUserHaveMaxKanBoards() {
    try {
      const q = query(collectionRef, where("user_uid", "==", userUid));
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;

      const maximumReached = count >= MAX_KAN_BOARDS;
      return {
        max: maximumReached,
        message: maximumReached
          ? `You have reached the maximum number of Kanboards (${MAX_KAN_BOARDS}).`
          : `You have created ${count} out of ${MAX_KAN_BOARDS} Kanboards.`,
        type: maximumReached ? ALERT_TYPES.DANGER : ALERT_TYPES.INFO,
      };
    } catch (error) {
      return {
        max: true,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {{name: string, color: string}} payload
   * @returns {Promise<{ created: boolean, message: string, type: number }>}
   */
  async function createKanBoard(payload) {
    try {
      //check if the max kanboards already created
      const maxKanBoardsCreated = await doesUserHaveMaxKanBoards();
      if (maxKanBoardsCreated.max) {
        return {
          created: false,
          message: maxKanBoardsCreated.message,
          type: ALERT_TYPES.DANGER,
        };
      }

      const defaultValues = {
        name: payload.name,
        user_uid: userUid,
        archived: false,
        color: payload.color,
        collaborative: false,
        created_at: currentServerTimestamp,
        updated_at: currentServerTimestamp,
      };

      const created = addDoc(collectionRef, defaultValues);
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
   * @param {import("../../../types/types").Board} payload
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
   * @returns {Promise<{ results: Array<import("../../../types/types").Board>, message: string, type: number }>}
   */
  async function listKanBoards() {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const kanBoardsQuery = query(
        collectionRef,
        where("user_uid", "==", userUid),
        // where("archived", "==", tasksArchived),
        limit(MAX_KAN_BOARDS),
      );

      // Execute the query to get the tasks.
      const querySnapshot = await getDocs(kanBoardsQuery);

      const { results, message, type } = convertQuerySnapShotDocs(querySnapshot);

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

  /**
   *
   * @param {string} id
   * @returns {Promise<{board: import("../../../types/types").Board, message: string, type: number}>}
   */
  async function readKanBoard(id) {
    try {
      const { document, message, type } = await getDocument(id);
      return {
        board: document,
        message: message,
        type: type,
      };
    } catch (error) {
      return {
        board: {},
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }
  return { listKanBoards, createKanBoard, updateKanBoard, archiveKanBoard, readKanBoard };
}
