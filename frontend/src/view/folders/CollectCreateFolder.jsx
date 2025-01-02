import React from "react";
import { useForm } from "react-hook-form";
import "../../assets/css/views/folders/CollectCreateFolder.css";
import {
  FOLDERS_CONTROLLER_ACTIONS,
  useFoldersControllerContext,
} from "../../controller/FoldersController";

export default function CollectCreateFolder() {
  const { dispatch } = useFoldersControllerContext();

  const {
    register,
    handleSubmit,
    reset,
    // setError,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    reset();
    dispatch({ type: FOLDERS_CONTROLLER_ACTIONS.CREATE, payload: data });
  };

  return (
    <article className="create-folder-article">
      <form
        className="d-flex flex-column g-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* start name  */}
        <div className="col-12 mb-2">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.name && errors.name.type ? "is-invalid" : ""
            }`}
            id="name"
            aria-describedby="name"
            maxLength={255}
            {...register("name", {
              required: "The name cannot be empty",
              minLength: {
                value: 1,
                message: "The name must longer than 4 characters",
              },
              maxLength: {
                value: 255,
                message: "The name cannot be longer than 255 characters",
              },
            })}
          />
          {errors.name && (
            <div className="invalid-feedback d-block">
              {errors.name.message}
            </div>
          )}
        </div>
        {/* end name  */}

        {/* start color picker */}
        <div className="col-12 mb-2">
          <label htmlFor="ColorInput" className="form-label">
            Folder colour
          </label>
          <input
            type="color"
            className="form-control form-control-color"
            id="ColorInput"
            defaultValue="#563d7c"
            {...register("color")}
            title="Choose your color"
          ></input>
        </div>
        {/* end color picker */}

        <div className="col-12 mt-3">
          <input
            type="submit"
            name="submit"
            value="Create"
            className="add-task-button task-btn-plain"
          ></input>
        </div>
      </form>
    </article>
  );
}
