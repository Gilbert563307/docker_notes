import React from 'react'
import { TaskDto } from '../features/kanboard/application/dto/TaskDto';
import { DriveFileDto } from '../features/drive/domain/dto/DriveFileDto';

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
 * @typedef {Array<Folder>} Folders 
 */

/**
 * 
 * @typedef {Object} FilesResponse
 * @property {Array<DriveFileDto>} files
 * @property {number} total
 * @property {number} pages
 */

export default function types() {
    return null;
}
