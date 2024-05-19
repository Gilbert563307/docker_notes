/* eslint-disable react/prop-types */
import React from 'react'
import { useAuthProvider } from '../../../context/AuthProvider'
import useHtmlCssHelpers from '../../../helpers/useHtmlCssHelpers';

/**
 * Renders a single row in the tasks table.
 * 
 * @param {Object} props - The props object.
 * @param {import("../../../controller/TasksController").Task} props.task - The task object.
 * @returns {JSX.Element} A JSX element representing a single row in the tasks table.
 */
export default function TasksTableRow({ task }) {
    const { user } = useAuthProvider();
    const { getStatusBadge, getPriorityBadge } = useHtmlCssHelpers();

    /**
     * Generates the JSX element for the assignee.
     * 
     * @returns {JSX.Element} The JSX element representing the assignee.
     */
    const Assignee = (
        <span>
            <img
                src={user?.photoURL}
                alt="Logo"
                className="linked-user-logo d-inline-block align-text-top border rounded-pill"
            />{" "}
            {user.displayName}
        </span>
    );

    // Get status and priority badges
    const Status = getStatusBadge(task.status);
    const Priority = getPriorityBadge(task.priority);

    return (
        <tr>
            <th scope="row">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id={`task-${task.id}}`} />
                </div>
            </th>
            <td>{task.title}</td>
            <td>{Status}</td>
            <td>{Priority}</td>
            <td>{Assignee}</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
        </tr>
    )
}
