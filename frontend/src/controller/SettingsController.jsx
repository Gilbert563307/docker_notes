import React, { createContext, useContext, useMemo, useReducer } from "react";
import NotificationV3 from "../view/components/notifications/NotificationV3";
import { Outlet } from "react-router-dom";
import { ALERT_ACTIONS, ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import useBS5PreloaderHook from "../hooks/useBS5PreloaderHook";

/**
 * @typedef {Object} InitialState
 * @property {Object} notification - The notification object.
 * @property {string} notification.message - The notification message.
 * @property {number} notification.type - The notification type.
 */

/**
 * Initial state for the tasks controller.
 * @type {InitialState}
 */
const initialState = {
  notification: { message: "", type: 0 },
};

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
  })
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
  //import the methods and loader component from our custom component
  const { showLoader, closeLoader, PreloaderComponent } = useBS5PreloaderHook();

  const REDUCER_ACTIONS = {
    SET_NOTIFICATION: "SET_NOTIFICATION", //Action type for setting a notification.
  };

  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} - Updated state.
   */
  function reducer(state, action) {
    switch (action.type) {
      case REDUCER_ACTIONS.SET_NOTIFICATION:
        // console.log('Setting notification:', action.payload);
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

  function closeAlert() {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: "", type: 0 },
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
          break;
        default:
          console.log(
            `SettingsController: No action type found ${action.type}`
          );
          break;
      }
    } catch (error) {
      // Close loader in case of error
      closeLoader();
      setErrorToState(error);
      console.log(`SettingsController: error ${error}`);
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
    <settingsControllerContext.Provider value={contextValue}>
      {PreloaderComponent}
      <NotificationV3
        controllerContext={useSettingsControllerContext}
      ></NotificationV3>
      <Outlet />
    </settingsControllerContext.Provider>
  );
}
