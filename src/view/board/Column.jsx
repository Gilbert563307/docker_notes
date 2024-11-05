import React from 'react';
import BS5TruncateSpan from '../components/bs5/BS5TruncateSpan';
import { Link } from 'react-router-dom';
import CreateCardButton from './CreateCardButton';

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
      <p className="card-parent-header">{header.name}</p>

      <div className="card-body-own">
        <div className="board-tasks">
          {filteredContent.length > 0 ? (
            filteredContent.map((task) => {
              const readTaskUrl = `/tasks/read/${task.id}`;

              return <div
                key={task.id}
                onDragStart={() => handleDragStart(task.id)}
                draggable
                className="board-card-item shadow-sm rounded"
              >
                <Link to={readTaskUrl} title={task.title} state={{ task: task }} className="read-link board-card-title">
                  {task.title}
                </Link>
              </div>
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

