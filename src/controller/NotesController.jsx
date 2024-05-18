import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Outlet } from 'react-router-dom';
import useBS5PreloaderHook from '../hooks/useBS5PreloaderHook';
import { ALERT_ACTIONS, ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import NotificationV3 from '../view/components/notifications/NotificationV3';
import NotesLogic from '../model/NotesLogic';

/**
 * @typedef {Object} Note
 * @property {number} id - The unique identifier for the note.
 * @property {string} user_uid - The unique identifier for the user.
 * @property {string} title - The title of the note.
 * @property {string} description - The description of the note.
 * @property {integer} status - The status of the note.
 * @property {integer} priority - The priority level of the note.
 * @property {string} updated_at - The timestamp when the note was last updated.
 * @property {string} created_at - The timestamp when the note was created.
 */

/**
 * @typedef {Array<Note>} Notes - State for notes.
 */

/**
 * @typedef {Object} InitialState
 * @property {Note | Object} note - The current note.
 * @property {Notes | Array} notes - The list of notes.
 * @property {Object} notification - The notification object.
 * @property {string} notification.message - The notification message.
 * @property {number} notification.type - The notification type.
 */

/**
 * Initial state for the notes controller.
 * @type {InitialState}
 */
const initialState = {
  note: {},
  notes: [],
  notification: { message: "", type: 0 },
};

/**
 * Enum representing different actions for the notes controller.
 * @typedef {Object} NotesControllerActions
 * @property {string} LIST - Action type for listing notes.
 * @property {string} CREATE - Action type for creating a note.
 * @property {string} READ - Action type for reading a note.
 * @property {string} UPDATE - Action type for updating a note.
 * @property {string} ARCHIVE - Action type for archiving a note.
 */
export const NOTES_CONTROLLER_ACTIONS = {
  LIST: "LIST_NOTES",
  CREATE: "CREATE_NOTE",
  READ: "READ_NOTE",
  UPDATE: "UPDATE_NOTE",
  ARCHIVE: "ARCHIVE_NOTE",
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

// Create context with initial state and dispatch function
const notesControllerContext = createContext(
  /** @type {ContextValue} */({
    state: initialState,
    dispatch: () => { },
  })
);

/**
 * Custom hook to use the NotesController context.
 * Throws an error if used outside the NotesControllerProvider.
 * @returns {ContextValue} The context value.
 */
export const useNotesControllerContext = () => {
  const context = useContext(notesControllerContext);
  if (!context) {
    throw new Error(
      "useNotesControllerContext must be used within a NotesControllerProvider"
    );
  }
  return context;
};

/**
 * NotesController component that provides an outlet for nested routes.
 * @returns {JSX.Element} The NotesController component.
 */
export default function NotesController() {
  const { createNote } = NotesLogic();

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
  const reducer = (state, action) => {
    switch (action.type) {
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


  /**
   * 
   * @param {{title: string, description: string,  priority: number }} payload 
   */
  const collectCreateNote = async (payload) => {
    try {
      const noteCreated = await createNote(payload);

      // Update state with the created note response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_NOTIFICATION,
        payload: noteCreated,
      });
    } catch (error) {
      setErrorToState(error)
    }
  }


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

  const closeAlert = () => {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: "", type: 0 },
    });
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
        case NOTES_CONTROLLER_ACTIONS.CREATE:
          await collectCreateNote(action?.payload);
          break;
        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();
          break;
        default:
          console.log(
            `NotesController: No action type found ${action.type}`
          );
          break;
      }
    } catch (error) {
      // Close loader in case of error
      closeLoader();
      setErrorToState(error);
      console.log(`NotesController: error ${error}`);
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
    <notesControllerContext.Provider value={contextValue}>
      {PreloaderComponent}
      <NotificationV3
        controllerContext={useNotesControllerContext}
      ></NotificationV3>
      <Outlet />
    </notesControllerContext.Provider>
  );
}
