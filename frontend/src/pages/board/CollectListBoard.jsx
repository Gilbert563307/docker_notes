import React, { useEffect, useState, useCallback, useRef } from "react";
import "./css/CollectListBoard.css";
import Column from "../../features/kanboard/component/kanboard/Column";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import useGetBoardTasksHook from "../../shared/hooks/useGetBoardTasksHook";
import { TASKS_BOARD_HEADERS } from "../../config";
import { BOARD_CONTROLLER_ACTIONS } from "../../features/kanboard/presentation/BoardsController";
import { useParams } from "react-router-dom";
import { TaskDto } from "../../features/kanboard/application/dto/TaskDto";
import { UpdateBoardTaskDto } from "../../features/kanboard/presentation/dto/UpdateBoardTaskDto";
/**
 * CollectListBoard component displays a board with columns to organize tasks.
 * Manages drag-and-drop functionality to update task statuses across columns.
 *
 * @component
 * @returns {import("react").JSX.Element}
 */
export default function CollectListBoard() {
  useSetPageTitleHook({ title: "Board" });
  const { boardId } = useParams();

  const { tasks, dispatch } = useGetBoardTasksHook({ boardId: boardId });

  /**
   * Updates a task in the board state.
   *
   * @param {TaskDto} payload - The task object to update.
   */
  const updateTask = useCallback(
    (payload) => {
      dispatch({ type: BOARD_CONTROLLER_ACTIONS.UPDATE, payload: new UpdateBoardTaskDto(payload, boardId) });
    },
    [dispatch],
  );

  const [draggingId, setDraggingId] = useState();
  const [items, setItems] = useState([]);

  // Ref to store the timeout ID for cleanup
  const timeoutRef = useRef(null);

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
      const oldStatus = items.find((/** @type {TaskDto} */ item) => item.getId() === draggingId)?.getStatus();

      let tbuTask = null;
      // @ts-ignore
      setItems((prevItems) =>
        prevItems.map((/** @type {TaskDto} */ item) => {
          // // Check if the current item is the one being dragged
          if (item.getId() === draggingId) {
            // Return the updated item with new status
            const taskDto = new TaskDto.Builder()
              .id(item.getId())
              .projectId(item.getProjectId())
              .userUid(item.getUserUid())
              .title(item.getTitle())
              .description(item.getDescription())
              .status(newStatus)
              .setPriority(item.getPriority())
              .assignee(item.getAssignee())
              .reporter(item.getReporter())
              .archived(item.getIsArchived())
              .projectName(item.getProjectName())
              .createdAt(item.getCreatedAt())
              .updatedAt(item.getUpdatedAt())
              .build();
            tbuTask = taskDto;
            return taskDto;
          }
          // Return the unchanged item
          return item;
        }),
      );

      // Clear any existing timeout to prevent duplicate calls
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      //return ealry if the status is the same
      if (newStatus === oldStatus) return;

      // Set a new timeout to call updateTask with the updated task
      timeoutRef.current = setTimeout(() => {
        updateTask(tbuTask);
      }, 1000);

      // Cleanup timeout on unmount
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    },
    [draggingId, updateTask],
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
