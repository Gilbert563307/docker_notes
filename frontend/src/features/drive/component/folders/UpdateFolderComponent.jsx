import React from "react";
import { useForm } from "react-hook-form";
import "../../css/UpdateFolderComponent.css";
import DeleteFolderButton from "./DeleteFolderButton";
import { FOLDERS_CONTROLLER_ACTIONS } from "../../controller/FoldersController";

export default function UpdateFolderComponent({ folder, dispatch }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: folder.name,
      color: folder.color,
    },
  });

  function onSubmit(data) {
    const newPayload = { ...folder, ...data };
    dispatch({ type: FOLDERS_CONTROLLER_ACTIONS.UPDATE, payload: newPayload });
  }

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
            Colour
          </label>
          <input
            type="color"
            className="form-control form-control-color"
            id="ColorInput"
            {...register("color")}
            title="Choose your color"
          ></input>
        </div>
        {/* end color picker */}

        <div className="update-folder-component-actions">
          <div className="">
            <input
              type="submit"
              name="submit"
              value="Update"
              className="add-task-button task-btn-plain"
            ></input>
          </div>
          <DeleteFolderButton folderId={folder.id} />
        </div>
      </form>
    </article>
  );
}
