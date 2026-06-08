import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/CollectReadTask.css";
import useHtmlCssHelpers from "../../shared/helpers/useHtmlCssHelpers";
import QuilTextEditor from "../../shared/presentation/components/texteditor/component/QuilTextEditor";
import useGetTaskHook from "../../shared/hooks/useGetTaskHook";

export default function CollectReadTask() {
  const { task, state } = useGetTaskHook();

  const { getStatusButton } = useHtmlCssHelpers();

  return (
    <article className="read-task">
      <div className="read-task-title-div">
        <p className="fs-1 task-title">{task.getTitle()}</p>
      </div>
      <div className="read-task-div">
        <div className="read-task-description-parent">
          <div>
            <label htmlFor="description" className="form-label ms-2">
              Description
            </label>
            <QuilTextEditor content={task.getDescription()} readOnly={true} />
          </div>
        </div>
        <div>
          <div className="read-task-actions">
            <div>{getStatusButton(task.getStatus())}</div>
            <div>
              <Link to={`/tasks/update/${task.getId()}`}>
                <i className="fa-solid fa-pencil"></i> Change
              </Link>
            </div>
          </div>

          <div className="tasks-deatils-div border rounded">
            <div className="tasks-deatils-div-details-header">
              <h6>Details</h6>
            </div>
            <hr className="bg-body-secondary"></hr>

            <div className="details-table">
              <div className="details-div">
                <p className="fw-medium">Project</p>
                <p>{task.getProjectId()}</p>
              </div>
              <div className="details-div">
                <p className="fw-medium">Assignee</p>
                <p>{task.getAssigneeName()}</p>
              </div>
              <div className="details-div">
                <p className="fw-medium">Reporter</p>
                <p>{task.getReporterName()}</p>
              </div>
            </div>
          </div>

          <div className="d-flex mt-2 border rounded">
            <div className="activity-header">
              <span className="show-header">Show</span>
              <span className="badge dialogic-badge">History</span>
              {/* think bout what to show of the tasks */}
              {/* <span className="badge dialogic-badge">Comments</span> */}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </article>
  );
}
