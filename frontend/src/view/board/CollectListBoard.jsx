import React, { useEffect, useState, useCallback, useRef } from "react";
import "../../assets/css/views/board/CollectListBoard.css";
import Column from "./Column";
import useSetPageTitleHook from "../../hooks/useSetPageTitleHook";
import useGetBoardTasksHook from "../../hooks/useGetBoardTasksHook";
import { TASKS_BOARD_HEADERS } from "../../config";
import { BOARD_CONTROLLER_ACTIONS } from "../../controller/BoardsController";

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
   * Updates a task in the board state.
   *
   * @param {import("../../types/types").Task} payload - The task object to update.
   */
  const updateTask = useCallback(
    (payload) => {
      dispatch({ type: BOARD_CONTROLLER_ACTIONS.UPDATE, payload });
    },
    [dispatch]
  );

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

  // Ref to store the timeout ID for cleanup
  const timeoutRef = useRef(null);

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
  const handleDragEnter = useCallback(
    (newStatus) => {
      const oldStatus = items.find(
        (item) => item.id === draggingId
      )?.status;

      setItems((prevItems) =>
        prevItems.map((item) => {
          // Check if the current item is the one being dragged
          if (item.id === draggingId) {
            // Return the updated item with new status
            return { ...item, status: newStatus };
          }
          // Return the unchanged item
          return item;
        })
      );

      // Clear any existing timeout to prevent duplicate calls
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      //return ealry if the status is the same
      if (newStatus === oldStatus) return;

      // Create a task update payload with the dragged item and new status
      const updatedTask = { id: draggingId, status: newStatus };

      // Set a new timeout to call updateTask with the updated task
      timeoutRef.current = setTimeout(() => {
        updateTask(updatedTask);
      }, 1000);

      // Cleanup timeout on unmount
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    },
    [draggingId, updateTask]
  ); // Dependencies needed for handleDragEnter

  return (
    <div className="main-board">
      <div className="main-columns">
        {TASKS_BOARD_HEADERS.map((header) => (
          <Column
            key={header.id}
            header={header}
            content={items}
            onDragEnter={() => handleDragEnter(header.status)}
            handleDragStart={handleDragStart}
            filter_on_status={header.status}
          />
        ))}
      </div>
    </div>
  );
}
