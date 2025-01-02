import React from 'react'
/**
 * @typedef {Object} Notification
 * @property {string} message 
 * @property {number} type 
 * 
 */

/**
 * @typedef {Object} User
 * @property {string} displayName 
 * @property {string} photoURL 
 * @property {string} token 
 * @property {string} [uid] 
 * @property {string} [email] 
 * 
 */

/**
 * @typedef {Object} Assignee
 * @property {string} name 
 * @property {string} assignee_id 
 * 
 */

/**
 * @typedef {Object} Reporter
 * @property {string} name - 
 * @property {string} assignee_id || TODO change to reporter_id in FUTURE
 * 
 */

/**
 * @typedef {Object} Task
 * @property {string} id - The unique identifier for the task.
 * @property {number} project_id - The unique identifier for the project.
 * @property {string} user_uid - The unique identifier for the user.
 * @property {string} title - The title of the task.
 * @property {string} description - The description of the task.
 * @property {number} status - The status of the task.
 * @property {number} priority - The priority level of the task.
 * @property {Assignee} assignee - The assignee of the task with name and unique identifier.
 * @property {Reporter} reporter - The reporter of the task with name and unique identifier.
 * @property {Boolean} archived - The archived status.
 * @property {number} created_at - The timestamp when the task was created.
 * @property {number} updated_at - The timestamp when the task was last updated.
 */

/**
 * @typedef {Object} createTaskPayload
 * @property {string} [id] - The unique identifier for the task.
 * @property {string} title - The title of the task.
 * @property {number} [project_id] - The unique identifier for the project.
 * @property {string} [description] - The description of the task.
 * @property {number} [status] - The status of the task.
 * @property {number} [priority] - The priority level of the task.
 * @property {Assignee} [assignee] - The assignee of the task with name and unique identifier.
 * @property {Reporter} [reporter] - The reporter of the task with name and unique identifier.
 * @property {Boolean} [archived] - The archived status.
 * @property {number} [created_at] - The timestamp when the task was created.
 * @property {number} [updated_at] - The timestamp when the task was last updated.
 */

/**
 * 
 * @typedef {Array<Task>} Tasks
 */
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
 * @property {Tasks} tasks
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
