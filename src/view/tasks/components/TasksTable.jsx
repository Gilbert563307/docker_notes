/* eslint-disable react/prop-types */
import React from 'react'
import TasksTableRow from './TasksTableRow'
import "../../../assets/css/views/tasks/TasksTable.css";
/**
 * 
 * @param {Object} props 
 * @param {import("../../../controller/TasksController").Tasks} props.tasks
 * @returns {JSX.Element}  
 */
export default function TasksTable({ tasks }) {

    /**
   * Represents the headers for a table.
   * Each header object contains the name of the column and an optional icon.
   * 
   * @type {Array<{ name: string, icon: string }>}
   */
    const headers = [
        { name: "#", icon: "" },
        { name: "Title", icon: <i className="fa-light fa-subtitles"></i> },
        { name: "Status", icon: <i className="fa-sharp fa-light fa-circle-arrow-right"></i> },
        { name: "Priority", icon: <i className="fa-sharp fa-light fa-list-timeline"></i> },
        { name: "Assignee", icon: <i className="fa-light fa-user"></i> },
        { name: "Due date", icon: <i className="fa-light fa-calendar-day"></i> },
        { name: "Labels", icon: <i className="fa-light fa-tags"></i> },
        { name: "Created", icon: <i className="fa-light fa-calendar-day"></i> },
        { name: "Updated", icon: <i className="fa-light fa-calendar-day"></i> },
        { name: "Reporter", icon: <i className="fa-light fa-user"></i> },
    ];


    return (
        <table className="table table-sm table-hover tasks-table">
            <thead>
                <tr className='tasks-table-tr-headers'>
                    {headers.map((header) => {
                        return <th scope="col" key={header.name}><span>{header.icon}</span> {header.name}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {tasks && tasks.length > 0 ? tasks.map((task, index) => <TasksTableRow key={task.id || index} task={task} />) : null}
            </tbody>
        </table>
    )
}
