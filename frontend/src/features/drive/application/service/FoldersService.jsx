import React from "react";
import { DEFAULT_FOLDERS_ARCHIVE, FOLDERS_ARCHIVED_SESSION_FILTER, MAX_FOLDERS_TO_FETCH } from "../../../../config";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import useHelpers from "../../../../shared/helpers/useHelpers";
import { Query } from "firebase/firestore";
import FirebaseInterface from "../../../../shared/data/FirebaseInterface";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import FilesService from "../../../../shared/application/service/FilesService";
import { FoldersMapper } from "../mapper/FoldersMapper";
import { FolderDto } from "../dto/FolderDto";
import { CreateFolderDto } from "../../presentation/dto/CreateFolderDto";
import { Folder } from "../../domain/Folder";
import { ArchiveFolderDto } from "../../presentation/dto/ArchiveFolderDto";

const initialFolderDto = new FolderDto(null, null, null, null, null, null, null);

export default function FoldersService() {
  const {
    collectionRef,
    userUid,
    query,
    where,
    getDocs,
    limit,
    orderBy,
    convertQuerySnapShotDocs,
    getTheCurrentItemsPerPage,
    getSearchQueryByFieldName,
    fetchResultsOnPageOne,
    fetchPaginatedResults,
    getTotalPages,
    getCountFromServer,
    currentServerTimestamp,
    updateDoc,
    doc,
    db,
    table,
    addDoc,
    getDocument,
    deleteDoc,
  } = FirebaseInterface({ table: "folders" });

  const { listFilesByFolderId } = FilesService();
  const { getSessionFilter, getCurrentPageNumber } = useHelpers();

  /**
   * @param {{searchTearm?: string}} payload
   * @returns {{queryItems: Array<Query> | Array, notificationDto: NotificationDto}}
   */
  function getFoldersQueryClauses(payload = {}) {
    try {
      // Get the session archived filter
      const foldersArchived = getSessionFilter(FOLDERS_ARCHIVED_SESSION_FILTER) || DEFAULT_FOLDERS_ARCHIVE;

      let queryItems = [
        where("user_uid", "==", userUid),
        where("archived", "==", foldersArchived),
        orderBy("created_at", "desc"),
      ];

      if (payload.searchTearm && payload.searchTearm != "") {
        const { searchTearm } = payload;
        queryItems = [...queryItems, ...getSearchQueryByFieldName("name", searchTearm)];
      }

      return {
        queryItems: queryItems,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      console.log(`[getFoldersQueryClauses]: ${error.message}`);
      return {
        queryItems: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {{currentPage: number, itemsPerPage?: number, searchTearm?: string }} payload
   * @returns {Promise<{resultsQuery: Query | null, notificationDto: NotificationDto}>} The Firestore query to fetch tasks for the specified page.
   *
   */
  async function getFoldersQuery(payload) {
    try {
      // Destructure the vars
      const { currentPage } = payload;

      // Get the number of items to be displayed per page
      const itemsPerPage = getTheCurrentItemsPerPage();
      const { queryItems } = getFoldersQueryClauses(payload);

      // If the current page is the first page, create a query limited by the items per page
      if (currentPage === 1) {
        const { resultsQuery, message, type } = fetchResultsOnPageOne(queryItems, itemsPerPage);
        return {
          resultsQuery: resultsQuery,
          notificationDto: new NotificationDto(message, type),
        };
      }

      const { resultsQuery, message, type } = await fetchPaginatedResults(
        currentPage,
        payload,
        itemsPerPage,
        queryItems,
      );
      return {
        resultsQuery: resultsQuery,
        notificationDto: new NotificationDto(message, type),
      };
    } catch (error) {
      return {
        resultsQuery: null,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  async function getTotalFoldersInDatabaseByUserAndFilters() {
    try {
      const { queryItems } = getFoldersQueryClauses();

      // Get total records from server according to where clause set by the user
      const totalQuery = query(collectionRef, ...queryItems);
      const totalRecordsSnapShot = await getCountFromServer(totalQuery);
      const totalRecords = totalRecordsSnapShot.data().count;

      return totalRecords;
    } catch (error) {
      return 0;
    }
  }

  async function listFoldersBySearchTerm(searchTearm) {
    //get currentPageNumber
    const currentPage = getCurrentPageNumber();
    return await _listFolders({ currentPage: currentPage, searchTearm: searchTearm });
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
   * @param {{ currentPage: number, itemsPerPage?: number, searchTearm?: string}} payload
   * @returns {Promise<listFoldersResponse>}
   */
  async function _listFolders(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const { resultsQuery, notificationDto } = await getFoldersQuery(payload);

      //check if query is null
      if (!resultsQuery) {
        return {
          results: { folders: [], total: 0, pages: 0 },
          notificationDto,
        };
      }

      // Execute the query to get the tasks.
      const querySnapshot = await getDocs(resultsQuery);

      const { results } = convertQuerySnapShotDocs(querySnapshot);

      //get total records for pagination
      const totalRecords = await getTotalFoldersInDatabaseByUserAndFilters();
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
      const foldersQuery = query(
        collectionRef,
        where("user_uid", "==", userUid),
        orderBy("created_at", "desc"),
        limit(MAX_FOLDERS_TO_FETCH),
      );

      const querySnapshot = await getDocs(foldersQuery);

      const response = convertQuerySnapShotDocs(querySnapshot);
      const foldersDtos = FoldersMapper.arrayToDtoList(response.results);
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
        currentServerTimestamp,
        currentServerTimestamp,
      );
    
      // Attempt to add the document to the collection
      const created = await addDoc(collectionRef, folder.toJsonWithoutId());

      // Return success message if task creation was successful
      return {
        created: Boolean(created),
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
      const { document, message, type } = await getDocument(folderId);
      const folderDto = FoldersMapper.toDto(document);
      return {
        folder: folderDto,
        notificationDto: new NotificationDto(message, type),
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
      
      folder.update(folder.getName(), folder.getColor(), folder.getIsArchived(), currentServerTimestamp);
      //get document
      const document = doc(db, table, folder.getId());

      //update document
      await updateDoc(document, folder.toJsonWithoutId());

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
      const ref = doc(db, table, folderId);
      const deleted = await deleteDoc(ref);
      return {
        deleted: Boolean(deleted),
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
    return _listFolders({ currentPage: getCurrentPageNumber() });
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
