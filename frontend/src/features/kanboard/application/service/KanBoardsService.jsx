import { MAX_KAN_BOARDS } from "../../../../config";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import FirebaseInterface from "../../../../shared/data/FirebaseInterface";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import { KanBoard } from "../../domain/KanBoard";
import { KanBoardDto } from "../dto/KanBoardDto";
import { KanBoardMapper } from "../mapper/KanBoardMapper";

const initialBoardDto = new KanBoardDto(null, null, null, null, null, null, null, null);

export default function KanBoardsService() {
  const {
    collectionRef,
    userUid,
    query,
    limit,
    where,
    // orderBy,
    getDocs,
    currentServerTimestamp,
    convertQuerySnapShotDocs,
    addDoc,
    doc,
    table,
    db,
    deleteDoc,
    updateDoc,
    getCountFromServer,
    getDocument,
  } = FirebaseInterface({ table: "kanboards" });

  /**
   *
   * @returns {Promise<{max: boolean, notificationDto: NotificationDto}>}
   */
  async function doesUserHaveMaxKanBoards() {
    try {
      const q = query(collectionRef, where("user_uid", "==", userUid));
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;

      const maximumReached = count >= MAX_KAN_BOARDS;
      const message = maximumReached
        ? `You have reached the maximum number of Kanboards (${MAX_KAN_BOARDS}).`
        : `You have created ${count} out of ${MAX_KAN_BOARDS} Kanboards.`;
      return {
        max: maximumReached,
        notificationDto: new NotificationDto(message, maximumReached ? ALERT_TYPES.DANGER : ALERT_TYPES.INFO),
      };
    } catch (error) {
      return {
        max: true,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {{name: string, color: string}} payload
   * @returns {Promise<{ created: boolean, notificationDto: NotificationDto }>}
   */
  async function createKanBoard(payload) {
    try {
      //check if the max kanboards already created
      const maxKanBoardsCreated = await doesUserHaveMaxKanBoards();
      if (maxKanBoardsCreated.max) {
        return {
          created: false,
          notificationDto: maxKanBoardsCreated.notificationDto,
        };
      }

      const kanBoard = new KanBoard(
        "",
        userUid,
        payload.name,
        payload.color,
        false,
        false,
        currentServerTimestamp,
        currentServerTimestamp,
      );

      const created = addDoc(collectionRef, kanBoard.toJsonWithoutId());
      return {
        created: Boolean(created),
        notificationDto: new NotificationDto("Your kan board has been created", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        created: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {KanBoardDto} payload
   * @returns {Promise<{ updated: boolean, notificationDto: NotificationDto }>}
   */
  async function updateKanBoard(payload) {
    try {
      const kanBoard = KanBoardMapper.fromDtoToEntity(payload);
      kanBoard.update({ ...payload.toJson(), updated_at: currentServerTimestamp });

      //get document
      const kanban = doc(db, table, payload.getId());

      //update document
      await updateDoc(kanban, kanBoard.toJson());
      return {
        updated: true,
        notificationDto: new NotificationDto("Your kanban has been succesfully been updated", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        updated: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @returns {Promise<{ results: Array<KanBoardDto>, notificationDto: NotificationDto }>}
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
      const kanBoards = KanBoardMapper.arrayToDtoList(results);

      return {
        results: kanBoards,
        notificationDto: new NotificationDto(message, type),
      };
    } catch (error) {
      return {
        results: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   *
   * @param {{id: string, archived: boolean}} payload -
   * @returns {Promise<{ archived: boolean, notificationDto: NotificationDto }>} -
   * */
  async function archiveKanBoard(payload) {
    try {
      //TODO FIX PAYLOAD
      const { updated, notificationDto } = await updateKanBoard(payload);

      // Return the result of the update operation
      return {
        archived: updated,
        notificationDto: notificationDto,
      };
    } catch (error) {
      // Return an error response if the update operation fails
      return {
        archived: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<{board: KanBoardDto, notificationDto: NotificationDto}>}
   */
  async function readKanBoard(id) {
    try {
      const { document, message, type } = await getDocument(id);
      return {
        board: KanBoardMapper.toDto(document),
        notificationDto: new NotificationDto(message, type),
      };
    } catch (error) {
      return {
        board: initialBoardDto,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {number} kanBoardId
   */
  async function deleteKanBoard(kanBoardId) {
    try {
      const kanBoardRef = doc(db, table, kanBoardId);
      deleteDoc(kanBoardRef);
      return {
        deleted: true,
        notificationDto: new NotificationDto("Your kanboard has been deleted", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        deleted: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }
  return { listKanBoards, createKanBoard, updateKanBoard, archiveKanBoard, readKanBoard, deleteKanBoard };
}
