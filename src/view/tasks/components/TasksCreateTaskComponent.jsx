/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { TASKS_PRIORITY, TASKS_STATUS } from '../../../config';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../../controller/TasksController';
import "../../../assets/css/components/TasksCreateTaskComponent.css"
import { useAuthProvider } from '../../../context/AuthProvider';
import '@mdxeditor/editor/style.css'
import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CodeToggle, ListsToggle, markdownShortcutPlugin } from '@mdxeditor/editor'
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
    const { user } = useAuthProvider();
    const { dispatch } = useTasksControllerContext();

    //custom fields
    const [description, setDescription] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            project_id: 0,
            assignee: { name: user.displayName, assignee_id: user.uid },
            reporter: { name: user.displayName, reporter_id: user.uid },
        },
    });

    const onSubmit = (data) => {
        if (description.length === 0) {
            setError('description', { type: 'custom', message: 'The description cannot be empty' });
            return;
        }
        closeModal();
        reset();
        const payload = { ...data, description: description }
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.CREATE, payload: payload });
    };

    return (
        <form className="d-flex flex-column g-3" onSubmit={handleSubmit(onSubmit)}>

            <div className='col-4 mb-2'>
                <label htmlFor="status" className="form-label">Status</label>
                <select className="form-select" id="priority" aria-label="Priority select" {...register("status", { required: false })}>
                    <option defaultValue={TASKS_STATUS.TODO} value={TASKS_STATUS.TODO}>To do</option>
                    <option value={TASKS_STATUS.IN_PROGRESS}>In progress</option>
                    <option value={TASKS_STATUS.COMPLETED}>Completed</option>
                </select>
            </div>

            <div className="col-12 mb-2">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    type="text"
                    className={`form-control ${errors.title && errors.title.type ? "is-invalid" : ""
                        }`}
                    id="title"
                    aria-describedby="Title name"
                    placeholder="Lorem impsum....."
                    maxLength={255}
                    {...register("title", {
                        required: "The title cannot be empty",
                        minLength: {
                            value: 4,
                            message: "The title must longer than 4 characters",
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
            <div className="col-12 mb-2">
                <label htmlFor="description" className="form-label">Description</label>
                <MDXEditor
                    markdown={description}
                    onChange={(value) => setDescription(value)}
                    plugins={[
                        headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), markdownShortcutPlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <>
                                    <UndoRedo />
                                    <BlockTypeSelect />
                                    <BoldItalicUnderlineToggles />
                                    <CodeToggle />
                                    <ListsToggle />
                                </>
                            )
                        })
                    ]}
                />
                {errors.description && (
                    <div className="invalid-feedback d-block">{errors.description.message}</div>
                )}
            </div>
            <div className="col-md-4 mb-2">
                <label htmlFor="priority" className="form-label">Priority</label>
                <select className="form-select" id="priority" aria-label="Priority select" {...register("priority", { required: false })}>
                    <option defaultValue value={TASKS_PRIORITY.LOW}>Choose the task priority</option>
                    <option value={TASKS_PRIORITY.LOW}>Low</option>
                    <option value={TASKS_PRIORITY.MEDIUM}>Medium</option>
                    <option value={TASKS_PRIORITY.HIGH}>High</option>
                </select>
            </div>

            <div className='col-md-4 mb-2'>
                <label htmlFor="assignee" className="form-label">Assignee</label>
                <input
                    className={`form-control disabled ${errors.assignee && errors.assignee.type ? "is-invalid" : ""
                        }`}
                    id="assignee"
                    readOnly={true}
                    disabled={true}
                    type="text"{...register("assignee.name")} />
            </div>
            <div className="col-12 d-flex justify-content-center">
                <input type="submit" name="submit" value="Create" className="btn btn-primary"></input>
            </div>
        </form>
    )
}
