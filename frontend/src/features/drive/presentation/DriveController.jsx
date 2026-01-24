import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import FilesService from "../../../shared/application/service/FilesService";
import useHelpers from "../../../shared/helpers/useHelpers";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";
import { DriveFileDto } from "../application/dto/DriveFileDto";
import { FolderDto } from "../application/dto/FolderDto";
import { UploadFilesDto } from "./dto/UploadFilesDto";
import { ArchiveFileDto } from "./dto/ArchiveFileDto";
import { DeleteFileDto } from "./dto/DeleteFileDto";
import { DownloadFileDto } from "./dto/DownloadFileDto";
import { ListFilesBySearchTermDto } from "./dto/ListFilesBySearchTermDto";
import { ALERT_TYPES } from "../../../shared/presentation/components/bs5/BS5Alert";

/**
 * @typedef {Object} InitialState
 * @property {DriveFileDto} file
 * @property { {files: Array<DriveFileDto>, total: number, pages: number} } files
 * @property {Array<FolderDto> } folders
 */

const initialDriveFileDto = new DriveFileDto(null, null, null, null, null, null, null, null);
const initialFolderDto = new FolderDto(null, null, null, null, null, null, null);

/**
 * @type {InitialState}
 */
const initialState = {
  file: initialDriveFileDto,
  files: { files: [], total: 0, pages: 0 },
  folders: [],
};

/**
 * @typedef {Object} DriveControllerActions
 * @property {string} LIST -
 * @property {string} LIST_FOLDERS -
 * @property {string} UPLOAD_FILES -
 * @property {string} CREATE
 * @property {string} READ -
 * @property {string} UPDATE -
 * @property {string} ARCHIVE -
 * @property {string} DELETE -
 * @property {string} DOWNLOAD_FILE -
 * @property {string} SEARCH_FILES_BY_SEARCH_TERM -
 * @property {string} SET_NOTIFICATION -
 */
export const DRIVE_CONTROLLER_ACTIONS = {
  LIST: "LIST",
  LIST_FOLDERS: "LIST_FOLDERS",
  UPLOAD_FILES: "UPLOAD_FILES",
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  ARCHIVE: "ARCHIVE",
  DELETE: "DELETE",
  DOWNLOAD_FILE: "DOWNLOAD_FILE",
  SEARCH_FILES_BY_SEARCH_TERM: "SEARCH_FILES_BY_SEARCH_TERM",
  SET_NOTIFICATION: "SET_NOTIFICATION",
  FILE_NOT_SELECTED_TO_UPLOAD: "FILE_NOT_SELECTED_TO_UPLOAD",
  FOLDER_NOT_SELECTED_TO_UPLOAD: "FOLDER_NOT_SELECTED_TO_UPLOAD",
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

const driveControllerContext = createContext(
  /** @type {ContextValue} */ ({
    state: initialState,
    dispatch: () => {},
  }),
);

/**
 * @returns {ContextValue} The context value.
 */
export function useDriveControllerContext() {
  try {
    return useContext(driveControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

export default function DriveController() {
  const { listDriveFiles, uploadFiles, archiveFile, deleteFile, downloadFile, listFilesBySearchTerm, getDriveFolders } =
    FilesService();

  const navigate = useNavigate();

  const REDUCER_ACTIONS = {
    SET_FILES: "SET_FILES",
    SET_FILE: "SET_FILE",
    SET_FOLDERS: "SET_FOLDERS",
  };

  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} - Updated state.
   */
  function reducer(state, action) {
    switch (action.type) {
      case REDUCER_ACTIONS.SET_FILES:
        return {
          ...state,
          files: action.payload,
        };
      case REDUCER_ACTIONS.SET_FILE:
        return {
          ...state,
          file: action.payload,
        };
      case REDUCER_ACTIONS.SET_FOLDERS:
        return {
          ...state,
          folders: action.payload,
        };
      default:
        return state;
    }
  }

  // Defining the state and the dispatchAction using the useReducer hook
  const [state, dispatchAction] = useReducer(reducer, initialState);

  /**
   *
   * @param {NotificationDto} notificationDto
   * @returns {void}
   */
  function setNotificationToState(notificationDto) {
    if (notificationDto.getMessage() === "") return;
    notificationObserver.addData(notificationDto);
  }

  function closeAlert() {
    notificationObserver.addData(new NotificationDto("", 0));
  }

  async function collectListFiles() {
    const files = await listDriveFiles();

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_FILES,
      payload: files.results,
    });

    dispatchAction({
      type: REDUCER_ACTIONS.SET_FILE,
      payload: initialDriveFileDto,
    });

    setNotificationToState(files.notificationDto);
  }

  async function collectListDriveFolders() {
    const results = await getDriveFolders();

    dispatchAction({
      type: REDUCER_ACTIONS.SET_FOLDERS,
      payload: results.folders,
    });
    //set message if there is any
    setNotificationToState(results.notificationDto);
  }

  /**
   *
   * @param {UploadFilesDto} payload
   */
  async function collectUploadFiles(payload) {
    const results = await uploadFiles(payload);

    //set message if there is any
    setNotificationToState(results.notificationDto);

    if (results.uploaded === true) {
      //navigate to files page
      navigate("/drive");
    }
  }

  /**
   *
   * @param {ArchiveFileDto} payload
   */
  async function collectArchiveFile(payload) {
    const tbuArchived = await archiveFile(payload);

    setNotificationToState(tbuArchived.notificationDto);

    //reftech files after archive this one
    await collectListFiles();
  }

  /**
   *
   * @param {DeleteFileDto} payload
   */
  async function collectDeleteFile(payload) {
    const tbuDeleted = await deleteFile(payload);
    setNotificationToState(tbuDeleted.notificationDto);

    //reftech files after archive this one
    await collectListFiles();
  }

  /**
   *
   * @param {DownloadFileDto} payload
   */
  async function collectDownloadFile(payload) {
    const downloaded = await downloadFile(payload);
    setNotificationToState(downloaded.notificationDto);
  }

  /**
   *
   * @param {ListFilesBySearchTermDto} payload
   */
  async function collectListFilesBySearchTerm(payload) {
    const files = await listFilesBySearchTerm(payload);
    setNotificationToState(files.notificationDto);

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_FILES,
      payload: files.results,
    });
  }

  /**
   * Dispatches actions based on the specified type and payload.
   * @param {{ type: string; payload?: any; }} action - The action object containing type and payload.
   * @returns {Promise<void>} - A Promise that resolves when the operation is completed.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function dispatch(/** @type {{ type: string; payload?: any; }} */ action) {
    try {
      // Handle different action types
      switch (action.type) {
        case DRIVE_CONTROLLER_ACTIONS.LIST:
          await collectListFiles();
          return;
        case DRIVE_CONTROLLER_ACTIONS.LIST_FOLDERS:
          await collectListDriveFolders();
          return;
        case DRIVE_CONTROLLER_ACTIONS.UPLOAD_FILES:
          await collectUploadFiles(action.payload);
          return;
        case DRIVE_CONTROLLER_ACTIONS.ARCHIVE:
          await collectArchiveFile(action?.payload);
          break;
        case "CLOSE_ALERT":
          closeAlert();
          return;
        case DRIVE_CONTROLLER_ACTIONS.DELETE:
          await collectDeleteFile(action?.payload);
          break;
        case DRIVE_CONTROLLER_ACTIONS.DOWNLOAD_FILE:
          await collectDownloadFile(action?.payload);
          break;
        case DRIVE_CONTROLLER_ACTIONS.SEARCH_FILES_BY_SEARCH_TERM:
          await collectListFilesBySearchTerm(action?.payload);
          break;
        case DRIVE_CONTROLLER_ACTIONS.SET_NOTIFICATION:
          setNotificationToState(action?.payload);
          break;
        case DRIVE_CONTROLLER_ACTIONS.FILE_NOT_SELECTED_TO_UPLOAD:
          setNotificationToState(new NotificationDto("You must select at least 1 file.", ALERT_TYPES.INFO));
          break;
        case DRIVE_CONTROLLER_ACTIONS.FOLDER_NOT_SELECTED_TO_UPLOAD:
          setNotificationToState(new NotificationDto("You must select at least 1 folder to upload the file(s) into.", ALERT_TYPES.INFO));
          break;

        default:
          console.error(`DriveController: No action type found ${action.type}`);
          return;
      }
    } catch (error) {
      setNotificationToState(new NotificationDto(error.message, 1));
      console.error(`DriveController: error ${error}`);
    }
  }

  /** @returns {ContextValue} */
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  return (
    <driveControllerContext.Provider value={contextValue}>
      <Outlet />
    </driveControllerContext.Provider>
  );
}
