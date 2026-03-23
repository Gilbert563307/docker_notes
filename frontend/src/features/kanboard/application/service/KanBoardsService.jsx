import { MAX_KAN_BOARDS } from "../../../../config";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import { KanBoard } from "../../domain/KanBoard";
import { KanBoardDto } from "../dto/KanBoardDto";
import { KanBoardMapper } from "../mapper/KanBoardMapper";
import { CollectionManager } from "../../../../firebase_entity_manager/CollectionManager";
import { db } from "../../../../database/firebaseConfig";
import FirebaseInterfaceV2 from "../../../../shared/data/FirebaseInterfaceV2";
import { KanBoardSystem } from "../../domain/KanBoardSystem";
import { ArchiveKanBoardDto } from "./dto/ArchiveKanBoardDto";

const initialBoardDto = new KanBoardDto(null, null, null, null, null, null, null, null, null);
const collectionManager = new CollectionManager("kanboards", db);

export default function KanBoardsService() {
  const { userUid } = FirebaseInterfaceV2();

  
  async function doesUserHaveMaxKanBoards() {
    const query = collectionManager.whereQuery("user_uid", "==", userUid);
    const count = await collectionManager.countDocumentsByQuery([query]);
    new KanBoardSystem.Builder().totalKanBoards(count).build();
  }

  /**
   *
   * @param {{name: string, color: string, imageUrl: string}} payload
   * @returns {Promise<{ created: boolean, notificationDto: NotificationDto }>}
   */
  async function createKanBoard(payload) {
    try {
      //check if the max kanboards already created
      await doesUserHaveMaxKanBoards();

      const kanBoard = new KanBoard(
        "",
        userUid,
        payload.name,
        payload.color,
        false,
        false,
        payload.imageUrl,
        collectionManager.getCurrentServerTimestamp(),
        collectionManager.getCurrentServerTimestamp(),
      );
      const created = await collectionManager.createDocument(kanBoard.toJsonWithoutId());

      return {
        created: created,
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
      kanBoard.update(
        kanBoard.getName(),
        kanBoard.getColor(),
        kanBoard.getIsArchived(),
        kanBoard.getIsCollaborative(),
        kanBoard.getCreatedAt(),
        collectionManager.getCurrentServerTimestamp(),
      );
      await collectionManager.updateDocument(kanBoard.getId(), kanBoard.toJsonWithoutId());

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
      const results = await collectionManager.getAllDocumentsByQuery([
        // @ts-ignore
        collectionManager.whereQuery("user_uid", "==", userUid),
        // @ts-ignore
        collectionManager.limitByQuery(MAX_KAN_BOARDS),
      ]);
      const kanBoards = KanBoardMapper.arrayToDtoList(results);

      return {
        results: kanBoards,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
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
   * @param {ArchiveKanBoardDto} payload -
   * @returns {Promise<{ archived: boolean, notificationDto: NotificationDto }>} -
   * */
  async function archiveKanBoard(payload) {
    try {
      const kanBoard = KanBoardMapper.fromDtoToEntity(payload.getKanBoardDto());
      kanBoard.update(
        kanBoard.getName(),
        kanBoard.getColor(),
        payload.getArchived(),
        kanBoard.getIsCollaborative(),
        kanBoard.getImageUrl(),
        kanBoard.getCreatedAt(),
        collectionManager.getCurrentServerTimestamp(),
      );

      const updated = await collectionManager.updateDocument(kanBoard.getId(), kanBoard.toJsonWithoutId());
      // Return the result of the update operation
      return {
        archived: updated,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
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
   * @param {string} kanBoardId
   * @returns {Promise<{board: KanBoardDto, notificationDto: NotificationDto}>}
   */
  async function readKanBoard(kanBoardId) {
    try {
      const document = await collectionManager.readDocument(kanBoardId);
      return {
        board: KanBoardMapper.toDto(document),
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
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
   * @param {string} kanBoardId
   */
  async function deleteKanBoard(kanBoardId) {
    try {
      const deleted = await collectionManager.deleteDocument(kanBoardId);

      return {
        deleted: deleted,
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
