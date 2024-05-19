/* eslint-disable react/prop-types */
import React from 'react'
import { useAuthProvider } from '../../../context/AuthProvider'
import useHtmlCssHelpers from '../../../helpers/useHtmlCssHelpers';

/**
 * 
 * @param {Object} props 
 * @param {import("../../../controller/TasksController").Task} props.task
 * @returns {JSX.Element}  
 */
export default function TasksTableRow({ task }) {
    const { user } = useAuthProvider();
    const { getStatusBadge, getPriorityBadge } = useHtmlCssHelpers();
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

    const Status = getStatusBadge(task.status);
    const Priority = getPriorityBadge(task.priority);
    return (
        <tr>
            <th scope="row"><div className="form-check">
                <input className="form-check-input" type="checkbox" id={`task-${task.id}}`} />
            </div></th>
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
