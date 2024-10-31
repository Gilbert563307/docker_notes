/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import TasksCard from './TasksCard'
import "../../../assets/css/views/tasks/ListTasks.css";
import { SELECTED_TASK } from '../../../config';
/**
 * 
 * @param {Object} props 
 * @param {import("../../../controller/TasksController").Tasks} props.tasks
 * @returns {JSX.Element}  
 */
export default function ListTasks({ tasks }) {

    //try to get the cached selected task
    const cachedSelectedTask = sessionStorage.getItem(SELECTED_TASK);
    const [selectedTask, setselectedTask] = useState(
        cachedSelectedTask ? cachedSelectedTask : ""
    );

    //create function that will set the selected task to the state and session
    /**
     * 
     * @param {string} cardId 
     */
    const setSelectedCard = (cardId) => {
        setselectedTask(cardId);
        sessionStorage.setItem(SELECTED_TASK, cardId);
    }

    return (
        <div className='list-tasks'>
            {tasks.map((task) => {
                return <TasksCard
                    key={task.id}
                    taskId={task.id}
                    title={task.title}
                    priority={task.priority}
                    setSelectedCard={setSelectedCard}
                    selectedTask={selectedTask}
                />
            })}
        </div>
    )
}
