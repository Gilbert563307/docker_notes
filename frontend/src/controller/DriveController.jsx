import React, { createContext, useContext, useMemo, useReducer } from "react";
import useBS5PreloaderHook from "../hooks/useBS5PreloaderHook";
import { ALERT_ACTIONS, ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import NotificationV3 from "../view/components/notifications/NotificationV3";
import { Outlet, useNavigate } from "react-router-dom";
import FilesLogic from "../model/FilesLogic";
import FoldersLogic from "../model/FoldersLogic";

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
 * Initial state for the tasks controller.
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
 * @property {string} CREATE
 * @property {string} READ -
 * @property {string} UPDATE -
 * @property {string} ARCHIVE -
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
  SET_NOTIFICATION: "SET_NOTIFICATION,",
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
  })
);

/**
 * @returns {ContextValue} The context value.
 */
export const useDriveControllerContext = () => {
  const context = useContext(driveControllerContext);
  if (!context) {
    throw new Error(
      "useDriveControllerContext must be used within a DriveControllerProvider"
    );
  }
  return context;
};

export default function DriveController() {
  //import the methods and loader component from our custom component
  const { showLoader, closeLoader, PreloaderComponent } = useBS5PreloaderHook();
  const { listFiles, uploadFiles } = FilesLogic();
  const { getFolders } = FoldersLogic();
    const navigate = useNavigate();
  

  const REDUCER_ACTIONS = {
    SET_FILES: "SET_FILES",
    SET_FILE: "SET_FILE",
    SET_FOLDERS: "SET_FOLDERS",
    SET_NOTIFICATION: "SET_NOTIFICATION",
  };

  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} - Updated state.
   */
  const reducer = (state, action) => {
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
      case REDUCER_ACTIONS.SET_NOTIFICATION:
        return {
          ...state,
          notification: action.payload,
        };
      default:
        return state;
    }
  };

  // Defining the state and the dispatchAction using the useReducer hook
  const [state, dispatchAction] = useReducer(reducer, initialState);

  const closeAlert = () => {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: "", type: 0 },
    });
  };

  const setNotificationToState = (object) => {
    if (object.message === "") return;
    // Set the message
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: object,
    });

    // Remove message after 20 seconds
    const timeoutId = setTimeout(() => {
      closeAlert();
    }, 20000);

    // Clear timeout if needed
    return () => clearTimeout(timeoutId);
  };

  /**
   * Sets error to the state and dispatches notification.
   * @param {Error} error - The error object.
   */
  const setErrorToState = (error) => {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: error.message, type: ALERT_TYPES.DANGER },
    });
  };

  const collectListFiles = async () => {
    try {
      const payload = { searchTearm: "" };
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
  };

  const collectListDriveFolders = async () => {
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
  };

  /**
   *
   * @param {{files: Array<File>, folder_id: string}} payload
   */
  const collectUploadFiles = async (payload) => {
    try {
      const results = await uploadFiles(payload);

      //set message if there is any
      setNotificationToState(results);

      //navugate to files page
      navigate("/drive");
    } catch (error) {
      setErrorToState(error);
    }
  };

  /**
   * Dispatches actions based on the specified type and payload.
   * @param {{ type: string; payload?: any; }} action - The action object containing type and payload.
   * @returns {Promise<void>} - A Promise that resolves when the operation is completed.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatch = async (
    /** @type {{ type: string; payload?: any; }} */ action
  ) => {
    try {
      // Show loader while processing action
      showLoader();

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

        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();
          return;
        case DRIVE_CONTROLLER_ACTIONS.SET_NOTIFICATION:
          setNotificationToState(action?.payload);
          break;
        default:
          console.log(`DriveController: No action type found ${action.type}`);
          return;
      }
    } catch (error) {
      // Close loader in case of error
      closeLoader();
      setErrorToState(error);
      console.log(`DriveController: error ${error}`);
    } finally {
      // Close loader after action processing
      closeLoader();
    }
  };

  /** @returns {ContextValue} */
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <driveControllerContext.Provider value={contextValue}>
      {PreloaderComponent}
      <NotificationV3
        controllerContext={useDriveControllerContext}
      ></NotificationV3>
      <Outlet />
    </driveControllerContext.Provider>
  );
}
