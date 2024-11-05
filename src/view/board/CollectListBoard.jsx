import React, { useEffect, useState } from 'react'
import "../../assets/css/views/board/CollectListBoard.css"
import Column from './Column'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook';
import useGetBoardTasksHook from '../../hooks/useGetBoardTasksHook';
import { TASKS_BOARD_HEADERS } from '../../config';
import { BOARD_CONTROLLER_ACTIONS } from '../../controller/BoardsController';


/**
 * CollectListBoard component displays a board with columns to organize tasks.
 * Manages drag-and-drop functionality to update task statuses across columns.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function CollectListBoard() {
  useSetPageTitleHook({ title: "Board" });
  const { tasks, dispatch } = useGetBoardTasksHook();

  /**
  * @type {string}
  * Stores the ID of the currently dragged item.
  */
  const [draggingId, setDraggingId] = useState();

  /**
  * @type {import("../../types/types").Tasks}
  * Contains the list of task items. Each task has an `id`, `title`, and `status`.
  */
  const [items, setItems] = useState([]);

  // Sync `items` with `tasks` when `tasks` is updated
  useEffect(() => {
    if (Array.isArray(tasks) && tasks.length > 0) {
      setItems(tasks);
    }
  }, [tasks]);


  /**
  * Handles the start of a drag operation and stores the dragged item's ID.
  *
  * @param {string} id - The ID of the task being dragged.
  */
  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  /**
 * Updates the status of the dragged item when dropped into a new column.
 *
 * @param {number} newStatus - The new status of the dragged item.
 */
  const handleDragEnter = (newStatus) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        // Check if the current item is the one being dragged
        if (item.id === draggingId) {
          // Create a new item with the updated status
          const updatedItem = { ...item, status: newStatus };

          // Return the updated item
          return updatedItem;
        }
        // Return the unchanged item
        return item;
      })
    );
    const task = items.find((item) => item.id === draggingId);
    if (task === undefined) return;
    // Call updateTask with the updated item
    setTimeout(function () {
      updateTask(task);
    }, 1000);

  };


  /**
   * Updates a task in the board state.
   *
   * @param {import("../../types/types").Task} payload - The task object to update.
   */
  const updateTask = (payload) => {
    dispatch({ type: BOARD_CONTROLLER_ACTIONS.UPDATE, payload: payload });
  };

  return (
    <div className="main-board">
      <div className="main-columns">
        {TASKS_BOARD_HEADERS.map((header) => {
          return <Column
            key={header.id}
            header={header}
            content={items}
            onDragEnter={() => handleDragEnter(header.status)}
            handleDragStart={handleDragStart}
            filter_on_status={header.status}
          />
        })}
      </div>
    </div>
  );

}