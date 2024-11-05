/* eslint-disable react/prop-types */
import React from 'react'
import StatusButtonComponent from '../../components/custom/StatusButtonComponent'
import PriorityButtonComponent from '../../components/custom/PriorityButtonComponent'

/**
 * TaskDetails component displays detailed information about a task.
 * 
 * @param {Object} props - The component props.
 * @param {import("../../../types/types").Task} props.task - The task object containing task details.
 * @param {import("../../../types/types").customFieldsPayload} props.customFields - The task object containing task details.
 * @param {function} props.setStatus - Callback function to update the task status.
 * @param {function} props.setPriority - Callback function to update the task priority.
 * @returns {JSX.Element} A component displaying task details.
 */
export default function TaskDetails({ task, customFields, setStatus, setPriority }) {
    return (
        <div className="tasks-deatils-div border rounded">
            <div className="tasks-deatils-div-details-header">
                <h6>Details</h6>
            </div>
            <hr className="bg-body-secondary"></hr>
            <div className="details-table">
                <div className="details-div">
                    <p className="fw-medium">Project</p>
                    <p>{task?.project_id}</p>
                </div>
                <div className="details-div">
                    <p className="fw-medium">Assignee</p>
                    <p>{task?.assignee.name}</p>
                </div>
                <div className="details-div">
                    <p className="fw-medium">Reporter</p>
                    <p>{task?.reporter.name}</p>
                </div>
                <div className="details-div">
                    <p className="fw-medium">Status</p>
                    <StatusButtonComponent taskStatus={customFields?.status} callBackFn={setStatus} />
                </div>
                <div className="details-div">
                    <p className="fw-medium">Priority</p>
                    <PriorityButtonComponent priorityStatus={customFields?.priority} callBackFn={setPriority} />
                </div>
            </div>
        </div>
    )
}