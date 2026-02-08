import React from "react";
import { ALERT_TYPES } from "../../presentation/components/bs5/BS5Alert";
import { asBlob } from "html-docx-js-typescript";
import { DEFAULT_FILES_ARCHIVE, FILES_ARCHIVED_SESSION_FILTER, MAX_FOLDERS_TO_FETCH } from "../../../config";
import useHelpers from "../../helpers/useHelpers";
import { NotificationDto } from "../../../features/notification/application/dto/NotificationDto";
import { UploadFilesDto } from "../../../features/drive/presentation/dto/UploadFilesDto";
import { ListFilesBySearchTermDto } from "../../../features/drive/presentation/dto/ListFilesBySearchTermDto";
import { DownloadFileDto } from "../../../features/drive/presentation/dto/DownloadFileDto";
import { DeleteFileFromBackendServerDto } from "../../../features/drive/presentation/dto/DeleteFileFromBackendServerDto";
import { DeleteFileDto } from "../../../features/drive/presentation/dto/DeleteFileDto";
import { DriveFile } from "../../../features/drive/domain/DriveFile";
import { DriveFilesMapper } from "../../../features/drive/application/mapper/DriveFilesMapper";
import { ArchiveFileDto } from "../../../features/drive/presentation/dto/ArchiveFileDto";
import { FoldersMapper } from "../../../features/drive/application/mapper/FoldersMapper";
import { db } from "../../../database/firebaseConfig";
import { CollectionManager } from "../../../firebase_entity_manager/CollectionManager";
import FirebaseInterfaceV2 from "../../data/FirebaseInterfaceV2";
import { FilesQueries } from "../../../features/drive/domain/FilesQueries";
import { GetFilesQueryClausesDto } from "../../../features/drive/domain/dto/GetFilesQueryClausesDto";
import { ListFilesDto } from "../../../features/drive/domain/dto/ListFilesDto";

const collectionManager = new CollectionManager("files", db);

export default function FilesService() {
  const { getSessionFilter, getCurrentPageNumber, getTotalPages, getTheCurrentItemsPerPage } = useHelpers();
  const { userUid, BACKEND_URL, X_TOKEN } = FirebaseInterfaceV2();

  /**
   * @param {GetFilesQueryClausesDto} payload
   * @returns {Array<any>}
   */
  function getFilesQueryClauses(payload) {
    const archived = getSessionFilter(FILES_ARCHIVED_SESSION_FILTER) || DEFAULT_FILES_ARCHIVE;

    const baseQueryItems = [
      collectionManager.whereQuery("user_uid", "==", userUid),
      collectionManager.whereQuery("archived", "==", archived),
      collectionManager.orderByQuery("created_at", "desc"),
    ];

    //todo make these if statements domain LOGIC
    const filesQueries = new FilesQueries(baseQueryItems);

    const searchTearm = payload.getSearchTerm();
    if (searchTearm && searchTearm != "") {
      filesQueries.addQueryItem(collectionManager.getSearchQueryBeforeFieldName("name", searchTearm));
      filesQueries.addQueryItem(collectionManager.getSearchQueryAfterFieldName("name", searchTearm));
    }

    const folderId = payload.getFolderId();
    if (folderId && folderId != "") {
      filesQueries.addQueryItem(collectionManager.whereQuery("folder_id", "==", folderId));
    }
    return filesQueries.getQueryItems();
  }

  /**
   * Generates a Firestore query to fetch tasks for the current page.
   *
   *@param {ListFilesDto} payload
   * @returns {Promise<Array<Object>>} The Firestore query to fetch tasks for the specified page.
   */
  async function getFilesByQuery(payload) {
    const queryItems = getFilesQueryClauses(new GetFilesQueryClausesDto(payload.getSearchTerm()));

    return await collectionManager.getPaginatedDocumentsByQueryItems(
      queryItems,
      payload.getCurrentPage(),
      payload.getItemsPerPage(),
    );
  }

  /**
   *
   * @param {ListFilesDto} payload
   */
  async function getTotalTasksInDatabaseByUserAndFilters(payload) {
    const queryItems = getFilesQueryClauses(new GetFilesQueryClausesDto(payload.getSearchTerm()));
    return await collectionManager.countDocumentsByQuery(queryItems);
  }

  /**
   *
   * @param {ListFilesDto} payload
   * @returns {Promise<{results: import("../../../types/types").FilesResponse,  notificationDto: NotificationDto }>}
   */
  async function _listFiles(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const files = await getFilesByQuery(payload);

      const driveFilesDto = DriveFilesMapper.arrayToDtoList(files);

      //get total records for pagination
      const totalRecords = await getTotalTasksInDatabaseByUserAndFilters(payload);
      //get total pages for pagination
      const totalPages = getTotalPages(totalRecords);

      return {
        results: { files: driveFilesDto, total: totalRecords, pages: totalPages },
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
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
   * TODO ADD T
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

    formData.append("folder_id", payload.getFolderId());
    formData.append("user_uid", userUid);

    // Append files to FormData
    payload.getFiles().forEach((file) => {
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
      const checkFileQueries = [collectionManager.whereQuery("name", "==", fileName)];
      const results = await collectionManager.getAllDocumentsByQuery(checkFileQueries);

      const updates = [];
      let documentUpdated = "";

      results.forEach((document) => {
        if (document.name === fileName) {
          documentUpdated = fileName;
          const driveFile = new DriveFile(
            document.id,
            document.name,
            document.folder_id,
            document.user_uid,
            document.size,
            document.type,
            document.archived,
            document.created_at,
            collectionManager.getCurrentServerTimestamp(),
          );
          // Only update if data has changed
          const update = collectionManager.updateDocument(driveFile.getId(), driveFile.toJsonWithoutId());
          updates.push(update);
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
   * @returns {Array<DriveFile>}
   */
  function getDriveFilesToUpload(payload) {
    const currentServerTimestamp = collectionManager.getCurrentServerTimestamp();
    return payload.getFiles().map((file) => {
      return new DriveFile(
        "",
        file.name,
        payload.getFolderId(),
        userUid,
        file.size,
        file.type || file.name.split(".").pop().toLowerCase(),
        false,
        currentServerTimestamp,
        currentServerTimestamp,
      );
    });
  }

  /**
   *
   * @param {UploadFilesDto} payload
   * @returns {Promise<{uploaded: Boolean, notificationDto: NotificationDto}>}
   */
  async function uploadFiles(payload) {
    try {
      //convert files to driveFiles
      const driveFiles = getDriveFilesToUpload(payload);

      //upload the files to the backend server
      const uploadedToServer = await uploadFilesToBackendServer(payload);
      if (!uploadedToServer.uploaded) return uploadedToServer;

      // Create a batch write operation
      const batch = collectionManager.createBatchOperation();

      //check if the file already exits in firebase
      //update the updated_at only do not save the entire file as a newly addec collection in firebase
      const results = await Promise.all(payload.getFiles().map((file) => updateDocRefIfExists(file.name)));

      // Extract the `documentUpdated` values
      const updatedDocuments = results.map((result) => result.documentUpdated);

      //filter out the doc same that you do not want to updatee
      const payloadToSave = driveFiles.filter((driveFile) => !updatedDocuments.includes(driveFile.getName()));

      //loop through data to  get the filename
      payloadToSave.forEach((driveFile) => {
        //create doc ref
        const docRef = collectionManager.createDocumentReference();
        batch.set(docRef, driveFile.toJsonWithoutId());
      });

      // add all data to firebase db
      await batch.commit();

      return {
        uploaded: true,
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
   * @param {ArchiveFileDto} payload
   * @returns {Promise<{ archived: boolean, notificationDto: NotificationDto }>}
   */
  async function archiveFile(payload) {
    try {
      //TODO REWRITE TO USE DOMAIN BECAUSE CREATING AN OBJECT HERE IS A DIRTY FIX
      //manualy updated the updated_at & archive do not use drive domain here because that is unnecessary for performance
      const updatedPayload = { archived: true, updated_at: collectionManager.getCurrentServerTimestamp() };

      const archived = await collectionManager.updateDocument(payload.getId(), updatedPayload);
      return {
        archived: archived,
        notificationDto: new NotificationDto("Your file has been successfully been archived", ALERT_TYPES.SUCCESS),
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
        method: "DELETE",
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
        notificationDto: new NotificationDto("File deleted successfully.", ALERT_TYPES.SUCCESS),
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
      const deletedFromServer = await deleteFileFromBackendServer(
        new DeleteFileFromBackendServerDto(userUid, payload.getFilename()),
      );
      if (!deletedFromServer.deleted) return deletedFromServer;
      await collectionManager.deleteDocument(payload.getId());

      return {
        deleted: true,
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
      const response = await fetch(`${BACKEND_URL}files/${payload.getFilename()}/${userUid}`, {
        method: "GET",
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

  /**
   *
   * @param {ListFilesBySearchTermDto} payload
   * @returns
   */
  async function listFilesBySearchTerm(payload) {
    return await _listFiles(
      new ListFilesDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), payload.getSearchTerm(), null),
    );
  }

  /**
   *
   * @param {string} folderId
   * @returns
   */
  async function listFilesByFolderId(folderId) {
    return await _listFiles(new ListFilesDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), "", folderId));
  }

  async function getDriveFolders() {
    try {
      const foldersQueriesItems = [
        collectionManager.whereQuery("user_uid", "==", userUid),
        collectionManager.orderByQuery("created_at", "desc"),
        collectionManager.limitByQuery(MAX_FOLDERS_TO_FETCH),
      ];

      const query = collectionManager.createQueryByGivenCollectionName("folders", foldersQueriesItems);
      const results = await collectionManager.getDocumentsByQuery(query);

      const foldersDtos = FoldersMapper.arrayToDtoList(results);
      return {
        folders: foldersDtos,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        folders: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  async function listDriveFiles() {
    return await _listFiles(new ListFilesDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), null, null));
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
