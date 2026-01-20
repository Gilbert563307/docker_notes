/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import useHtmlCssHelpers from "../../../../shared/helpers/useHtmlCssHelpers";
import { useAuthProvider } from "../../../../shared/context/AuthProvider";
import BS5TruncateSpan from "../../../../shared/components/bs5/BS5TruncateSpan";
import ArchiveTaskButton from "./buttons/ArchiveTaskButton";
import { TaskDto } from "../../application/dto/TaskDto";

/**
 * Renders a single row in the tasks table.
 *
 * @param {Object} props - The props object.
 * @param {TaskDto} props.task - The task object.
 * @returns {JSX.Element} A JSX element representing a single row in the tasks table.
 */
export default function TasksTableRow({ task }) {

  /**
   * @type {import("../../../../shared/context/AuthProvider").AuthContextType}
   */
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
  const Status = getStatusBadge(task.getStatus());
  const Priority = getPriorityBadge(task.getPriority());

  const readTaskUrl = `/tasks/read/${task.getId()}`;
  return (
    <tr className="tasks-table-row">
      <th scope="row">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" disabled={true} />
        </div>
      </th>
      <td>
        <BS5TruncateSpan
          title={task.getTitle()}
          content={
            <Link
              to={readTaskUrl}
              state={{ task: task }}
              title={task.getTitle()}
              className="read-link"
            >
              {task.getTitle()}
            </Link>
          }
          maxWidthToSet="350px"
        />
      </td>
      <td>{Status}</td>
      <td>{Priority}</td>
      {/* <td>{Assignee}</td> */}
      {/* <td>...</td> */}
      {/* <td>...</td> */}
      <td>{task.getUserLocaleCreatedAt()}</td>
      <td>{task.getUserLocaleUpdatedAt()}</td>
      <td>{Assignee}</td>
      <td className="main-table-actions">
        <button>
          <Link to={readTaskUrl} state={{ task: task }}>
            <i className="fa-light fa-magnifying-glass"></i>
          </Link>
        </button>
        <button>
          <Link to={`/tasks/update/${task.getId()}`}>
            <i className="fa-sharp fa-light fa-pencil"></i>
          </Link>
        </button>
        <ArchiveTaskButton task={task} isArchived={task.getIsArchived()} />
      </td>
    </tr>
  );
}
