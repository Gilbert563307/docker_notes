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
} from "@mdxeditor/editor";
import { useForm } from "react-hook-form";
import TaskDetails from "./TaskDetails";
import { TASKS_CONTROLLER_ACTIONS } from "../../../controller/TasksController";

export default function UpdateTaskComponent({ task, dispatch }) {
    const [customFields, setCustomFields] = useState({
        status: task?.status,
        priority: task?.priority,
        description: task?.description,
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
        if (customFields.description.length === 0) {
            setError('description', { type: 'custom', message: 'The description cannot be empty' });
            return;
        }
        const newPayload = { ...task, ...data, ...customFields };
        dispatch({ type: TASKS_CONTROLLER_ACTIONS.UPDATE, payload: newPayload });
    };
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
                        <MDXEditor
                            className="mdx-editor-editor"
                            markdown={customFields.description}
                            onChange={(value) => handleCustomFieldChange('description', value)}
                            plugins={[
                                headingsPlugin(),
                                listsPlugin(),
                                quotePlugin(),
                                thematicBreakPlugin(),
                                markdownShortcutPlugin(),
                                linkDialogPlugin(),
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
                        />
                        {errors.description && (
                            <div className="invalid-feedback d-block">{errors.description.message}</div>
                        )}
                    </div>
                    <div className="update-task-grid-2">
                        <button type="submit" className="add-task-button task-btn-plain " name="save" onClick={handleSubmit(onSubmit)}>
                            Save changes
                        </button>
                      
                        <TaskDetails task={task} customFields={customFields} setStatus={setStatus} setPriority={setPriority} />
                    </div>
                </div>
            </article>
        </form>
    )
}
