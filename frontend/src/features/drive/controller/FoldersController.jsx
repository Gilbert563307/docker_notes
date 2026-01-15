import  { createContext, useContext, useMemo, useReducer } from "react";
import {  Outlet, useNavigate } from "react-router-dom";
import { ALERT_ACTIONS, ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import useHelpers from "../helpers/useHelpers";
import FoldersLogic from "../model/FoldersLogic";
import FilesLogic from "../model/FilesLogic";

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
  LIST_FILES_IN_FOLDER: "LIST_FILES_IN_FOLDER",
  SET_NOTIFICATION: "SET_NOTIFICATION,",
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

const FoldersControllerContext = createContext(
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
    return useContext(FoldersControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

export default function FoldersController() {
  const { getCurrentPageNumber } = useHelpers();
  const {
    listFolders,
    archiveFolder,
    createFolder,
    readFolder,
    updateFolder,
    deleteFolder,
  } = FoldersLogic();

  const { listFilesByFolderId } = FilesLogic();

  const navigate = useNavigate();

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
   * @returns {Function | void}
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
    return () => clearTimeout(timeoutId);
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
   *
   * @param {string} searchTearm
   */
  async function collectListFoldersBySearchTerm(searchTearm) {
    try {
      //get currentPageNumber
      const currentPage = getCurrentPageNumber();
      //create Payload
      const payload = { currentPage: currentPage, searchTearm: searchTearm };

      const folders = await listFolders(payload);
      setNotificationToState(folders);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_FOLDERS,
        payload: folders.results,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{name: string, color: string }} payload
   */
  async function collectCreateFolder(payload) {
    try {
      const folderCreated = await createFolder(payload);

      // Update state with the created task response
      setNotificationToState(folderCreated);

      //refresh  after creating one
      //TODO get state and remogve that task with that uuid no need to refesh or make all to api
      await collectListFolders();

      //navugate to tasks page
      navigate("/folders");
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {string} folderId
   */
  async function collectReadFolder(folderId) {
    try {
      const results = await readFolder(folderId);

      setNotificationToState(results);

      // set taskt to state;
      dispatchAction({
        type: REDUCER_ACTIONS.SET_FOLDER,
        payload: results.folder,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {import("../types/types").Folder} payload
   */
  async function CollectUpdateFolder(payload) {
    try {
      const tbu = await updateFolder(payload);

      setNotificationToState(tbu);

      // get the updated task content
      const results = await readFolder(payload.id);

      // set taskt to state;
      dispatchAction({
        type: REDUCER_ACTIONS.SET_FOLDER,
        payload: results.folder,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {string} folderId
   */
  async function collectDeleteFolder(folderId) {
    try {
      const tbuDeleted = await deleteFolder(folderId);

      setNotificationToState(tbuDeleted);

      //reftech folders after archive this one
      await collectListFolders;

      //navigate to tasks page
      navigate("/folders");
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {string} folderId
   */
  async function collectListFilesByFolderId(folderId) {
    try {
      const response = await listFilesByFolderId({
        currentPage: getCurrentPageNumber(),
        folderId: folderId,
      });

      setNotificationToState(response);

      dispatchAction({
        type: REDUCER_ACTIONS.SET_FILES,
        payload: response.results,
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
  async function dispatch(
    /** @type {{ type: string; payload?: any; }} */ action
  ) {
    try {
      // Handle different action types
      switch (action.type) {
        case FOLDERS_CONTROLLER_ACTIONS.CREATE:
          await collectCreateFolder(action?.payload);
          break;

        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();
          break;

        case FOLDERS_CONTROLLER_ACTIONS.LIST:
          await collectListFolders();
          break;

        case FOLDERS_CONTROLLER_ACTIONS.ARCHIVE:
          await collectArchiveFolder(action?.payload);
          break;

        case FOLDERS_CONTROLLER_ACTIONS.SET_NOTIFICATION:
          setNotificationToState(action?.payload);
          break;

        case FOLDERS_CONTROLLER_ACTIONS.SEARCH_FOLDERS_BY_SEARCH_TERM:
          await collectListFoldersBySearchTerm(action?.payload);
          break;

        case FOLDERS_CONTROLLER_ACTIONS.UPDATE:
          await CollectUpdateFolder(action?.payload);
          break;

        case FOLDERS_CONTROLLER_ACTIONS.READ:
          await collectReadFolder(action.payload);
          break;

        case FOLDERS_CONTROLLER_ACTIONS.DELETE:
          await collectDeleteFolder(action?.payload);
          break;
        case FOLDERS_CONTROLLER_ACTIONS.LIST_FILES_IN_FOLDER:
          await collectListFilesByFolderId(action?.payload);
          break;

        default:
          console.log(`FoldersController: No action type found ${action.type}`);
          return;
      }
    } catch (error) {
      // Close loader in case of error
      setErrorToState(error);
      console.log(`FoldersController: error ${error}`);
    } finally {
      // Close loader after action processing
    }
  }

  async function collectListFolders() {
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

  /**
   *
   * @param {{id: string, archived: boolean}} payload
   */
  async function collectArchiveFolder(payload) {
    try {
      const tbuArchived = await archiveFolder(payload);

      setNotificationToState(tbuArchived);

      //reftech tasks after archive this one
      await collectListFolders();
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
    <FoldersControllerContext.Provider value={contextValue}>
      <Outlet />
    </FoldersControllerContext.Provider>
  );
}
