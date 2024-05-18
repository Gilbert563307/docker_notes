import React from 'react'
import { useForm } from "react-hook-form";
import { TASKS_PRIORITY } from '../../../config';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../../controller/TasksController';

/**
 * TasksCreateTaskComponent
 * 
 * This component provides a form for creating a new task. It uses react-hook-form for form handling
 * and validation, and dispatches actions to the TasksController context to manage the state of tasks.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.closeModal - A function to close the modal.
 * @returns {JSX.Element} The rendered component.
 */
export default function TasksCreateTaskComponent({ closeModal }) {
    const { dispatch } = useTasksControllerContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        closeModal();
        reset();
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.CREATE, payload: data });
    };

    return (
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-12">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    type="text"
                    className={`form-control ${errors.name && errors.name.type ? "is-invalid" : ""
                        }`}
                    id="title"
                    aria-describedby="Title name"
                    placeholder="Text field for the title"
                    maxLength={255}
                    {...register("title", {
                        required: "The title cannot be empty",
                        minLength: {
                            value: 4,
                            message: "The title must longer than 4 character",
                        },
                        maxLength: {
                            value: 255,
                            message: "The title cannot be longer than 255 characters",
                        },
                    })}
                />
                {errors.title && (
                    <div className="invalid-feedback d-block">{errors.title.message}</div>
                )}
            </div>
            <div className="col-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" rows="5"
                    {...register("description", {
                        required: false,
                    })}></textarea>
            </div>
            <div className="col-md-6">
                <label htmlFor="priority" className="form-label">Priority</label>
                <select className="form-select" id="priority" aria-label="Priority select" {...register("priority", { required: false })}>
                    <option defaultValue value={TASKS_PRIORITY.LOW}>Choose the priority</option>
                    <option value={TASKS_PRIORITY.LOW}>Low</option>
                    <option value={TASKS_PRIORITY.MEDIUM}>Medium</option>
                    <option value={TASKS_PRIORITY.HIGH}>High</option>
                </select>
            </div>
            <div className="col-12 ">
                <input type="submit" name="submit" value="Create" className="btn btn-primary"></input>
            </div>
        </form>
    )
}
