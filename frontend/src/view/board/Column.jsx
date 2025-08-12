import React from "react";
import { Link } from "react-router-dom";
import CreateCardButton from "./CreateCardButton";

/**
 *
 * @param {Object} props
 * @param {import("../../types/types").TaskBoardHeader} props.header
 * @param {import("../../types/types").Tasks | []} props.content
 * @param {number} props.filter_on_status
 * @param {import('react').DragEventHandler<HTMLDivElement>} props.onDragEnter
 * @param {Function} props.handleDragStart
 * @returns {JSX.Element}
 */
export default function Column({
  header,
  content = [],
  filter_on_status,
  onDragEnter,
  handleDragStart,
}) {
  // Filter items based on `filter_on_status` for display
  /**
   * @type {import("../../types/types").Tasks}
   */
  const filteredContent = content.filter(
    (item) => item.status === filter_on_status
  );

  return (
    <div className="card-own" onDragEnter={onDragEnter}>
      <p className="card-parent-header">
        {header.name}{" "}
        <span className="badge rounded-pill text-bg-light">{filteredContent.length}</span>
      </p>

      <div className="card-body-own">
        <div className="board-tasks">
          {filteredContent.length > 0 ? (
            filteredContent.map((task) => {
              const readTaskUrl = `/tasks/read/${task.id}`;

              return (
                <div
                  key={task.id}
                  onDragStart={() => handleDragStart(task.id)}
                  draggable
                  className="board-card-item shadow-sm rounded"
                >
                  <Link
                    to={readTaskUrl}
                    title={task.title}
                    state={{ task: task }}
                    className="read-link board-card-title"
                  >
                    {task.title}
                  </Link>
                  {/* TODO */}
                  {/* <div className="board-card-information">
                    <span className="badge text-bg-light">
                      {task.created_at.toLocaleString()}
                    </span>
                  </div> */}
                </div>
              );
            })
          ) : (
            <p className="empty-column-message">No tasks available</p>
          )}
        </div>
      </div>

      <CreateCardButton header={header} />
    </div>
  );
}
