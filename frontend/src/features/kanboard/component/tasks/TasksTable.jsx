/* eslint-disable react/prop-types */
import React from 'react'
import TasksTableRow from './TasksTableRow'
import "../../css/TasksTable.css";
import { Link } from 'react-router-dom';
import { Show } from '../../../../shared/presentation/components/custom/Show';
import { TaskDto } from '../../application/dto/TaskDto';


/**
 * Component representing a table of tasks.
 * 
 * @param {Object} props - The properties object.
 * @param {Array<TaskDto>} props.tasks - The array of tasks to display.
 * @param {Map<string, boolean>} props.selectedTaskIds 
 * @param {Function} props.addTaskId 
 * @returns {JSX.Element} The rendered TasksTable component.
 */
export default function TasksTable({ tasks, selectedTaskIds, addTaskId }) {

    /**
     * Represents the headers for a table.
     * Each header object contains the name of the column and an optional icon.
     * 
     * @type {Array<{ name: string, icon: JSX.Element | string, className: string,}>}
     */
    const headers = [
        { name: "#", icon: "", className: "", },
        { name: "Title", icon: <i className="fa-solid fa-heading"></i>, className: "", },
        { name: "Status", icon: <i className="fa-solid fa-bars-progress"></i>, className: "", },
        { name: "Priority", icon: <i className="fa-solid fa-bars-staggered"></i>, className: "", },
        { name: "Created", icon: <i className="fa-solid fa-calendar"></i>, className: "created-at", },
        { name: "Updated", icon: <i className="fa-solid fa-calendar"></i>, className: "updated-at", },
        { name: "Reporter", icon: <i className="fa-solid fa-user"></i>, className: "", },
        { name: "Actions", icon: <i className="fa-solid fa-ellipsis"></i>, className: "", },
    ];

    /**
     * 
     * @param {string} taskId 
     */
    function isTaskSelected(taskId){
        return selectedTaskIds.get(taskId);
    }

    return (
        <div>
            <Show>
                <Show.When isTrue={tasks && tasks.length === 0}>
                    <div>No tasks available</div>
                </Show.When>
                <Show.When isTrue={tasks && tasks.length > 0}>
                    <table className="table table-sm tasks-table table-striped">
                        <thead>
                            <tr className="tasks-table-tr-headers">
                                {headers.map((header) => {
                                    return <th scope="col" className={`${header.className} px-6 py-3`} key={header.name} >
                                        <span>{header.icon}</span> {header.name}
                                    </th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {tasks && tasks.length > 0 && tasks.map((task, index) => (
                                <TasksTableRow addTaskId={addTaskId} selected={isTaskSelected(task.getId())}  key={task.getId() || index} task={task} />
                            ))}
                        </tbody>
                    </table>
                    <div className="table-add-task-div">
                        <Link className="table-add-task-btn" to="/tasks/create">
                            <i className="fa-thin fa-plus" style={{ color: "black" }}></i> Create
                        </Link>
                    </div>
                </Show.When>
                <Show.Else>
                    <div>Something went wrong!</div>
                </Show.Else>
            </Show>
        </div>
    );
}
