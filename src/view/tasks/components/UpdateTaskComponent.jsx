/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    BlockTypeSelect,
    CodeToggle,
    ListsToggle,
    markdownShortcutPlugin,
    CreateLink,
    linkDialogPlugin,
    tablePlugin,
} from "@mdxeditor/editor";
import { useForm } from "react-hook-form";
import TaskDetails from "./TaskDetails";
import { TASKS_CONTROLLER_ACTIONS } from "../../../controller/TasksController";
import DeleteTaskButton from "./buttons/DeleteTaskButton";
import "../../../assets/css/components/UpdateTaskComponent.css";
import QuilTextEditor from "../../components/texteditor/QuilTextEditor";

/**
 * 
 * @param {object} props 
 * @param {import("../../../types/types").Task} props.task 
 * @param {Function} props.dispatch 
 * @returns {JSX.Element}
 */
export default function UpdateTaskComponent({ task, dispatch }) {

    /**
     * @typedef {import("../../../types/types").customFieldsPayload} customFieldsPayload
     */

    /** 
     * @type {[customFieldsPayload, React.Dispatch<React.SetStateAction<customFieldsPayload>>]} 
     */
    const [customFields, setCustomFields] = useState({
        status: task?.status ?? 0,         // Provide default values based on your type
        priority: task?.priority ?? 0,     // Adjust to fit your type constraints
        description: task?.description ?? "",
    });
    /**
     * 
     * @param {string} field 
     * @param {any} value 
     */
    const handleCustomFieldChange = (field, value) => {
        setCustomFields((prevFields) => ({ ...prevFields, [field]: value }));
    };

    /**
     * 
     * @param {string} value 
     */
    const setStatus = (value) => {
        setCustomFields((prevFields) => ({ ...prevFields, status: value }));
    }

    /**
     * 
     * @param {string} value 
     */
    const setPriority = (value) => {
        setCustomFields((prevFields) => ({ ...prevFields, priority: value }));
    }

    const {
        register,
        handleSubmit,
        setError, formState: { errors } } = useForm({
            defaultValues: {
                title: task.title,
            },
        });

    const onSubmit = (data) => {
        //TODO NOT NECESSARY
        // if (customFields.description.length === 0) {
        //     setError('description', { type: 'custom', message: 'The description cannot be empty' });
        //     return;
        // }
        const newPayload = { ...task, ...data, ...customFields };
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.UPDATE, payload: newPayload });
    };

    const downloadTask = () => {
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.DOWNLOAD_TASK, payload: customFields.description });
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <article className="read-task">
                <div className="read-task-title-div update-task-title-div">
                    <input
                        className={`form-control fs-1 task-title update-task-title ${errors.title ? "is-invalid" : ""}`}
                        maxLength={255}
                        {...register("title", {
                            required: "The title cannot be empty",

                            minLength: {
                                value: 4,
                                message: "The title must be longer than 4 characters",
                            },
                            maxLength: {
                                value: 255,
                                message: "The title cannot be longer than 255 characters",
                            },
                        })}
                    />
                    {errors.title && (
                        <div className="invalid-feedback d-block">
                            {errors.title.message}
                        </div>
                    )}
                </div>
                <div className="read-task-div">
                    <div>
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <QuilTextEditor content={customFields.description}></QuilTextEditor>

                        {/* <MDXEditor
                            className="mdx-editor-editor"
                            markdown={customFields.description}
                            onChange={(value) => handleCustomFieldChange('description', value)}
                            plugins={[
                                headingsPlugin(),
                                listsPlugin(),
                                quotePlugin(),
                                thematicBreakPlugin(),
                                markdownShortcutPlugin(),
                                tablePlugin(),
                                toolbarPlugin({
                                    toolbarContents: () => (
                                        <>
                                            <UndoRedo />
                                            <BlockTypeSelect />
                                            <BoldItalicUnderlineToggles />
                                            <CodeToggle />
                                            <ListsToggle />
                                            <CreateLink />
                                        </>
                                    ),
                                }),
                            ]}
                        /> */}
                        {errors.description && (
                            <div className="invalid-feedback d-block">{errors.description.message}</div>
                        )}
                    </div>
                    <div className="update-task-grid-2">
                        <div className="update-task-grid-buttons">
                            <div className="options-buttons">
                                <button type="submit" className="add-task-button task-btn-plain" name="save" onClick={handleSubmit(onSubmit)}>
                                    <i className="fa-regular fa-floppy-disk"></i> Save
                                </button>

                            </div>

                            <DeleteTaskButton taskId={task.id} />
                        </div>

                        <TaskDetails task={task} customFields={customFields} setStatus={setStatus} setPriority={setPriority} />
                    </div>
                </div>
            </article>
        </form>
    )
}
