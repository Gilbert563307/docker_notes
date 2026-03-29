import { limit, orderBy, where } from "firebase/firestore";
import { DEFAULT_FOLDERS_ARCHIVE, FOLDERS_ARCHIVED_SESSION_FILTER, MAX_FOLDERS_TO_FETCH } from "../../../../config";
import filesService from "./FilesService.js";
import { FirebaseUtil } from "../../../../shared/helpers/FirebaseUtil.js";
import { HelpersV2 } from "../../../../shared/helpers/HelpersV2.js";
import foldersRepository from "../../data/FoldersRepository.js";
import { GetFoldersQueryClauses } from "../../domain/dto/GetFoldersQueryClausesDto.js";
import { FoldersQueries } from "../../domain/FoldersQueries.js";
import { GetFoldersDto } from "../../domain/dto/GetFoldersDto.js";
import { FolderDto } from "../../domain/dto/FolderDto.js";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto.js";
import { FoldersMapper } from "../mapper/FoldersMapper.js";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert.jsx";
import { ArchiveFolderDto } from "../../presentation/dto/ArchiveFolderDto.js";
import { CreateFolderDto } from "../../presentation/dto/CreateFolderDto.js";
import { Folder } from "../../domain/Folder.js";

class FoldersService {
  #foldersRepository;
  #filesService;
  #firebaseUtil;
  #helpers;

  /**
   *
   * @param {import("../../data/FoldersRepository.js").default} foldersRepository
   * @param {import("./FilesService.js").default} filesService
   * @param {FirebaseUtil} firebaseUtil
   * @param {HelpersV2} helpers
   */
  constructor(foldersRepository, filesService, firebaseUtil, helpers) {
    this.#foldersRepository = foldersRepository;
    this.#filesService = filesService;
    this.#firebaseUtil = firebaseUtil;
    this.#helpers = helpers;
  }

  /**
   *
   * @param {GetFoldersQueryClauses} payload
   */
  getFoldersQueryClauses(payload) {
    // Get the session archived filter
    const foldersArchived = this.#helpers.getSessionFilter(FOLDERS_ARCHIVED_SESSION_FILTER) || DEFAULT_FOLDERS_ARCHIVE;

    const baseQueryItems = [
      where("user_uid", "==", this.#firebaseUtil.getUserUid()),
      where("archived", "==", foldersArchived),
      orderBy("created_at", "desc"),
    ];

    const foldersQuerys = new FoldersQueries(baseQueryItems);

    if (payload.getSearchTerm() && payload.getSearchTerm() != "") {
      const searchTerm = payload.getSearchTerm()?.trim();
      foldersQuerys.addQueryItem(this.#foldersRepository.getSearchQueryBeforeFieldName("name", searchTerm));
      foldersQuerys.addQueryItem(this.#foldersRepository.getSearchQueryAfterFieldName("name", searchTerm));
    }

    return foldersQuerys.getQueryItems();
  }

  /**
   *
   * @param {GetFoldersDto} payload
   * @returns {Promise<Array<Object>>} The Firestore query to fetch tasks for the specified page.
   *
   */
  async getFoldersByQuery(payload) {
    const queryItems = this.getFoldersQueryClauses(new GetFoldersQueryClauses(payload.getSearchTerm()));
    return await this.#foldersRepository.getPaginatedDocumentsByQueryItems(
      queryItems,
      payload.getCurrentPage(),
      payload.getItemsPerPage(),
    );
  }

  /**
   *
   * @param {GetFoldersDto} payload
   * @returns {Promise<number>}
   */
  async getTotalFoldersInDatabaseByUserAndFilters(payload) {
    const queryItems = this.getFoldersQueryClauses(new GetFoldersQueryClauses(payload.getSearchTerm()));
    return await this.#foldersRepository.countDocumentsByQuery(queryItems);
  }

  /**
   *
   * @param {string} searchTearm
   * @returns {Promise<listFoldersResponse>}
   */
  async listFoldersBySearchTerm(searchTearm) {
    return await this.#listFolders(
      new GetFoldersDto(this.#helpers.getCurrentPageNumber(), this.#helpers.getTheCurrentItemsPerPage(), searchTearm),
    );
  }

  /**
   *
   * @returns {Promise<{folders: Array<FolderDto>, notificationDto: NotificationDto}>}
   */
  async getFolders() {
    try {
      const foldersQueries = [
        where("user_uid", "==", this.#firebaseUtil.getUserUid()),
        orderBy("created_at", "desc"),
        limit(MAX_FOLDERS_TO_FETCH),
      ];
      const results = await this.#foldersRepository.getAllDocumentsByQuery(foldersQueries);
      const foldersDtos = FoldersMapper.arrayToDtoList(results);
      return {
        folders: foldersDtos,
        notificationDto: new NotificationDto(response.message, ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        folders: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {ArchiveFolderDto} payload -
   * @returns {Promise<{ archived: boolean, notificationDto: NotificationDto }>} - A promise that resolves to an object indicating the result of the archiving process.
   */
  async archiveFolder(payload) {
    try {
      const { updated, notificationDto } = await this.updateFolder(payload);

      // Return the result of the update operation
      return {
        archived: updated,
        notificationDto,
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
   * @param {CreateFolderDto} payload
   * @returns {Promise<{created: boolean, notificationDto: NotificationDto}>} -
   */
  async createFolder(payload) {
    try {
      const folder = new Folder(
        "",
        this.#firebaseUtil.getUserUid(),
        payload.getName(),
        payload.getColor(),
        false,
        this.#foldersRepository.getCurrentServerTimestamp(),
        this.#foldersRepository.getCurrentServerTimestamp(),
      );

      await this.#foldersRepository.createDocument(folder.toJsonWithoutId());
      // Return success message if task creation was successful
      return {
        created: true,
        notificationDto: new NotificationDto("Your folder has been created", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // Return error message in case of failure
      return {
        created: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   * Fetches a task from the database by its ID.
   * @param {string} folderId
   * @returns {Promise<{folder: FolderDto, notificationDto: NotificationDto}>}
   */
  async readFolder(folderId) {
    try {
      const document = await this.#foldersRepository.readDocument(folderId);
      const folderDto = FoldersMapper.toDto(document);
      return {
        folder: folderDto,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // Return an error response if the fetch operation fails
      return {
        folder: new FolderDto(null, null, null, null, null, null, null),
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {FolderDto} payload
   * @returns {Promise<{ updated: boolean, notificationDto: NotificationDto }>}
   */
  async updateFolder(payload) {
    try {
      const folder = FoldersMapper.fromDtoToEntity(payload);

      folder.update(
        folder.getName(),
        folder.getColor(),
        folder.getIsArchived(),
        this.#foldersRepository.getCurrentServerTimestamp(),
      );

      await this.#foldersRepository.updateDocument(folder.getId(), folder.toJsonWithoutId());
      return {
        updated: true,
        notificationDto: new NotificationDto("Your folder has been succesfully been updated", ALERT_TYPES.SUCCESS),
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
   * @param {string} folderId
   * @returns {Promise<{ deleted: boolean, notificationDto: NotificationDto }>}
   */
  async deleteFolder(folderId) {
    try {
      await this.#foldersRepository.deleteDocument(folderId);

      return {
        deleted: true,
        notificationDto: new NotificationDto("Your folder has been deleted", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        deleted: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {string} folderId
   */
  async getFilesByFolderId(folderId) {
    return this.#filesService.listFilesByFolderId(folderId);
  }

  async listFolders() {
    return await this.#listFolders(
      new GetFoldersDto(this.#helpers.getCurrentPageNumber(), this.#helpers.getTheCurrentItemsPerPage(), ""),
    );
  }

  /**
   * @typedef {Object} listFoldersResponse
   * @property {Object} results
   * @property {Array<FolderDto>} results.folders
   * @property {number} results.pages
   * @property {number} results.total
   * @property {NotificationDto} notificationDto
   */

  /**
   * @param {GetFoldersDto} payload
   * @returns {Promise<listFoldersResponse>}
   */
  async #listFolders(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const results = await this.getFoldersByQuery(payload);

      //get total records for pagination
      const totalRecords = await this.getTotalFoldersInDatabaseByUserAndFilters(payload);

      //get total pages for pagination
      const totalPages = this.#helpers.getTotalPages(totalRecords);

      //return results
      const foldersDtos = FoldersMapper.arrayToDtoList(results);
      return {
        results: { folders: foldersDtos, total: totalRecords, pages: totalPages },
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        results: { folders: [], total: 0, pages: 0 },
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }
}

const foldersService = new FoldersService(foldersRepository, filesService, new FirebaseUtil(), new HelpersV2());
export default foldersService;
