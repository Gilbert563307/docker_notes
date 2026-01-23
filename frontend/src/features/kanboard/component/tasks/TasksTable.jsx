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
 * @returns {JSX.Element} The rendered TasksTable component.
 */
export default function TasksTable({ tasks }) {

    /**
     * Represents the headers for a table.
     * Each header object contains the name of the column and an optional icon.
     * 
     * @type {Array<{ name: string, icon: JSX.Element | string, className: string,}>}
     */
    const headers = [
        { name: "#", icon: "", className: "", },
        { name: "Title", icon: <i className="fa-light fa-subtitles"></i>, className: "", },
        { name: "Status", icon: <i className="fa-sharp fa-light fa-circle-arrow-right"></i>, className: "", },
        { name: "Priority", icon: <i className="fa-sharp fa-light fa-list-timeline"></i>, className: "", },
        { name: "Created", icon: <i className="fa-light fa-calendar-day"></i>, className: "created-at", },
        { name: "Updated", icon: <i className="fa-light fa-calendar-day"></i>, className: "updated-at", },
        { name: "Reporter", icon: <i className="fa-light fa-user"></i>, className: "", },
        { name: "Actions", icon: <i className="fa-light fa-gears"></i>, className: "", },
    ];

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
                                <TasksTableRow key={task.getId() || index} task={task} />
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
