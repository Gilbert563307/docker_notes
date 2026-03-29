import { CollectionManager } from "../../../../firebase_entity_manager/CollectionManager";
import { FirebaseUtil } from "../../../../shared/helpers/FirebaseUtil";
import { HelpersV2 } from "../../../../shared/helpers/HelpersV2";

import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import { asBlob } from "html-docx-js-typescript";
import { DEFAULT_FILES_ARCHIVE, FILES_ARCHIVED_SESSION_FILTER, MAX_FOLDERS_TO_FETCH } from "../../../../config";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import { UploadFilesDto } from "../../presentation/dto/UploadFilesDto";
import { ListFilesBySearchTermDto } from "../../presentation/dto/ListFilesBySearchTermDto";
import { DownloadFileDto } from "../../presentation/dto/DownloadFileDto";
import { DeleteFileFromBackendServerDto } from "../../presentation/dto/DeleteFileFromBackendServerDto";
import { DeleteFileDto } from "../../presentation/dto/DeleteFileDto";
import { DriveFile } from "../../domain/DriveFile";
import { DriveFilesMapper } from "../mapper/DriveFilesMapper";
import { ArchiveFileDto } from "../../presentation/dto/ArchiveFileDto";
import { FoldersMapper } from "../mapper/FoldersMapper";
import { db } from "../../../../database/firebaseConfig";
import { FilesQueries } from "../../domain/FilesQueries";
import { GetFilesQueryClausesDto } from "../../domain/dto/GetFilesQueryClausesDto";
import { ListFilesDto } from "../../domain/dto/ListFilesDto";
import { limit, orderBy, where } from "firebase/firestore";
import filesRepository from "../../data/FilesRepository";

class FilesService {
  #filesRepository;
  #helpers;
  #firebaseUtil;

  /**
   *
   * @param {import("../../data/FilesRepository.js").default} filesRepository
   * @param {HelpersV2} helpers
   * @param {FirebaseUtil} firebaseUtil
   */
  constructor(filesRepository, helpers, firebaseUtil) {
    this.#filesRepository = filesRepository;
    this.#helpers = helpers;
    this.#firebaseUtil = firebaseUtil;
  }

  /**
   * @param {GetFilesQueryClausesDto} payload
   * @returns {Array<any>}
   */
  getFilesQueryClauses(payload) {
    const userUid = this.#firebaseUtil.getUserUid();
    const archived = this.#helpers.getSessionFilter(FILES_ARCHIVED_SESSION_FILTER) || DEFAULT_FILES_ARCHIVE;

    const baseQueryItems = [
      where("user_uid", "==", userUid),
      where("archived", "==", archived),
      orderBy("created_at", "desc"),
    ];

    //todo make these if statements domain LOGIC
    const filesQueries = new FilesQueries(baseQueryItems);

    const searchTearm = payload.getSearchTerm();
    const folderId = payload.getFolderId();

    filesQueries.addQuery(searchTearm, this.#filesRepository.getSearchQueryBeforeFieldName("name", searchTearm));
    filesQueries.addQuery(searchTearm, this.#filesRepository.getSearchQueryAfterFieldName("name", searchTearm));
    filesQueries.addQuery(folderId, where("folder_id", "==", folderId));

    return filesQueries.getQueryItems();
  }

  /**
   * Generates a Firestore query to fetch tasks for the current page.
   *
   *@param {ListFilesDto} payload
   * @returns {Promise<Array<Object>>} The Firestore query to fetch tasks for the specified page.
   */
  async getFilesByQuery(payload) {
    const queryItems = this.getFilesQueryClauses(new GetFilesQueryClausesDto(payload.getSearchTerm(), payload.getFolderId()));

    return await this.#filesRepository.getPaginatedDocumentsByQueryItems(
      queryItems,
      payload.getCurrentPage(),
      payload.getItemsPerPage(),
    );
  }

  /**
   *
   * @param {ListFilesDto} payload
   */
  async getTotalTasksInDatabaseByUserAndFilters(payload) {
    const queryItems = this.getFilesQueryClauses(new GetFilesQueryClausesDto(payload.getSearchTerm()));
    return await this.#filesRepository.countDocumentsByQuery(queryItems);
  }

  /**
   *
   * @param {ListFilesDto} payload
   * @returns {Promise<{results: import("../../../../types/types").FilesResponse,  notificationDto: NotificationDto }>}
   */
  async _listFiles(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const files = await this.getFilesByQuery(payload);

      const driveFilesDto = DriveFilesMapper.arrayToDtoList(files);

      //get total records for pagination
      const totalRecords = await this.getTotalTasksInDatabaseByUserAndFilters(payload);
      //get total pages for pagination
      const totalPages = this.#helpers.getTotalPages(totalRecords);

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
  generateRandomFileName() {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 7);
    return `${timestamp}-${randomPart}`;
  }

  /**
   * @param {string} string
   * @returns {string}
   */
  convertToValidFilename(string) {
    return string.replace(/[\/|\\:*?"<>]/g, " ");
  }

  /**
   * TODO ADD T
   * @param {{description: string, filename: string}} payload
   * @returns {Promise<{downloaded: Boolean, notificationDto: NotificationDto}>}
   */
  async convertHtmlToDocx(payload) {
    try {
      const { description, filename } = payload;

      const data = await asBlob(description);
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);

      const correct_filename = this.convertToValidFilename(filename);

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
  async uploadFilesToBackendServer(payload) {
    const userUid = this.#firebaseUtil.getUserUid();
    const formData = new FormData();

    formData.append("folder_id", payload.getFolderId());
    formData.append("user_uid", userUid);

    // Append files to FormData
    payload.getFiles().forEach((file) => {
      formData.append(`files`, file, file.name);
    });

    try {
      const response = await fetch(`${this.#firebaseUtil.getBackendUrl()}files/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "x-token": this.#firebaseUtil.getXToken(),
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
  async updateDocRefIfExists(fileName) {
    try {
      const checkFileQueries = [where("name", "==", fileName)];
      const results = await this.#filesRepository.getAllDocumentsByQuery(checkFileQueries);

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
            this.#filesRepository.getCurrentServerTimestamp(),
          );
          // Only update if data has changed
          const update = this.#filesRepository.updateDocument(driveFile.getId(), driveFile.toJsonWithoutId());
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
  getDriveFilesToUpload(payload) {
    const currentServerTimestamp = this.#filesRepository.getCurrentServerTimestamp();
    return payload.getFiles().map((file) => {
      return new DriveFile(
        "",
        file.name,
        payload.getFolderId(),
        this.#firebaseUtil.getUserUid(),
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
  async uploadFiles(payload) {
    try {
      //convert files to driveFiles
      const driveFiles = this.getDriveFilesToUpload(payload);

      //upload the files to the backend server
      const uploadedToServer = await this.uploadFilesToBackendServer(payload);
      if (!uploadedToServer.uploaded) return uploadedToServer;

      // Create a batch write operation
      const batch = this.#filesRepository.createBatchOperation();

      //check if the file already exits in firebase
      //update the updated_at only do not save the entire file as a newly addec collection in firebase
      const results = await Promise.all(payload.getFiles().map((file) => this.updateDocRefIfExists(file.name)));

      // Extract the `documentUpdated` values
      const updatedDocuments = results.map((result) => result.documentUpdated);

      //filter out the doc same that you do not want to updatee
      const payloadToSave = driveFiles.filter((driveFile) => !updatedDocuments.includes(driveFile.getName()));

      //loop through data to  get the filename
      payloadToSave.forEach((driveFile) => {
        //create doc ref
        const docRef = this.#filesRepository.createDocumentReference();
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
  async archiveFile(payload) {
    try {
      //TODO REWRITE TO USE DOMAIN BECAUSE CREATING AN OBJECT HERE IS A DIRTY FIX
      //manualy updated the updated_at & archive do not use drive domain here because that is unnecessary for performance
      const updatedPayload = { archived: true, updated_at: this.#filesRepository.getCurrentServerTimestamp() };

      const archived = await this.#filesRepository.updateDocument(payload.getId(), updatedPayload);
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
  async deleteFileFromBackendServer(payload) {
    try {
      const response = await fetch(`${this.#firebaseUtil.getBackendUrl()}files/delete`, {
        method: "DELETE",
        body: JSON.stringify(payload.toJSON()),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-token": this.#firebaseUtil.getXToken(),
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
  async deleteFile(payload) {
    try {
      const userUid = this.#firebaseUtil.getUserUid();
      const deletedFromServer = await this.deleteFileFromBackendServer(
        new DeleteFileFromBackendServerDto(userUid, payload.getFilename()),
      );
      if (!deletedFromServer.deleted) return deletedFromServer;
      await this.#filesRepository.deleteDocument(payload.getId());

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
  async downloadFile(payload) {
    try {
      const userUid = this.#firebaseUtil.getUserUid();
      const response = await fetch(`${this.#firebaseUtil.getBackendUrl()}files/${payload.getFilename()}/${userUid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-token": this.#firebaseUtil.getXToken(),
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
  async listFilesBySearchTerm(payload) {
    return await this._listFiles(
      new ListFilesDto(
        this.#helpers.getCurrentPageNumber(),
        this.#helpers.getTheCurrentItemsPerPage(),
        payload.getSearchTerm(),
        null,
      ),
    );
  }

  /**
   *
   * @param {string} folderId
   * @returns
   */
  async listFilesByFolderId(folderId) {
    return await this._listFiles(
      new ListFilesDto(this.#helpers.getCurrentPageNumber(), this.#helpers.getTheCurrentItemsPerPage(), "", folderId),
    );
  }

  async getDriveFolders() {
    try {
      const userUid = this.#firebaseUtil.getUserUid();
      const foldersQueriesItems = [
        where("user_uid", "==", userUid),
        orderBy("created_at", "desc"),
        limit(MAX_FOLDERS_TO_FETCH),
      ];

      const query = this.#filesRepository.createQueryByGivenCollectionName("folders", foldersQueriesItems);
      const results = await this.#filesRepository.getDocumentsByQuery(query);

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

  async listDriveFiles() {
    return await this._listFiles(
      new ListFilesDto(this.#helpers.getCurrentPageNumber(), this.#helpers.getTheCurrentItemsPerPage(), null, null),
    );
  }
}

const filesService = new FilesService(filesRepository, new HelpersV2(), new FirebaseUtil());

export default filesService;
