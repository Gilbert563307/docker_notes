/* eslint-disable react/prop-types */
import React from "react";
import { useAuthProvider } from "../../../context/AuthProvider";
import useHtmlCssHelpers from "../../../helpers/useHtmlCssHelpers";
import { Link } from "react-router-dom";
import ArchiveTaskButton from "./buttons/ArchiveTaskButton";
import BS5TruncateSpan from "../../components/bs5/BS5TruncateSpan";

/**
 * Renders a single row in the tasks table.
 *
 * @param {Object} props - The props object.
 * @param {import("../../../types/types").Task} props.task - The task object.
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

  const readTaskUrl = `/tasks/read/${task.id}`;
  return (
    <tr className="tasks-table-row">
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
        <BS5TruncateSpan
          content={<Link to={readTaskUrl} state={{ task: task }}  title={task.title} className="read-link">
            {task.title}
          </Link>}
          maxWidthToSet="100px"
        />
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
          <Link to={readTaskUrl} state={{ task: task }}>
            <i className="fa-light fa-magnifying-glass"></i>
          </Link>
        </button>
        <button>
          <Link to={`/tasks/update/${task.id}`}>
            <i className="fa-sharp fa-light fa-pencil"></i>
          </Link>
        </button>
        <ArchiveTaskButton taskId={task.id} isArchived={task.archived}/>
      </td>
    </tr>
  );
}
