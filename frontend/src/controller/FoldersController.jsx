import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet } from "react-router-dom";
import { ALERT_ACTIONS, ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import useBS5PreloaderHook from "../hooks/useBS5PreloaderHook";
import NotificationV3 from "../view/components/notifications/NotificationV3";
import useHelpers from "../helpers/useHelpers";
import FoldersLogic from "../model/FoldersLogic";

/**
 * @typedef {Object} InitialState
 * @property {import("../types/types").Folder | {}} folder
 * @property {{files: import("../types/types").DriveFiles | [], total: number, pages: number} } files
 * @property {{folders: import("../types/types").Folders | [],  total: number, pages: number} } folders
 * @property {Object} notification - The notification object.
 * @property {string} notification.message - The notification message.
 * @property {number} notification.type - The notification type.
 */

/**
 * @type {InitialState}
 */
const initialState = {
  folder: {},
  files: { files: [], total: 0, pages: 0 },
  folders: { folders: [], total: 0, pages: 0 },
  notification: { message: "", type: 0 },
};

/**
 * @typedef {Object} FoldersControllerActions
 * @property {string} LIST -
 * @property {string} CREATE
 * @property {string} READ -
 * @property {string} UPDATE -
 * @property {string} ARCHIVE -
 * @property {string} SET_NOTIFICATION -
 */
export const FOLDERS_CONTROLLER_ACTIONS = {
  LIST: "LIST",
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  ARCHIVE: "ARCHIVE",
  DELETE: "DELETE",
  SEARCH_FOLDERS_BY_SEARCH_TERM: "SEARCH_FOLDERS_BY_SEARCH_TERM",
  SET_NOTIFICATION: "SET_NOTIFICATION,",
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

const foldersControllerContext = createContext(
  /** @type {ContextValue} */ ({
    state: initialState,
    dispatch: () => {},
  })
);

/**
 * @returns {ContextValue} The context value.
 */
export function useFoldersControllerContext() {
  try {
    return useContext(foldersControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

export default function FoldersController() {
  const { getCurrentPageNumber } = useHelpers();
  const { showLoader, closeLoader, PreloaderComponent } = useBS5PreloaderHook();
  const { listFolders } = FoldersLogic();

  const REDUCER_ACTIONS = {
    SET_FILES: "SET_FILES",
    SET_FOLDER: "SET_FOLDER",
    SET_FOLDERS: "SET_FOLDERS",
    SET_NOTIFICATION: "SET_NOTIFICATION",
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
      case REDUCER_ACTIONS.SET_FOLDER:
        return {
          ...state,
          folder: action.payload,
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
  }
  // Defining the state and the dispatchAction using the useReducer hook
  const [state, dispatchAction] = useReducer(reducer, initialState);

  function closeAlert() {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: "", type: 0 },
    });
  }

  /**
   *
   * @param {{message: string, type: number}} object
   * @returns {void | null}
   */
  function setNotificationToState(object) {
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
    return clearTimeout(timeoutId);
  }

  /**
   * Sets error to the state and dispatches notification.
   * @param {Error} error - The error object.
   */
  function setErrorToState(error) {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: error.message, type: ALERT_TYPES.DANGER },
    });
  }

  /**
   * Dispatches actions based on the specified type and payload.
   * @param {{ type: string; payload?: any; }} action - The action object containing type and payload.
   * @returns {Promise<void>} - A Promise that resolves when the operation is completed.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function dispatch(
    /** @type {{ type: string; payload?: any; }} */ action
  ) {
    try {
      // Show loader while processing action
      showLoader();

      // Handle different action types
      switch (action.type) {
        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();

        case FOLDERS_CONTROLLER_ACTIONS.LIST:
          await CollectListFolders();
          break;

        case FOLDERS_CONTROLLER_ACTIONS.SET_NOTIFICATION:
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
  }

  async function CollectListFolders() {
    try {
      //get currentPageNumber
      const currentPage = getCurrentPageNumber();
      //create Payload
      const payload = { currentPage: currentPage };

      const folders = await listFolders(payload);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_FOLDERS,
        payload: folders.results,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /** @returns {ContextValue} */
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <foldersControllerContext.Provider value={contextValue}>
      {PreloaderComponent}
      <NotificationV3
        controllerContext={useFoldersControllerContext}
      ></NotificationV3>
      <Outlet />
    </foldersControllerContext.Provider>
  );
}
