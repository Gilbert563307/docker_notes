import React from 'react'


/**
 * @typedef {Object} Notification
 * @property {string} message 
 * @property {number} type 
 * 
 */

/**
 * @typedef {Object} Assignee
 * @property {string} name - 
 * @property {string} assignee 
 * 
 */


/**
 * @typedef {Object} Reporter
 * @property {string} name - 
 * @property {string} assignee 
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
 * @property {number} board_status - The status of the task on the board.
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
 * @property {number} [board_status] - The status of the task on the board.
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
 * @typedef {Object} ListTasks
 * @property {Tasks} tasks
 * @property {number} total
 * @property {number} pages
 */





export default function types() {
    return null;
}
