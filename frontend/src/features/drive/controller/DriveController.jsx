import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import FilesService from "../../../shared/service/FilesService";
import FoldersService from "../service/FoldersService";
import useHelpers from "../../../shared/helpers/useHelpers";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { ALERT_TYPES } from "../../../shared/components/bs5/BS5Alert";

/**
 * @typedef {Object} InitialState
 * @property {import("../types/types").DriveFile | Object} file
 * @property { {files: import("../types/types").DriveFiles | [], total: number, pages: number} } files
 * @property {import("../types/types").Folders | [] } folders
 * @property {Object} notification - The notification object.
 * @property {string} notification.message - The notification message.
 * @property {number} notification.type - The notification type.
 */

/**
 * @type {InitialState}
 */
const initialState = {
  file: {},
  files: { files: [], total: 0, pages: 0 },
  folders: [],
  notification: { message: "", type: 0 },
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
  SET_NOTIFICATION: "SET_NOTIFICATION"
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
  //import the methods and loader component from our custom component
  const { getCurrentPageNumber } = useHelpers();

  const { listFiles, uploadFiles, archiveFile, deleteFile, downloadFile, listFilesBySearchTerm } = FilesService();

  const { getFolders } = FoldersService();
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

  function closeAlert() {
    notificationObserver.addData({ message: "", type: 0 });
  }

  /**
   *
   * @param {{message: string, type: number}} object
   * @returns {void | null}
   */
  function setNotificationToState(object) {
    if (object.message === "") return;
    notificationObserver.addData(object);
  }

  /**
   * Sets error to the state and dispatches notification.
   * @param {Error} error - The error object.
   */
  function setErrorToState(error) {
    notificationObserver.addData({ message: error.message, type: ALERT_TYPES.DANGER });
  }

  async function collectListFiles() {
    try {
      //get currentPageNumber
      const currentPage = getCurrentPageNumber();
      const payload = { currentPage: currentPage };
      const files = await listFiles(payload);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_FILES,
        payload: files.results,
      });

      dispatchAction({
        type: REDUCER_ACTIONS.SET_FILE,
        payload: {},
      });

      setNotificationToState(files);
    } catch (error) {
      setErrorToState(error);
    }
  }

  async function collectListDriveFolders() {
    try {
      const results = await getFolders();

      dispatchAction({
        type: REDUCER_ACTIONS.SET_FOLDERS,
        payload: results.folders,
      });
      //set message if there is any
      setNotificationToState(results);
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{files: Array<File>, folderId: string}} payload
   */
  async function collectUploadFiles(payload) {
    try {
      const results = await uploadFiles(payload);

      //set message if there is any
      setNotificationToState(results);

      //navugate to files page
      navigate("/drive");
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{id: string, archived: boolean }} payload
   */
  async function collectArchiveFile(payload) {
    try {
      const tbuArchived = await archiveFile(payload);

      setNotificationToState(tbuArchived);

      //reftech files after archive this one
      await collectListFiles();
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{id: string, filename: string }} payload
   */
  async function collectDeleteFile(payload) {
    try {
      const tbuDeleted = await deleteFile(payload);
      setNotificationToState(tbuDeleted);

      //reftech files after archive this one
      await collectListFiles();
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{filename: string }} payload
   */
  async function collectDownloadFile(payload) {
    try {
      const downloaded = await downloadFile(payload);
      setNotificationToState(downloaded);
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {string} searchTearm
   */
  async function collectListFilesBySearchTerm(searchTearm) {
    try {
      //get currentPageNumber
      const currentPage = getCurrentPageNumber();
      //create Payload
      const payload = { currentPage: currentPage, searchTearm: searchTearm };

      const files = await listFilesBySearchTerm(payload);
      setNotificationToState(files);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_FILES,
        payload: files.results,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   * Dispatches actions based on the specified type and payload.
   * @param {{ type: string; payload?: any; }} action - The action object containing type and payload.
   * @returns {Promise<void>} - A Promise that resolves when the operation is completed.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function dispatch(/** @type {{ type: string; payload?: any; }} */ action) {
    try {
      // Show loader while processing action

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

        default:
          console.error(`DriveController: No action type found ${action.type}`);
          return;
      }
    } catch (error) {
      // Close loader in case of error
      setErrorToState(error);
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
