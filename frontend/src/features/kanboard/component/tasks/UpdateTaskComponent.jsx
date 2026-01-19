/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TaskDetails from "./TaskDetails";
import DeleteTaskButton from "./buttons/DeleteTaskButton";
import "../../css/UpdateTaskComponent.css";
import { TASKS_CONTROLLER_ACTIONS } from "../../presentation/TasksController";
import { ALERT_TYPES } from "../../../../shared/components/bs5/BS5Alert";
import QuilTextEditor from "../../../../shared/components/texteditor/component/QuilTextEditor";
import { TaskDto } from "../../application/dto/TaskDto";

/**
 *
 * @param {object} props
 * @param {TaskDto} props.task
 * @param {Function} props.dispatch
 * @returns {JSX.Element}
 */
export default function UpdateTaskComponent({ task, dispatch }) {
  /**
   * @typedef {import("../../../../types/types").customFieldsPayload} customFieldsPayload
   */

  /**
   * @type {[customFieldsPayload, React.Dispatch<React.SetStateAction<customFieldsPayload>>]}
   */
  const [customFields, setCustomFields] = useState({
    status: 0,
    priority: 0,
    description: "",
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
  };

  /**
   *
   * @param {string} value
   */
  const setPriority = (value) => {
    setCustomFields((prevFields) => ({ ...prevFields, priority: value }));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    //TODO NOT NECESSARY
    // if (customFields.description.length === 0) {
    //     setError('description', { type: 'custom', message: 'The description cannot be empty' });
    //     return;
    // }

    const newPayload = { ...task.toJson(), ...data, ...customFields };
    dispatch({ type: TASKS_CONTROLLER_ACTIONS.UPDATE, payload: newPayload });
  };

  const downloadTask = () => {
    //todo set this into the domain logic
    // if (customFields.description === "") {
    //   return dispatch({
    //     type: TASKS_CONTROLLER_ACTIONS.SET_NOTIFICATION,
    //     payload: {
    //       message: "Download failed: The file is empty",
    //       type: ALERT_TYPES.INFO,
    //     },
    //   });
    // }
    const localDateString = new Date().toLocaleDateString().replaceAll("/", "_");
    dispatch({
      type: TASKS_CONTROLLER_ACTIONS.DOWNLOAD_TASK,
      payload: {
        description: customFields.description,
        filename: `${task.getTitle()}_${task.getAssigneeName()}_${localDateString}`,
      },
    });
  };

  useEffect(() => {
    reset({
      title: task.getTitle(),
    });
    setCustomFields({
      status: task.getStatus(),
      priority: task?.getPriority(),
      description: task?.getDescription(),
    });
  }, [task]);

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
          {errors.title && <div className="invalid-feedback d-block">{errors.title.message}</div>}
        </div>
        <div className="read-task-div">
          <div className="read-task-description-parent">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <QuilTextEditor
              content={customFields.description}
              saveText={(value) => handleCustomFieldChange("description", value)}
            />
            {errors.description && <div className="invalid-feedback d-block">{errors.description.message}</div>}
          </div>
          <div className="update-task-grid-2">
            <div className="update-task-grid-buttons">
              <div className="options-buttons">
                <button
                  type="submit"
                  className="add-task-button task-btn-plain"
                  name="save"
                  onClick={handleSubmit(onSubmit)}
                >
                  <i className="fa-regular fa-floppy-disk"></i> Save
                </button>

                <button
                  type="button"
                  className="download-task-button task-btn-plain"
                  name="save"
                  onClick={downloadTask}
                >
                  <i className="fa-solid fa-download"></i> Download
                </button>
              </div>

              <DeleteTaskButton taskId={task.getId()} />
            </div>

            <TaskDetails task={task} customFields={customFields} setStatus={setStatus} setPriority={setPriority} />
          </div>
        </div>
      </article>
    </form>
  );
}
