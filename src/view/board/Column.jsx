import React from 'react';
import BS5TruncateSpan from '../components/bs5/BS5TruncateSpan';
import { Link } from 'react-router-dom';

export default function Column({
  header,
  content = [],
  filter_on_status,
  onDragEnter,
  handleDragStart
}) {
  // Filter items based on `filter_on_status` for display
  const filteredContent = content.filter((item) => item.board_status === filter_on_status);

  return (
    <div className="card-own" onDragEnter={onDragEnter}>
      <p className="card-parent-header">{header}</p>

      <div className="card-body-own">
        <div className="board-tasks">
          {filteredContent.length > 0 ? (
            filteredContent.map(( task ) => {
              const readTaskUrl = `/tasks/read/${task.id}`;

              return <div
                key={task.id}
                onDragStart={() => handleDragStart(task.id)}
                draggable
                className="board-card-item shadow-sm rounded"
              >
                <BS5TruncateSpan
                  content={<Link to={readTaskUrl} state={{ task: task }} className="read-link">
                    {task.title}
                  </Link>}
                  maxWidthToSet="240px"
                />
              </div>
            })
          ) : (
            <p className="empty-column-message">No tasks available</p>
          )}
        </div>
      </div>

      <button className="add-card-btn rounded" aria-label={`Add card to ${header}`}>
        <div className="button-card-content">
          <i className="fa-regular fa-plus"></i>
          <span>Add a card</span>
        </div>
      </button>
    </div>
  );
}

