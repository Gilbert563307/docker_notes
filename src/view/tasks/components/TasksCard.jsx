/* eslint-disable react/prop-types */
import React from 'react'
import { useAuthProvider } from '../../../context/AuthProvider';

/**
 * TasksCard component displays a card with task information.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the task.
 * @param {string} props.taskId - The unique key for the card.
 * @param {Function} props.setSelectedCard - 
 * @param {string} props.setSelectedCard - The selected task id
 * @returns {JSX.Element} The rendered TasksCard component.
 */
export default function TasksCard({ title, taskId, priority, setSelectedCard, selectedTask }) {
    const { user } = useAuthProvider();

    const createdBy = `Created by: ${user.displayName}`;

    return (
        <button className={`card task-card ${selectedTask === taskId ? "selected-card" : null} `} onClick={() => setSelectedCard(taskId)}>
            <div className="card-body">
                <p className="card-title task-card-text">{title} <i className="fa-solid fa-pencil"></i> </p>
                <div className='task-card-content-section'>
                    <div></div>
                    <div><img src={user?.photoURL} alt="Logo" title={createdBy} className="linked-user-logo d-inline-block align-text-top border rounded-pill" /></div>
                </div>
            </div>
        </button>
    );
}
