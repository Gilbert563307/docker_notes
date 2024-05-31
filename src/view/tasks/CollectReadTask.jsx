import { MDXEditor } from "@mdxeditor/editor";
import React from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/views/tasks/CollectReadTask.css";
import useHtmlCssHelpers from "../../helpers/useHtmlCssHelpers";
// import '@mdxeditor/editor/style.css'

export default function CollectReadTask() {
  let { state } = useLocation();

  if (state === null || state === undefined) {
    return (
      <>
        <p>No task found</p>
      </>
    );
  }

  const { getStatusButton } = useHtmlCssHelpers();

  /**
   * @type {import("../../controller/TasksController").Task}
   */
  const task = state?.task;

  return (
    <article className="read-task">
      <div className="read-task-title-div">
        <p className="fs-1 task-title">{task.title}</p>
      </div>
      <div className="read-task-div">
        <div>
          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <MDXEditor readOnly={true} markdown={task.description}></MDXEditor>
          </div>
        </div>
        <div>
          <div>{getStatusButton(task.status)}</div>

          <div className="tasks-deatils-div border rounded">
            <div className="tasks-deatils-div-details-header">
              <h6>Details</h6>
            </div>
            <hr className="bg-body-secondary"></hr>

            <div className="details-table">
              <div className="details-div">
                <p className="fw-medium">Project</p>
                <p>{task.project_id}</p>
              </div>
              <div className="details-div">
                <p className="fw-medium">Assignee</p>
                <p>{task.assignee.name}</p>
              </div>
              <div className="details-div">
                <p className="fw-medium">Reporter</p>
                <p>{task.reporter.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
