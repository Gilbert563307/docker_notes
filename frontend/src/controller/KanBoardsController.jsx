import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useBS5PreloaderHook from "../hooks/useBS5PreloaderHook";
import { ALERT_ACTIONS, ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import NotificationV3 from "../view/components/notifications/NotificationV3";
import KanBoardsLogic from "../model/KanBoardsLogic";

/**
 * @typedef {Object} InitialState
 * @property {Array<import('../types/types').Board>} boards
 * @property {Object} notification - The notification object.
 * @property {string} notification.message - The notification message.
 * @property {number} notification.type - The notification type.
 */

/**
 *
 * @type {InitialState}
 */
const initialState = {
  boards: [],
  notification: { message: "", type: 0 },
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
  })
);

const REDUCER_ACTIONS = {
  SET_KAN_BOARDS: "SET_KAN_BOARDS",
  SET_NOTIFICATION: "SET_NOTIFICATION",
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
  const { showLoader, closeLoader, PreloaderComponent } = useBS5PreloaderHook();

  const { listKanBoards, createKanBoard } = KanBoardsLogic();
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
  async function dispatch(
    /** @type {{ type: string; payload?: any; }} */ action
  ) {
    try {
      // Show loader while processing action
      showLoader();

      switch (action.type) {
        case KAN_BOARDS_CONTROLLER_ACTIONS.LIST:
          await collectListKanBoards();
          break;
        
        case KAN_BOARDS_CONTROLLER_ACTIONS.CREATE:
          await collectCreateKanBoard(action.payload);
          break;

        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();
          break;

        default:
          return;
      }
    } catch (error) {
      // Close loader in case of error
      closeLoader();
      setErrorToState(error);
      console.log(`KanBoardsController: error ${error}`);
    } finally {
      // Close loader after action processing
      closeLoader();
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
    <kanBoardsControllerContext.Provider value={contextValue}>
      {PreloaderComponent}
      <NotificationV3
        controllerContext={useKanBoardsControllerContext}
      ></NotificationV3>
      <Outlet />
    </kanBoardsControllerContext.Provider>
  );
}
