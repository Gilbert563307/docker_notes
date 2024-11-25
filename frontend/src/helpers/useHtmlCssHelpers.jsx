import React from 'react';
import { TASKS_STATUS, TASKS_PRIORITY } from '../config';

/**
 * A custom hook that provides helper functions for generating HTML/CSS components.
 * 
 * @returns {Object} An object containing helper functions.
 */
export default function useHtmlCssHelpers() {
    /**
     * Returns a badge component based on the task status.
     *
     * @param {number} status - The status of the task.
     * @returns {JSX.Element} A span element with the appropriate badge class and text based on the status.
     */
    function getStatusBadge(status) {
        const statusBadgeMap = {
            [TASKS_STATUS.TODO]: <span className="badge badge-own rounded-pill badge-todo">To do</span>,
            [TASKS_STATUS.IN_PROGRESS]: <span className="badge badge-own  rounded-pill badge-inprogress">In progress</span>,
            [TASKS_STATUS.COMPLETED]: <span className="badge badge-own rounded-pill  badge-completed">Completed</span>,
        };

        return statusBadgeMap[status];
    }

    function getStatusButton(status) {
        const statusBadgeMap = {
            [TASKS_STATUS.TODO]: <span className="btn badge-todo">To do</span>,
            [TASKS_STATUS.IN_PROGRESS]: <span className="btn badge-inprogress">In progress</span>,
            [TASKS_STATUS.COMPLETED]: <span className="btn badge-completed ">Completed</span>,
        };

        return statusBadgeMap[status];
    }

    /**
     * Returns a badge component based on the task priority.
     *
     * @param {number} priority - The priority level of the task.
     * @returns {JSX.Element} A span element with the appropriate badge class and text based on the priority.
     */
    function getPriorityBadge(priority) {
        const priorityBadgeMap = {
            [TASKS_PRIORITY.LOW]: <span className="badge badge-own rounded-pill badge-low">Low</span>,
            [TASKS_PRIORITY.MEDIUM]: <span className="badge badge-own rounded-pill badge-medium">Medium</span>,
            [TASKS_PRIORITY.HIGH]: <span className="badge badge-own rounded-pill badge-high">High</span>,
        };

        return priorityBadgeMap[parseInt(priority)];
    }

    return { getStatusBadge, getPriorityBadge, getStatusButton };
}
