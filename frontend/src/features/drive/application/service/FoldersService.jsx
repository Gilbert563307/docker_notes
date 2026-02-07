import React from "react";
import { DEFAULT_FOLDERS_ARCHIVE, FOLDERS_ARCHIVED_SESSION_FILTER, MAX_FOLDERS_TO_FETCH } from "../../../../config";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import useHelpers from "../../../../shared/helpers/useHelpers";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import FilesService from "../../../../shared/application/service/FilesService";
import { FoldersMapper } from "../mapper/FoldersMapper";
import { FolderDto } from "../dto/FolderDto";
import { CreateFolderDto } from "../../presentation/dto/CreateFolderDto";
import { Folder } from "../../domain/Folder";
import { ArchiveFolderDto } from "../../presentation/dto/ArchiveFolderDto";
import { CollectionManager } from "../../../../firebase_entity_manager/CollectionManager";
import { db } from "../../../../database/firebaseConfig";
import { GetFoldersQueryClauses } from "../dto/GetFoldersQueryClausesDto";
import FirebaseInterfaceV2 from "../../../../shared/data/FirebaseInterfaceV2";
import { FoldersQueries } from "../../domain/FoldersQueries";
import { GetFoldersDto } from "../dto/GetFoldersDto";

const initialFolderDto = new FolderDto(null, null, null, null, null, null, null);

const collectionManager = new CollectionManager("folders", db);
export default function FoldersService() {
  const { userUid } = FirebaseInterfaceV2();
  const { listFilesByFolderId } = FilesService();
  const { getSessionFilter, getCurrentPageNumber, getTotalPages, getTheCurrentItemsPerPage } = useHelpers();

  /**
   *
   * @param {GetFoldersQueryClauses} payload
   */
  function getFoldersQueryClauses(payload) {
    // Get the session archived filter
    const foldersArchived = getSessionFilter(FOLDERS_ARCHIVED_SESSION_FILTER) || DEFAULT_FOLDERS_ARCHIVE;

    const baseQueryItems = [
      collectionManager.whereQuery("user_uid", "==", userUid),
      collectionManager.whereQuery("archived", "==", foldersArchived),
      collectionManager.orderByQuery("created_at", "desc"),
    ];

    const foldersQuerys = new FoldersQueries(baseQueryItems);

    if (payload.getSearchTerm() && payload.getSearchTerm() != "") {
      const searchTerm = payload.getSearchTerm()?.trim();
      foldersQuerys.addQueryItem(collectionManager.getSearchQueryBeforeFieldName("name", searchTerm));
      foldersQuerys.addQueryItem(collectionManager.getSearchQueryAfterFieldName("name", searchTerm));
    }

    return foldersQuerys.getQueryItems();
  }

  /**
   *
   * @param {GetFoldersDto} payload
   * @returns {Promise<Array<Object>>} The Firestore query to fetch tasks for the specified page.
   *
   */
  async function getFoldersByQuery(payload) {
    const queryItems = getFoldersQueryClauses(new GetFoldersQueryClauses(payload.getSearchTerm()));
    return await collectionManager.getPaginatedDocumentsByQueryItems(
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
  async function getTotalFoldersInDatabaseByUserAndFilters(payload) {
    const queryItems = getFoldersQueryClauses(new GetFoldersQueryClauses(payload.getSearchTerm()));
    return await collectionManager.countDocumentsByQuery(queryItems);
  }

  /**
   *
   * @param {string} searchTearm
   * @returns {Promise<listFoldersResponse>}
   */
  async function listFoldersBySearchTerm(searchTearm) {
    return await _listFolders(new GetFoldersDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), searchTearm));
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
  async function _listFolders(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const results = await getFoldersByQuery(payload);

      //get total records for pagination
      const totalRecords = await getTotalFoldersInDatabaseByUserAndFilters(payload);

      //get total pages for pagination
      const totalPages = getTotalPages(totalRecords);

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

  /**
   *
   * @returns {Promise<{folders: Array<FolderDto>, notificationDto: NotificationDto}>}
   */
  async function getFolders() {
    try {
      const foldersQueries = [
        collectionManager.whereQuery("user_uid", "==", userUid),
        collectionManager.orderByQuery("created_at", "desc"),
        collectionManager.limitByQuery(MAX_FOLDERS_TO_FETCH),
      ];
      const results = await collectionManager.getAllDocumentsByQuery(foldersQueries);
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
  async function archiveFolder(payload) {
    try {
      const { updated, notificationDto } = await updateFolder(payload);

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
  async function createFolder(payload) {
    try {
      const folder = new Folder(
        "",
        userUid,
        payload.getName(),
        payload.getColor(),
        false,
        collectionManager.getCurrentServerTimestamp(),
        collectionManager.getCurrentServerTimestamp(),
      );

      await collectionManager.createDocument(folder.toJsonWithoutId());
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
  async function readFolder(folderId) {
    try {
      const document = await collectionManager.readDocument(folderId);
      const folderDto = FoldersMapper.toDto(document);
      return {
        folder: folderDto,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // Return an error response if the fetch operation fails
      return {
        folder: initialFolderDto,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {FolderDto} payload
   * @returns {Promise<{ updated: boolean, notificationDto: NotificationDto }>}
   */
  async function updateFolder(payload) {
    try {
      const folder = FoldersMapper.fromDtoToEntity(payload);

      folder.update(
        folder.getName(),
        folder.getColor(),
        folder.getIsArchived(),
        collectionManager.getCurrentServerTimestamp(),
      );

      await collectionManager.updateDocument(folder.getId(), folder.toJsonWithoutId());
      return {
        updated: true,
        notificationDto: new NotificationDto("Your folder has been succesfully been updated", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      console.log(`[updateFolder]: ${error.message}`);
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
  async function deleteFolder(folderId) {
    try {
      await collectionManager.deleteDocument(folderId);

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
  async function getFilesByFolderId(folderId) {
    return listFilesByFolderId(folderId);
  }

  async function listFolders() {
    return await _listFolders(new GetFoldersDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), ""));
  }

  return {
    getFolders,
    listFolders,
    archiveFolder,
    createFolder,
    readFolder,
    updateFolder,
    deleteFolder,
    getFilesByFolderId,
    listFoldersBySearchTerm,
  };
}
