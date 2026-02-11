import React, { useRef, useState } from "react";
import {
  TASKS_CONTROLLER_ACTIONS,
  useTasksControllerContext,
} from "../../features/kanboard/presentation/TasksController";
import { useForm } from "react-hook-form";
import { TASKS_PRIORITY, TASKS_STATUS } from "../../config";
import "./css/CollectCreateTask.css";
import QuilTextEditor from "../../shared/presentation/components/texteditor/component/QuilTextEditor";
import DrodownOptions from "../../features/kanboard/component/tasks/DrodownOptions";
import { CreateTaskDto } from "../../features/kanboard/presentation/dto/CreateTaskDto";

export default function CollectCreateTask() {
  const { dispatch } = useTasksControllerContext();

  //custom fields
  const [status, setStatus] = useState(TASKS_STATUS.TODO);
  const [priority, setPriority] = useState(TASKS_PRIORITY.LOW);
  const [description, setDescription] = useState("");

  //create dropdown refs to simulate btn clicks
  const statusDropDownRef = useRef();
  const priorityDropDownRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    // setError,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    reset();
    const { title } = data;
    dispatch({
      type: TASKS_CONTROLLER_ACTIONS.CREATE,
      payload: new CreateTaskDto(title, description, status, priority, undefined),
    });
  };

  return (
    <article className="create-task-article">
      <form className="d-flex flex-column g-3" onSubmit={handleSubmit(onSubmit)}>
        {/* start title  */}
        <div className="col-12 mb-2">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className={`form-control ${errors.title && errors.title.type ? "is-invalid" : ""}`}
            id="title"
            aria-describedby="Title name"
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
          {errors.title && <div className="invalid-feedback d-block">{errors.title.message}</div>}
        </div>
        {/* end title  */}

        {/* start description  */}
        <div className="col-12 mb-2">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <QuilTextEditor content={description} saveText={setDescription}></QuilTextEditor>
          {errors.description && <div className="invalid-feedback d-block">{errors.description.message}</div>}
        </div>
        {/* end description  */}

        <div className="bottom-options">
          <DrodownOptions
            statusDropDownRef={statusDropDownRef}
            priorityDropDownRef={priorityDropDownRef}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
          />
        </div>
        <div className="col-12 mt-3">
          <input type="submit" name="submit" value="Create" className="add-task-button task-btn-plain"></input>
        </div>
      </form>
    </article>
  );
}
