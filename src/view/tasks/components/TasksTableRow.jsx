/* eslint-disable react/prop-types */
import React from "react";
import { useAuthProvider } from "../../../context/AuthProvider";
import useHtmlCssHelpers from "../../../helpers/useHtmlCssHelpers";
import { Link } from "react-router-dom";

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

  const readProfileUrl = `/tasks/read/${task.id}`;
  return (
    <tr>
      <th scope="row">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`task-${task.id}}`}
          />
        </div>
      </th>
      <td>
        <Link to={readProfileUrl} state={{ task: task }} className="read-link">
          {task.title}
        </Link>{" "}
      </td>
      <td>{Status}</td>
      <td>{Priority}</td>
      {/* <td>{Assignee}</td> */}
      {/* <td>...</td> */}
      {/* <td>...</td> */}
      <td>{task.created_at.toLocaleString()}</td>
      <td>{task.updated_at.toLocaleString()}</td>
      <td>{Assignee}</td>
      <td className="tasks-table-actions">
        <button>
          <Link to={readProfileUrl} state={{ task: task }}>
            <i className="fa-light fa-magnifying-glass"></i>
          </Link>
        </button>
        <button>
          <Link to={`/tasks/update/${task.id}`} state={{ task: task }}>
            <i className="fa-sharp fa-light fa-pencil"></i>
          </Link>
        </button>
        <button>
          <i className="fa-light fa-box-archive"></i>
        </button>
      </td>
    </tr>
  );
}
