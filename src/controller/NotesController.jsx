import React, { createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';

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
const NotesControllerContext = createContext(
  /** @type {ContextValue} */ ({
    state: initialState,
    dispatch: () => {},
  })
);

/**
 * Custom hook to use the NotesController context.
 * Throws an error if used outside the NotesControllerProvider.
 * @returns {ContextValue} The context value.
 */
export const useNotesControllerContext = () => {
  const context = useContext(NotesControllerContext);
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
  return (
    <div>
      <Outlet />
    </div>
  );
}
