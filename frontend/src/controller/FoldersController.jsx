import React from 'react'
import { Outlet } from 'react-router-dom'


/**
 * @typedef {Object} InitialState
 * @property {import("../types/types").DriveFile | Object} file
 * @property { {files: import("../types/types").DriveFiles | [], total: number, pages: number} } files
 * @property {import("../types/types").Folders | [] } folders
 * @property {Object} notification - The notification object.
 * @property {string} notification.message - The notification message.
 * @property {number} notification.type - The notification type.
 */


/**
 * @type {InitialState}
 */
const initialState = {
  file: {},
  files: { files: [], total: 0, pages: 0 },
  folders: {folders: [], total: 0, pages: 0},
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
export const DRIVE_CONTROLLER_ACTIONS = {
  LIST: "LIST",
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  ARCHIVE: "ARCHIVE",
  DELETE: "DELETE",
  SEARCH_FOLDERS_BY_SEARCH_TERM: "SEARCH_FOLDERS_BY_SEARCH_TERM",
  SET_NOTIFICATION: "SET_NOTIFICATION,",
};


export default function FoldersController() {
  return (
   <Outlet />
  )
}
