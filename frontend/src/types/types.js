import React from 'react'
import { TaskDto } from '../features/kanboard/application/dto/TaskDto';

//TODO change to reporter_id in FUTURE


/**
 * 
 * @typedef {Object} customFieldsPayload
 * @property {number} status
 * @property {number} priority
 * @property {string} description
 * 
 */

/**
 * 
 * @typedef {Object} ListTasks
 * @property {Array<TaskDto>} tasks
 * @property {number} total
 * @property {number} pages
 */


/**
 * @typedef {Object} TaskBoardHeader
 * @property {number} id
 * @property {string} name
 * @property {number} status
 */

/**
 * 
 * @typedef {Array<TaskBoardHeader>} TaskBoardHeaders 
 */

/**
 * @typedef {Object} DriveFile
 * @property {string} id
 * @property {string} name
 * @property {string} folder_id
 * @property {number} size
 * @property {string} type
 * @property {boolean} archived
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Folder
 * @property {string} id
 * @property {string} user_uid
 * @property {string} name
 * @property {string} color
 * @property {boolean} archived
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * 
 * @typedef {Array<DriveFile>} DriveFiles 
 */

/**
 * 
 * @typedef {Array<Folder>} Folders 
 */

/**
 * 
 * @typedef {Object} Session 
 * @property {string} [id] 
 * @property {string} user_uid 
 * @property {string} token 
 * @property {string | any} expire_date 
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * 
 * @typedef {Array<Session>} Sessions
 */


/**
 * 
 * @typedef {Object} FilesResponse
 * @property {DriveFiles} files
 * @property {number} total
 * @property {number} pages
 */




export default function types() {
    return null;
}
