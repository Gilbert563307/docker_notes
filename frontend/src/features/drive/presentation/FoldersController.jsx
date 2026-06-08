import { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { FolderDto } from "../domain/dto/FolderDto";
import { DriveFileDto } from "../domain/dto/DriveFileDto";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";
import { CreateFolderDto } from "./dto/CreateFolderDto";
import { UpdateFolderDto } from "./dto/UpdateFolderDto";
import { ArchiveFolderDto } from "./dto/ArchiveFolderDto";
import foldersService from "../application/service/FoldersService";


/**
 * @typedef {Object} InitialState
 * @property {FolderDto} folder
 * @property {{files: Array<DriveFileDto> | [], total: number, pages: number} } files
 * @property {{folders: Array<FolderDto>,  total: number, pages: number} } folders
 */

/**
 * @type {InitialState}
 */
const initialState = {
  folder: new FolderDto(null, null, null, null, null, null, null),
  files: { files: [], total: 0, pages: 0 },
  folders: { folders: [], total: 0, pages: 0 },
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
  }),
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
  const navigate = useNavigate();

  const REDUCER_ACTIONS = {
    SET_FILES: "SET_FILES",
    SET_FOLDER: "SET_FOLDER",
    SET_FOLDERS: "SET_FOLDERS",
  };

  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {{type: string, payload: any}} action - Action object containing type and payload.
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

  /**
   *
   * @param {string} searchTearm
   */
  async function collectListFoldersBySearchTerm(searchTearm) {
    const folders = await foldersService.listFoldersBySearchTerm(searchTearm);
    setNotificationToState(folders.notificationDto);

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_FOLDERS,
      payload: folders.results,
    });
  }

  /**
   *
   * @param {CreateFolderDto} payload
   */
  async function collectCreateFolder(payload) {
    const folderCreated = await foldersService.createFolder(payload);

    // Update state with the created task response
    setNotificationToState(folderCreated.notificationDto);

    //refresh  after creating one
    //TODO get state and remogve that task with that uuid no need to refesh or make all to api
    await collectListFolders();

    //navugate to tasks page
    navigate("/folders");
  }

  /**
   *
   * @param {string} folderId
   */
  async function collectReadFolder(folderId) {
    const results = await foldersService.readFolder(folderId);

    setNotificationToState(results.notificationDto);

    // set taskt to state;
    dispatchAction({
      type: REDUCER_ACTIONS.SET_FOLDER,
      payload: results.folder,
    });
  }

  /**
   *
   * @param {UpdateFolderDto} payload
   */
  async function CollectUpdateFolder(payload) {
    const tbu = await foldersService.updateFolder(payload);

    setNotificationToState(tbu.notificationDto);

    //navigate to tasks page
    navigate("/folders");

    // get the updated task content TODO UNCOMMENT WHEN NEDEED
    // const results = await readFolder(payload.getId());

    // set task to state;
    // dispatchAction({
    //   type: REDUCER_ACTIONS.SET_FOLDER,
    //   payload: results.folder,
    // });
  }

  /**
   *
   * @param {string} folderId
   */
  async function collectDeleteFolder(folderId) {
    const tbuDeleted = await foldersService.deleteFolder(folderId);

    setNotificationToState(tbuDeleted.notificationDto);

    //reftech folders after archive this one
    await collectListFolders;

    //navigate to tasks page
    navigate("/folders");
  }

  /**
   *
   * @param {string} folderId
   */
  async function collectListFilesByFolderId(folderId) {
    const response = await foldersService.getFilesByFolderId(folderId);

    setNotificationToState(response.notificationDto);

    dispatchAction({
      type: REDUCER_ACTIONS.SET_FILES,
      payload: response.results,
    });
  }

  async function collectListFolders() {
    const folders = await foldersService.listFolders();

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_FOLDERS,
      payload: folders.results,
    });
  }

  /**
   *
   * @param {ArchiveFolderDto} payload
   */
  async function collectArchiveFolder(payload) {
    const tbuArchived = await foldersService.archiveFolder(payload);

    setNotificationToState(tbuArchived.notificationDto);

    //reftech tasks after archive this one
    await collectListFolders();
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
        case FOLDERS_CONTROLLER_ACTIONS.CREATE:
          await collectCreateFolder(action?.payload);
          break;

        case "CLOSE_ALERT":
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
          console.error(`FoldersController: No action type found ${action.type}`);
          return;
      }
    } catch (error) {
      setNotificationToState(new NotificationDto(error.message, 1));
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
    <FoldersControllerContext.Provider value={contextValue}>
      <Outlet />
    </FoldersControllerContext.Provider>
  );
}
