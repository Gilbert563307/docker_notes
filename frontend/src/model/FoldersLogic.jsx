import React from "react";
import DataHandler from "./DataHandler";
import {
  DEFAULT_FOLDERS_ARCHIVE,
  FOLDERS_ARCHIVED_SESSION_FILTER,
  MAX_FOLDERS_TO_FETCH,
} from "../config";
import { ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import useHelpers from "../helpers/useHelpers";
import { Query } from "firebase/firestore";

export default function FoldersLogic() {
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
  } = DataHandler({ table: "folders" });

  const { getSessionFilter } = useHelpers();

  /**
   * @param {{searchTearm?: string}} payload
   * @returns {{queryItems: Array<Query> | Array, message: string, type: number}}
   */
  function getFoldersQueryClauses(payload = {}) {
    try {
      // Get the session archived filter
      const foldersArchived =
        getSessionFilter(FOLDERS_ARCHIVED_SESSION_FILTER) ||
        DEFAULT_FOLDERS_ARCHIVE;

      let queryItems = [
        where("user_uid", "==", userUid),
        where("archived", "==", foldersArchived),
        orderBy("created_at", "desc"),
      ];

      if (payload.searchTearm && payload.searchTearm != "") {
        const { searchTearm } = payload;
        queryItems = [
          ...queryItems,
          ...getSearchQueryByFieldName("name", searchTearm),
        ];
      }

      return {
        queryItems: queryItems,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[getFoldersQueryClauses]: ${error.message}`);
      return {
        queryItems: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {{currentPage: number, itemsPerPage?: number, searchTearm?: string }} payload
   * @returns {Promise<{resultsQuery: Query | null, message: string, type: number}>} The Firestore query to fetch tasks for the specified page.
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
        return fetchResultsOnPageOne(queryItems, itemsPerPage);
      }

      return fetchPaginatedResults(
        currentPage,
        payload,
        itemsPerPage,
        queryItems
      );
    } catch (error) {
      return {
        resultsQuery: null,
        message: error.message,
        type: ALERT_TYPES.DANGER,
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
      console.log(
        `[getTotalFoldersInDatabaseByUserAndFilters]: ${error.message}`
      );
      return 0;
    }
  }

  /**
   * @typedef {Object} listFoldersResponse
   * @property {Object} results
   * @property {import("../types/types").DriveFiles} results.folders
   * @property {number} results.total
   * @property {number} results.pages
   * @property {number} type
   * @property {string} message
   */

  /**
   * @param {{ currentPage: number, itemsPerPage?: number, searchTearm?: string}} payload
   * @returns {Promise<listFoldersResponse>}
   */
  async function listFolders(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const { resultsQuery, message, type } = await getFoldersQuery(payload);

      //check if query is null
      if (!resultsQuery) {
        return {
          results: { folders: [], total: 0, pages: 0 },
          message: message,
          type: type,
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
      return {
        results: { folders: results, total: totalRecords, pages: totalPages },
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[listFolders]: ${error.message}`);
      return {
        results: { folders: [], total: 0, pages: 0 },
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @returns {Promise<{folders: any, message: string, type: number}>}
   */
  async function getFolders() {
    try {
      const foldersQuery = query(
        collectionRef,
        where("user_uid", "==", userUid),
        orderBy("created_at", "desc"),
        limit(MAX_FOLDERS_TO_FETCH)
      );

      const querySnapshot = await getDocs(foldersQuery);

      const response = convertQuerySnapShotDocs(querySnapshot);
      return {
        folders: response.results,
        message: response.message,
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        folders: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {{id: string, archived: boolean}} payload -
   * @returns {Promise<{ archived: boolean, message: string, type: number }>} - A promise that resolves to an object indicating the result of the archiving process.
   */
  async function archiveFolder(payload) {
    try {
      const { updated, message, type } = await updateFolder(payload);

      // Return the result of the update operation
      return {
        archived: updated,
        message: message,
        type: type,
      };
    } catch (error) {
      // Return an error response if the update operation fails
      console.log(`[archiveFolder]: ${error.message}`);
      return {
        archived: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {{name: string, color: string}} payload
   * @returns {Promise<{created: boolean, message: string, type: number}>} -
   */
  async function createFolder(payload) {
    try {
      /**
       * @type {import("../types/types").Folder}
       */
      const defaultValues = {
        user_uid: userUid,
        archived: false,
        // @ts-ignore
        created_at: currentServerTimestamp,
        // @ts-ignore
        updated_at: currentServerTimestamp,
      };

      // Merge payload with defaults, giving precedence to user-provided values
      const payloadToSave = { ...defaultValues, ...payload };

      // Attempt to add the document to the collection
      const created = await addDoc(collectionRef, payloadToSave);

      // Return success message if task creation was successful
      return {
        created: Boolean(created),
        message: "Your folder has been created",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[createFolder]: ${error.message}`);
      // Return error message in case of failure
      return {
        created: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   * Fetches a task from the database by its ID.
   * @param {string} folderId
   * @returns {Promise<{folder: import("../types/types").Folder | {}, message: string, type: number}>}
   */
  async function readFolder(folderId) {
    try {
      const { document, message, type } = await getDocument(folderId);
      return {
        folder: document,
        message: message,
        type: type,
      };
    } catch (error) {
      // Return an error response if the fetch operation fails
      console.log(`[readFolder]: ${error.message}`);
      return {
        folder: {},
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {import("../types/types").Folder} payload
   * @returns {Promise<{ updated: boolean, message: string, type: number }>}
   */
  async function updateFolder(payload) {
    try {
      //manualy updated the updated_at
      const updatedPayload = { ...payload, updated_at: currentServerTimestamp };

      //get document
      const folder = doc(db, table, payload.id);

      //update document
      await updateDoc(folder, updatedPayload);

      return {
        updated: true,
        message: "Your folder has been succesfully been updated",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[updateFolder]: ${error.message}`);
      return {
        updated: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {string} folderId
   * @returns {Promise<{ deleted: boolean, message: string, type: number }>}
   */
  async function deleteFolder(folderId) {
    try {
      const ref = doc(db, table, folderId);
      const deleted = await deleteDoc(ref);
      return {
        deleted: Boolean(deleted),
        message: "Your folder has been deleted",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[deleteTask]: ${error.message}`);
      return {
        deleted: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  return {
    getFolders,
    listFolders,
    archiveFolder,
    createFolder,
    readFolder,
    updateFolder,
    deleteFolder,
  };
}
