import React from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/views/tasks/CollectReadTask.css";
import useHtmlCssHelpers from "../../helpers/useHtmlCssHelpers";
import QuilTextEditor from "../components/texteditor/QuilTextEditor";


export default function CollectReadTask() {
  let { state } = useLocation();

  const { getStatusButton } = useHtmlCssHelpers();

  if (state === null || state === undefined) {
    return (
      <>
        <p>No task found</p>
      </>
    );
  }

  /**
   * @type {import("../../types/types").Task}
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
            <label htmlFor="description" className="form-label ms-2">
              Description
            </label>
            <QuilTextEditor content={task.description} readOnly={true} />
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

          <div className="d-flex mt-2 border rounded">
            <div className="activity-header">
              <span className="show-header">Show:</span>
              <span className="badge dialogic-badge">History</span>
              <span className="badge dialogic-badge">Comments</span>
            </div>
            <div>

            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
