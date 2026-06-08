import { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { KanBoardDto } from "../application/dto/KanBoardDto";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";
import kanBoardsService from "../application/service/KanBoardsService";

/**
 * @typedef {Object} InitialState
 * @property {Array<KanBoardDto>} boards
 * @property {KanBoardDto} board
 */


/**
 *
 * @type {InitialState}
 */
const initialState = {
  boards: [],
  board: new KanBoardDto(null, null, null, null, null, null, null, null, null),
};

export const KAN_BOARDS_CONTROLLER_ACTIONS = {
  LIST: "LIST",
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  ARCHIVE: "ARCHIVE",
  DELETE: "DELETE",
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

const kanBoardsControllerContext = createContext(
  /** @type {ContextValue} */ ({
    state: initialState,
    dispatch: () => {},
  }),
);

const REDUCER_ACTIONS = {
  SET_KAN_BOARDS: "SET_KAN_BOARDS",
  SET_KAN_BOARD: "SET_KAN_BOARD",
};

/**
 * @returns {ContextValue} The context value.
 */
export function useKanBoardsControllerContext() {
  try {
    return useContext(kanBoardsControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

export default function KanBoardsController() {
  const navigate = useNavigate();

  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} - Updated state.
   */
  function reducer(state, action) {
    switch (action.type) {
      case REDUCER_ACTIONS.SET_KAN_BOARDS:
        return {
          ...state,
          boards: action.payload,
        };

      case REDUCER_ACTIONS.SET_KAN_BOARD:
        return {
          ...state,
          board: action.payload,
        };

      default:
        return state;
    }
  }

  // Defining the state and the dispatchAction using the useReducer hook
  const [state, dispatchAction] = useReducer(reducer, initialState);

  function closeAlert() {
    notificationObserver.addData(new NotificationDto("", 0));
  }

  /**
   *
   * @param {NotificationDto} notificationDto
   * @returns {void}
   */
  function setNotificationToState(notificationDto) {
    if (notificationDto.getMessage() === "") return;
    notificationObserver.addData(notificationDto);
  }

  async function collectListKanBoards() {
    const kanBoards = await kanBoardsService.listKanBoards();
    setNotificationToState(kanBoards.notificationDto);

    // Update state with the   response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_KAN_BOARDS,
      payload: kanBoards.results,
    });
  }

  /**
   *
   * @param {string} kanBoardId
   */
  async function collectReadKanBoard(kanBoardId) {
    const kanBoard = await kanBoardsService.readKanBoard(kanBoardId);
    setNotificationToState(kanBoard.notificationDto);

    // Update state with the response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_KAN_BOARD,
      payload: kanBoard.board,
    });
  }

  async function refreshKanBoardList() {
    // const currentPage = getCurrentPageNumber();
    // const payload = { currentPage: currentPage };
    await collectListKanBoards();
  }

  /**
   *
   * @param {{name: string, color: string }} payload
   */
  async function collectCreateKanBoard(payload) {
    const kanBoardCreated = await kanBoardsService.createKanBoard(payload);

    // Update state with the created  response
    setNotificationToState(kanBoardCreated.notificationDto);

    navigate("/kanboards");
  }

  /**
   *
   * @param {KanBoardDto} payload
   */
  async function collectUpdateKanBoard(payload) {
    const kanBoardUpdated = await kanBoardsService.updateKanBoard(payload);

    // Update state with the created  response
    setNotificationToState(kanBoardUpdated.notificationDto);
    navigate("/kanboards");
  }

  /**
   *
   * @param {number} payload
   */
  async function collectDeleteKanBoard(payload) {
    const kanBoarddeleted = await kanBoardsService.deleteKanBoard(payload);
    setNotificationToState(kanBoarddeleted.notificationDto);

    if (kanBoarddeleted.deleted) {
      navigate("/kanboards");
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function dispatch(/** @type {{ type: string; payload?: any; }} */ action) {
    try {
      // Show loader while processing action

      switch (action.type) {
        case KAN_BOARDS_CONTROLLER_ACTIONS.LIST:
          await collectListKanBoards();
          break;

        case KAN_BOARDS_CONTROLLER_ACTIONS.CREATE:
          await collectCreateKanBoard(action.payload);
          break;

        case KAN_BOARDS_CONTROLLER_ACTIONS.READ:
          await collectReadKanBoard(action.payload);
          break;

        case KAN_BOARDS_CONTROLLER_ACTIONS.UPDATE:
          await collectUpdateKanBoard(action.payload);
          break;

        case KAN_BOARDS_CONTROLLER_ACTIONS.DELETE:
          await collectDeleteKanBoard(action.payload);
          break;

        case "CLOSE_ALERT":
          closeAlert();
          break;

        default:
          return;
      }
    } catch (error) {
      // Close loader in case of error
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
    <kanBoardsControllerContext.Provider value={contextValue}>
      <Outlet />
    </kanBoardsControllerContext.Provider>
  );
}
