import React, { useState } from "react";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import "./css/CollectListTasks.css";
import useGetTasksHook from "../../shared/hooks/useGetTasksHook";
import { Link } from "react-router-dom";
import TasksTable from "../../features/kanboard/component/tasks/TasksTable";
import TasksSearchBar from "../../features/kanboard/component/tasks/TasksSearchBar";
import FilterTasksButton from "../../features/kanboard/component/tasks/buttons/FilterTasksButton";
import DeleteMultipleButton from "../../features/kanboard/component/tasks/buttons/DeleteMultipleButton";
import SimplePagination from "../../shared/features/simplePagination/presentation/components/SimplePagination";

/**
 * CollectListTasks component
 *
 * This component renders a page for managing tasks . It includes a search bar,
 * a button to add a new task, and a modal for creating new tasks. The component
 * also sets the page title to "Tasks ".
 *
 * @returns {import("react").JSX.Element}
 */
export default function CollectListTasks() {
  useSetPageTitleHook({ title: "Tasks " });
  const { tasks, totalTasks, totalPages } = useGetTasksHook();
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Map());

  /**
   *
   * @param {string} taskId
   * @returns {void}
   */
  function addTaskId(taskId) {
    const clonedMap = new Map(selectedTaskIds);
    const found = clonedMap.get(taskId);
    if (!found) {
      clonedMap.set(taskId, true);
      setSelectedTaskIds(clonedMap);
      return;
    }
    clonedMap.set(taskId, false);
    setSelectedTaskIds(clonedMap);
  }

  function resetSelectedTasks() {
    setSelectedTaskIds(new Map());
  }

  return (
    <article className="tasks-article d-flex flex-column gap-1">
      <div className="tasks-header d-flex justify-content-between">
        <div className="">
          <TasksSearchBar></TasksSearchBar>
        </div>
        <div className="tasks-article-buttons">
          <div>
            <FilterTasksButton />
          </div>
          <div>
            <Link aria-describedby="create task button" className="add-task-button task-btn-plain " to="/tasks/create">
              Create
            </Link>
          </div>
          <div>
            {selectedTaskIds.size > 0 ? (
              <DeleteMultipleButton resetSelectedTasks={resetSelectedTasks} mapIdsToDelete={selectedTaskIds} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="tasks-content table-responsive">
        <TasksTable tasks={tasks} selectedTaskIds={selectedTaskIds} addTaskId={addTaskId} />
        <SimplePagination totalItems={totalTasks} totalPages={totalPages} />
      </div>
    </article>
  );
}
