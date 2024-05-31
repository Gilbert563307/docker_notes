import React from "react";
import useSetPageTitleHook from "../../hooks/useSetPageTitleHook";
import "../../assets/css/views/tasks/CollectListTasks.css";
import useGetTasksHook from "../../hooks/useGetTasksHook";
import TasksTable from "./components/TasksTable";
import { Link } from "react-router-dom";

/**
 * CollectListTasks component
 *
 * This component renders a page for managing tasks . It includes a search bar,
 * a button to add a new task, and a modal for creating new tasks. The component
 * also sets the page title to "Tasks ".
 *
 * @returns {JSX.Element}
 */
export default function CollectListTasks() {
  useSetPageTitleHook({ title: "Tasks " });
  const { tasks, totalTasks, totalPages } = useGetTasksHook();

  return (
    <article className="tasks-article d-flex flex-column gap-1">
      <div className="tasks-header d-flex justify-content-between">
        <div className="">
          <input
            type="text"
            className="form-control"
            id="search_bar"
            placeholder="Search tasks...."
          />
        </div>
        <div>
          <Link
            aria-describedby="create task button"
            className="add-task-button"
            to="/tasks/create"
          >
            Create
          </Link>
        </div>
      </div>

      <div className="tasks-content table-responsive">
        <TasksTable
          tasks={tasks}
          totalTasks={totalTasks}
          totalPages={totalPages}
        />
      </div>
    </article>
  );
}
