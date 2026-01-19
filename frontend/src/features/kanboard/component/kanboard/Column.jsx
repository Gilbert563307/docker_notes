/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import CreateCardButton from "./CreateCardButton";
import { TaskDto } from "../../application/dto/TaskDto";

/**
 *
 * @param {Object} props
 * @param {import("../../../../types/types").TaskBoardHeader} props.header
 * @param {Array<TaskDto>} props.content
 * @param {number} props.filter_on_status
 * @param {import('react').DragEventHandler<HTMLDivElement>} props.onDragEnter
 * @param {Function} props.handleDragStart
 * @returns {JSX.Element}
 */
export default function Column({ header, content = [], filter_on_status, onDragEnter, handleDragStart }) {
  // Filter items based on `filter_on_status` for display

  const filteredContent = getFilteredContent(filter_on_status);

  function getFilteredContent(statusToFilterOn) {
    if (content.length === 0) return [];
    return content.filter((item) => item.getStatus() === statusToFilterOn);
  }

  return (
    <div className="card-own" onDragEnter={onDragEnter}>
      <p className="card-parent-header">
        {header.name} <span className="badge rounded-pill text-bg-light">{filteredContent.length}</span>
      </p>

      <div className="card-body-own">
        <div className="board-tasks">
          {filteredContent.length > 0 ? (
            filteredContent.map((task) => {
              const id = task.getId();
              const readTaskUrl = `/tasks/read/${id}`;

              return (
                <div
                  key={id}
                  onDragStart={() => handleDragStart(id)}
                  draggable
                  className="board-card-item shadow-sm rounded"
                >
                  <Link
                    to={readTaskUrl}
                    title={task.getTitle()}
                    state={{ task: task }}
                    className="read-link board-card-title"
                  >
                    {task.getTitle()}
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
