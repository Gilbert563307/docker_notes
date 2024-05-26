/* eslint-disable react/prop-types */
import React from 'react'
import TasksTableRow from './TasksTableRow'
import "../../../assets/css/views/tasks/TasksTable.css";
import BS5PaginationV2 from '../../components/bs5/BS5PaginationV2';

/**
 * Component representing a table of tasks.
 * 
 * @param {Object} props - The properties object.
 * @param {import("../../../controller/TasksController").Task[]} props.tasks - The array of tasks to display.
 * @param {number} props.totalTasks - The total number of tasks.
 * @param {number} props.totalPages - The total number of pages.
 * @param {Function} props.createOnclick - The function to handle the create button click event.
 * @returns {JSX.Element} The rendered TasksTable component.
 */
export default function TasksTable({ tasks, totalTasks, totalPages, createOnclick }) {

    /**
     * Represents the headers for a table.
     * Each header object contains the name of the column and an optional icon.
     * 
     * @type {Array<{ name: string, icon: JSX.Element }>}
     */
    const headers = [
        { name: "#", icon: "" },
        { name: "Title", icon: <i className="fa-light fa-subtitles"></i> },
        { name: "Status", icon: <i className="fa-sharp fa-light fa-circle-arrow-right"></i> },
        { name: "Priority", icon: <i className="fa-sharp fa-light fa-list-timeline"></i> },
        // { name: "Assignee", icon: <i className="fa-light fa-user"></i> },
        // { name: "Due date", icon: <i className="fa-light fa-calendar-day"></i> },
        // { name: "Labels", icon: <i className="fa-light fa-tags"></i> },
        { name: "Created", icon: <i className="fa-light fa-calendar-day"></i> },
        { name: "Updated", icon: <i className="fa-light fa-calendar-day"></i> },
        { name: "Reporter", icon: <i className="fa-light fa-user"></i> },
    ];

    return (
        <div>
            <table className='table table-sm table-hover tasks-table'>
                <thead>
                    <tr className='tasks-table-tr-headers'>
                        {headers.map((header) => {
                            return <th scope="col" className="px-6 py-3" key={header.name}><span>{header.icon}</span> {header.name}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {tasks && tasks.length > 0 && tasks.map((task, index) => (
                        <TasksTableRow key={task.id || index} task={task} />
                    ))}
                    {tasks && tasks.length === 0 && (
                        <tr><td>No tasks available</td></tr>
                    )}
                </tbody>
            </table>
            <div className='table-add-task-div'>
                <button onClick={createOnclick} className='table-add-task-btn'><i className="fa-thin fa-plus" style={{ color: "black" }}></i> Create</button>
            </div>
            <BS5PaginationV2 totalItems={totalTasks} totalPages={totalPages} />
        </div>
    )
}
