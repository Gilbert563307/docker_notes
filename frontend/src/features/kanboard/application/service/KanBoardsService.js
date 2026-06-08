import { FirebaseUtil } from "../../../../shared/helpers/FirebaseUtil";
import { KanBoardSystem } from "../../domain/KanBoardSystem";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import { KanBoard } from "../../domain/KanBoard";
import { KanBoardMapper } from "../mapper/KanBoardMapper";
import { KanBoardDto } from "../dto/KanBoardDto";
import { MAX_KAN_BOARDS } from "../../../../config";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import { ArchiveKanBoardDto } from "./dto/ArchiveKanBoardDto";
import kanBoardsRepository from "../../data/KanBoardsRepository";

/**
 * @typedef {import("../../data/KanBoardsRepository").default} KanBoardsRepository
 */
class KanBoardsService {
  #kanBoardsRepository;
  #firebaseUtil;

  /**
   *
   * @param {KanBoardsRepository} kanBoardsRepository
   * @param {FirebaseUtil} firebaseUtil
   */
  constructor(kanBoardsRepository, firebaseUtil) {
    this.#kanBoardsRepository = kanBoardsRepository;
    this.#firebaseUtil = firebaseUtil;
  }

  async doesUserHaveMaxKanBoards() {
    // @ts-ignore
    const count = await this.#kanBoardsRepository.doesUserHaveMaxKanBoards(this.#firebaseUtil.getUserUid());
    new KanBoardSystem.Builder().totalKanBoards(count).build();
  }

  /**
   *
   * @param {{name: string, color: string, imageUrl: string}} payload
   * @returns {Promise<{ created: boolean, notificationDto: NotificationDto }>}
   */
  async createKanBoard(payload) {
    try {
      //check if the max kanboards already created
      await this.doesUserHaveMaxKanBoards();

      const kanBoard = new KanBoard(
        "",
        // @ts-ignore
        this.#firebaseUtil.getUserUid(),
        payload.name,
        payload.color,
        false,
        false,
        payload.imageUrl || "",
        this.#kanBoardsRepository.getCurrentServerTimestamp(),
        this.#kanBoardsRepository.getCurrentServerTimestamp(),
      );
      const created = await this.#kanBoardsRepository.createDocument(kanBoard.toJsonWithoutId());

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
  async updateKanBoard(payload) {
    try {
      const kanBoard = KanBoardMapper.fromDtoToEntity(payload);
      kanBoard.update(
        kanBoard.getName(),
        kanBoard.getColor(),
        kanBoard.getIsArchived(),
        kanBoard.getIsCollaborative(),
        kanBoard.getImageUrl(),
        kanBoard.getCreatedAt(),
        this.#kanBoardsRepository.getCurrentServerTimestamp(),
      );
      await this.#kanBoardsRepository.updateDocument(kanBoard.getId(), kanBoard.toJsonWithoutId());

      return {
        updated: true,
        notificationDto: new NotificationDto("Your kanban has been successfully been updated", ALERT_TYPES.SUCCESS),
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
  async listKanBoards() {
    try {
      const results = await this.#kanBoardsRepository.listKanBoardsByUser(
        this.#firebaseUtil.getUserUid(),
        MAX_KAN_BOARDS,
      );
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
  async archiveKanBoard(payload) {
    try {
      const kanBoard = KanBoardMapper.fromDtoToEntity(payload.getKanBoardDto());
      kanBoard.update(
        kanBoard.getName(),
        kanBoard.getColor(),
        payload.getArchived(),
        kanBoard.getIsCollaborative(),
        kanBoard.getImageUrl(),
        kanBoard.getCreatedAt(),
        this.#kanBoardsRepository.getCurrentServerTimestamp(),
      );

      const updated = await this.#kanBoardsRepository.updateDocument(kanBoard.getId(), kanBoard.toJsonWithoutId());
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
  async readKanBoard(kanBoardId) {
    try {
      const document = await this.#kanBoardsRepository.readDocument(kanBoardId);
      return {
        board: KanBoardMapper.toDto(document),
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        board: this.#getInitKanBoardDto(),
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {string} kanBoardId
   */
  async deleteKanBoard(kanBoardId) {
    try {
      await this.#kanBoardsRepository.deleteDocument(kanBoardId);

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

  #getInitKanBoardDto() {
    return new KanBoardDto(null, null, null, null, null, null, null, null, null);
  }
}

const kanBoardsService = new KanBoardsService(kanBoardsRepository, new FirebaseUtil());
export default kanBoardsService;
