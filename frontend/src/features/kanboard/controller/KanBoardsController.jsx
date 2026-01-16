import  { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import KanBoardsService from "../service/KanBoardsService";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { ALERT_TYPES } from "../../../shared/components/bs5/BS5Alert";

/**
 * @typedef {Object} InitialState
 * @property {Array<import('../../../types/types').Board>} boards
 */

/**
 *
 * @type {InitialState}
 */
const initialState = {
  boards: [],
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
  const { listKanBoards, createKanBoard } = KanBoardsService();
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
   * @returns {Function | void}
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

  async function collectListKanBoards() {
    try {
      const kanBoards = await listKanBoards();
      setNotificationToState(kanBoards);

      // Update state with the   response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_KAN_BOARDS,
        payload: kanBoards.results,
      });
    } catch (error) {
      setErrorToState(error);
    }
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
    try {
      const kanBoardCreated = await createKanBoard(payload);

      // Update state with the created  response
      setNotificationToState(kanBoardCreated);

      navigate("/kanboards");
    } catch (error) {
      setErrorToState(error);
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

        case "CLOSE_ALERT":
          closeAlert();
          break;

        default:
          return;
      }
    } catch (error) {
      // Close loader in case of error
      setErrorToState(error);
      console.log(`KanBoardsController: error ${error}`);
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
