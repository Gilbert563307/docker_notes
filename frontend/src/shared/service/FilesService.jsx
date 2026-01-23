import React from "react";
import { ALERT_TYPES } from "../components/bs5/BS5Alert";
import { asBlob } from "html-docx-js-typescript";
import { Query } from "firebase/firestore";
import { DEFAULT_FILES_ARCHIVE, FILES_ARCHIVED_SESSION_FILTER } from "../../config";
import useHelpers from "../helpers/useHelpers";
import FirebaseInterface from "../data/FirebaseInterface";
import { NotificationDto } from "../../features/notification/application/dto/NotificationDto";
import FoldersService from "../../features/drive/application/service/FoldersService";
import { UploadFilesDto } from "../../features/drive/presentation/dto/UploadFilesDto";
import { ListFilesBySearchTermDto } from "../../features/drive/presentation/dto/ListFilesBySearchTermDto";
import { DownloadFileDto } from "../../features/drive/presentation/dto/DownloadFileDto";
import { DeleteFileFromBackendServerDto } from "../../features/drive/presentation/dto/DeleteFileFromBackendServerDto";
import { DeleteFileDto } from "../../features/drive/presentation/dto/DeleteFileDto";
import { DriveFile } from "../../features/drive/domain/DriveFile";

export default function FilesService() {
  const {
    getTheCurrentItemsPerPage,
    userUid,
    where,
    orderBy,
    getSearchQueryByFieldName,
    query,
    collectionRef,
    // limit,
    getDocs,
    convertQuerySnapShotDocs,
    getCountFromServer,
    getTotalPages,
    writeBatch,
    db,
    doc,
    table,
    updateDoc,
    BACKEND_URL,
    X_TOKEN,
    deleteDoc,
    currentServerTimestamp,
    fetchResultsOnPageOne,
    fetchPaginatedResults,
  } = FirebaseInterface({ table: "files" });

  const { getSessionFilter, getCurrentPageNumber } = useHelpers();
  const { getFolders } = FoldersService();
  /**
   * @param {{searchTearm?: string, folderId?: string}} payload
   * @returns {{queryItems: Array<Query> | Array, notificationDto: NotificationDto}}
   */
  function getFilesQueryClauses(payload) {
    try {
      const archived = getSessionFilter(FILES_ARCHIVED_SESSION_FILTER) || DEFAULT_FILES_ARCHIVE;

      let queryItems = [
        where("user_uid", "==", userUid),
        where("archived", "==", archived),
        orderBy("created_at", "desc"),
      ];

      if (payload && payload.searchTearm && payload.searchTearm != "") {
        const { searchTearm } = payload;
        queryItems = [...queryItems, ...getSearchQueryByFieldName("name", searchTearm)];
      }

      if (payload && payload.folderId && payload.folderId != "") {
        const { folderId } = payload;
        queryItems = [...queryItems, where("folder_id", "==", folderId)];
      }

      return {
        queryItems: queryItems,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        queryItems: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   * @typedef {Object} getFilesTasksQueryResponse
   * @property {Query | null} resultsQuery
   * @property {string} message
   * @property {number} type
   */

  /**
   * @typedef {Promise<getFilesTasksQueryResponse> | getFilesTasksQueryResponse} GetFilesTasksQueryResponseType
   */

  /**
   * Generates a Firestore query to fetch tasks for the current page.
   *
   *@param {{currentPage: number, itemsPerPage?: number, searchTearm?: string }} payload
   * @returns {GetFilesTasksQueryResponseType} The Firestore query to fetch tasks for the specified page.
   */
  function getFilesTasksQuery(payload) {
    try {
      // Destructure the vars
      const { currentPage } = payload;

      // Get the number of items to be displayed per page
      const itemsPerPage = getTheCurrentItemsPerPage();
      const { queryItems } = getFilesQueryClauses(payload);

      // If the current page is the first page, create a query limited by the items per page
      if (currentPage === 1) {
        return fetchResultsOnPageOne(queryItems, itemsPerPage);
      }

      return fetchPaginatedResults(currentPage, payload, itemsPerPage, queryItems);
    } catch (error) {
      return {
        resultsQuery: null,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  async function getTotalTasksInDatabaseByUserAndFilters() {
    try {
      const payload = { searchTearm: "" };
      const { queryItems } = getFilesQueryClauses(payload);

      const totalQuery = query(collectionRef, ...queryItems);
      const totalRecordsSnapShot = await getCountFromServer(totalQuery);
      const totalRecords = totalRecordsSnapShot.data().count;
      return totalRecords;
    } catch (error) {
      return 0;
    }
  }

  /**
   *
   * @param {{ currentPage: number, itemsPerPage?: number, searchTearm?: string, folderId?: string }} payload
   * @returns {Promise<{results: import("../../types/types").FilesResponse,  notificationDto: NotificationDto }>}
   */
  async function _listFiles(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const { resultsQuery } = await getFilesTasksQuery(payload);

      // Execute the query to get the files.
      const querySnapshot = await getDocs(resultsQuery);

      const { results } = convertQuerySnapShotDocs(querySnapshot);

      //get total records for pagination
      const totalRecords = await getTotalTasksInDatabaseByUserAndFilters();
      //get total pages for paginartion
      const totalPages = getTotalPages(totalRecords);

      //return results
      return {
        results: { files: results, total: totalRecords, pages: totalPages },
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        results: { files: [], total: 0, pages: 0 },
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @returns {string}
   */
  function generateRandomFileName() {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 7);
    return `${timestamp}-${randomPart}`;
  }

  /**
   * @param {string} string
   * @returns {string}
   */
  function convertToValidFilename(string) {
    return string.replace(/[\/|\\:*?"<>]/g, " ");
  }

  /**
   *
   * @param {{description: string, filename: string}} payload
   * @returns {Promise<{downloaded: Boolean, notificationDto: NotificationDto}>}
   */
  async function convertHtmlToDocx(payload) {
    try {
      const { description, filename } = payload;

      const data = await asBlob(description);
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);

      const correct_filename = convertToValidFilename(filename);

      // Create a temporary link to download the DOCX file
      const link = document.createElement("a");
      link.href = url;
      link.download = `${correct_filename}.docx`;
      document.body.appendChild(link);

      // Trigger the download and clean up
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return {
        downloaded: true,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        downloaded: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }
  /**
   * Upload files to the backend server
   *
   * @param {UploadFilesDto} payload
   * @returns {Promise<{uploaded: boolean, notificationDto: NotificationDto}>}
   */
  async function uploadFilesToBackendServer(payload) {
    const formData = new FormData();

    formData.append("folder_id", payload.folderId);
    formData.append("user_uid", userUid);

    // Append files to FormData
    payload.files.forEach((file) => {
      formData.append(`files`, file, file.name);
    });

    try {
      const response = await fetch(`${BACKEND_URL}files/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "x-token": X_TOKEN,
        },
      });

      if (!response.ok) {
        // Handle HTTP error responses
        const errorResponse = await response.json();
        return {
          uploaded: false,
          notificationDto: new NotificationDto(JSON.stringify(errorResponse), ALERT_TYPES.DANGER),
        };
      }

      //TODO CHECK json response in future
      // const data = await response.json();

      return {
        uploaded: true,
        notificationDto: new NotificationDto("Files uploaded successfully.", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      console.error(`[uploadFilesToBackendServer] ${error.message}`);
      return {
        uploaded: false,

        notificationDto: new NotificationDto(
          error.message || "An error occurred during file upload.",
          ALERT_TYPES.DANGER,
        ),
      };
    }
  }

  /**
   * This func should be called before uploading files to the backend server;
   * It first checks if the file is already submitted into the firebase db;
   * If so then it updates the updated_at timestamp for that specific document with that names;
   * @param {string} fileName
   * @returns {Promise<{documentUpdated: string, updated: boolean, notificationDto: NotificationDto}>}
   */
  async function updateDocRefIfExists(fileName) {
    try {
      const checkFileQuery = query(collectionRef, where("name", "==", fileName));
      const querySnapshot = await getDocs(checkFileQuery);

      const updates = [];
      let documentUpdated = "";
      querySnapshot.forEach((document) => {
        const oldData = document.data();

        if (oldData.name === fileName) {
          documentUpdated = fileName;
          const newData = {
            ...oldData,
            updated_at: currentServerTimestamp,
          };

          // Only update if data has changed
          const docRef = doc(db, table, document.id);
          updates.push(updateDoc(docRef, newData));
        }
      });

      // Wait for all updates to complete
      await Promise.all(updates);

      return {
        documentUpdated: documentUpdated,
        updated: true,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        documentUpdated: "",
        updated: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {UploadFilesDto} payload
   * @returns {Promise<{uploaded: Boolean, notificationDto: NotificationDto}>}
   */
  async function uploadFiles(payload) {
    try {
      //upload the files to the backend server
      const uploadedToServer = await uploadFilesToBackendServer(payload);
      if (!uploadedToServer.uploaded) return uploadedToServer;

      // Create a batch write operation
      const batch = writeBatch(db);

      //check if the file already exits in firebase
      //update the updated_at only do not save the entire file as a newly addec collection in firebase
      const results = await Promise.all(payload.getFiles().map((file) => updateDocRefIfExists(file.name)));

      // Extract the `documentUpdated` values
      const updatedDocuments = results.map((result) => result.documentUpdated);

      //filter out the docsname that you do not want to updae
      const payloadToSave = payload.getFiles().filter((f) => !updatedDocuments.includes(f.name));

      //loop through data to  get the filename
      payloadToSave.forEach((file /** @type {File}  */) => {
        /**
         * @type {import("../../types/types").DriveFile}
         */
        const fileToUploadPayload = {
          name: file.name,
          folder_id: payload.folderId,
          user_uid: userUid,
          size: file.size,
          type: file.type,
          archived: false,
          // @ts-ignore
          created_at: currentServerTimestamp,
          // @ts-ignore
          updated_at: currentServerTimestamp,
        };

        const driveFile = new DriveFile(
          "",
          file.name,
          payload.getFolderId(),
          userUid,
          file.size,
          file.type,
          false,
          currentServerTimestamp
          currentServerTimestamp
        );

        //create doc ref
        const docRef = doc(collectionRef);
        batch.set(docRef, fileToUploadPayload);
      });

      //add all data to firebase db
      const uploaded = await batch.commit();

      return {
        uploaded: Boolean(uploaded),
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        uploaded: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {{id: string, archived: boolean }} payload
   * @returns {Promise<{ archived: boolean, notificationDto: NotificationDto }>}
   */
  async function archiveFile(payload) {
    try {
      //manualy updated the updated_at
      const updatedPayload = { ...payload, updated_at: currentServerTimestamp };

      //get document
      const file = doc(db, table, payload.id);

      //update document
      await updateDoc(file, updatedPayload);

      return {
        archived: true,
        notificationDto: new NotificationDto("Your file has been succesfully been archived", ALERT_TYPES.SUCCESS),
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        archived: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   * Upload files to the backend server
   *
   * @param {DeleteFileFromBackendServerDto} payload
   * @returns {Promise<{deleted: boolean, notificationDto: NotificationDto}>}
   */
  async function deleteFileFromBackendServer(payload) {
    try {
      const response = await fetch(`${BACKEND_URL}files/delete`, {
        method: "POST",
        body: JSON.stringify(payload.toJSON()),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-token": X_TOKEN,
        },
      });

      if (!response.ok) {
        // Handle HTTP error responses
        const errorResponse = await response.json();
        return {
          deleted: false,
          notificationDto: new NotificationDto(JSON.stringify(errorResponse), ALERT_TYPES.DANGER),
        };
      }

      const data = await response.json();

      if (!data.deleted) {
        return {
          deleted: false,
          notificationDto: new NotificationDto(
            data?.message || "An error occurred during file deletion.",
            ALERT_TYPES.DANGER,
          ),
        };
      }

      return {
        deleted: true,
        message: "File deleted successfully.",
        type: ALERT_TYPES.SUCCESS,
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
   * @param {DeleteFileDto} payload
   * @returns {Promise<{ deleted: boolean, notificationDto: NotificationDto }>}
   */
  async function deleteFile(payload) {
    try {
      
      const deletedFromServer = await deleteFileFromBackendServer(new DeleteFileFromBackendServerDto(userUid, payload.getFilename()));
      if (!deletedFromServer.deleted) return deletedFromServer;

      const fileRTef = doc(db, table, payload.getId());
      const deleted = await deleteDoc(fileRTef);

      return {
        deleted: Boolean(deleted),
        notificationDto: new NotificationDto("Your file has been deleted", ALERT_TYPES.SUCCESS),
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
   * @param {DownloadFileDto} payload
   * @returns {Promise<{ downloaded: boolean, notificationDto: NotificationDto }>}
   */
  async function downloadFile(payload) {
    try {
      const updatedPayload = { ...payload.toJson(), user_uid: userUid };

      const response = await fetch(`${BACKEND_URL}files/get`, {
        method: "POST",
        body: JSON.stringify(updatedPayload),
        headers: {
          "Content-Type": "application/json",
          "x-token": X_TOKEN,
        },
      });

      if (response.status === 404) {
        const data = await response.json();
        return {
          downloaded: false,
          notificationDto: new NotificationDto(JSON.stringify(data), ALERT_TYPES.DANGER),
        };
      }

      // Ensure the response is a blob
      const blob = await response.blob();

      // Create a link element to trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = payload.getFilename();
      document.body.appendChild(link);

      // Trigger the download and clean up
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        downloaded: true,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        downloaded: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  async function listFilesBySearchTerm(payload) {
    return await _listFiles({ currentPage:  getCurrentPageNumber(), searchTearm: payload.getSearchTerm() });
  }

  async function listFilesByFolderId() {
    return await _listFiles({ currentPage: getCurrentPageNumber() });
  }

  async function getDriveFolders() {
    return await getFolders();
  }

  async function listDriveFiles() {
    return await _listFiles({ currentPage: getCurrentPageNumber() });
  }

  return {
    convertHtmlToDocx,
    listDriveFiles,
    uploadFiles,
    archiveFile,
    deleteFile,
    downloadFile,
    listFilesBySearchTerm,
    listFilesByFolderId,
    getDriveFolders,
  };
}
