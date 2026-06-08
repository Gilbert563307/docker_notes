import { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet } from "react-router-dom";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";

/**
 * @typedef {Object} InitialState
 */

/**
 * Initial state for the tasks controller.
 * @type {InitialState}
 */
const initialState = {};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

// Create context with initial state and dispatch function
const settingsControllerContext = createContext(
  /** @type {ContextValue} */ ({
    state: initialState,
    dispatch: () => {},
  }),
);

/**
 * Custom hook to use the SettingsController context.
 * Throws an error if used outside the TaksControllerProvider.
 * @returns {ContextValue} The context value.
 */
export function useSettingsControllerContext() {
  try {
    return useContext(settingsControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

export default function SettingsController() {
  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} - Updated state.
   */
  function reducer(state, action) {
    switch (action.type) {
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
        case "CLOSE_ALERT":
          closeAlert();
          break;
        default:
          console.log(`SettingsController: No action type found ${action.type}`);
          break;
      }
    } catch (error) {
      // Close loader in case of error
      setNotificationToState(new NotificationDto(error.message, 1));
      console.log(`SettingsController: error ${error}`);
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
    <settingsControllerContext.Provider value={contextValue}>
      <Outlet />
    </settingsControllerContext.Provider>
  );
}
