import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/views/tasks/CollectReadTask.css";
import useHtmlCssHelpers from "../../helpers/useHtmlCssHelpers";
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
import "@mdxeditor/editor/style.css";
import { useForm } from "react-hook-form";

export default function CollectUpdateTask() {
  let { state } = useLocation();
  const { getStatusButton } = useHtmlCssHelpers();

  //custom fields
  const [description, setDescription] = useState(task.description);

  if (state === null || state === undefined) {
    return (
      <>
        <p>No task found</p>
      </>
    );
  }

  /**
   * @type {import("../../controller/TasksController").Task}
   */
  const task = state?.task;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task.title,
      // project_id: 0,
      // assignee: { name: user.displayName, assignee_id: user.uid },
      // reporter: { name: user.displayName, reporter_id: user.uid },
    },
  });

  const onSubmit = (data) => {
    const newPayload = { ...task, ...data, description: description };
    console.log(newPayload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <article className="read-task">
        <div className="read-task-title-div update-task-title-div ">
          <input
            className={`form-control fs-1 task-title update-task-title ${errors.title && errors.title.type ? "is-invalid" : ""
              }`}
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
          ></input>
          {errors.title && (
            <div className="invalid-feedback d-block">
              {errors.title.message}
            </div>
          )}
        </div>
        <div className="read-task-div">
          <div>
            <div>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <MDXEditor
                className="mdx-editor-editor"
                markdown={description}
                onChange={(value) => setDescription(value)}
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
                        {/* <InsertImage /> */}
                      </>
                    ),
                  }),
                ]}
              />
            </div>
          </div>
          <div className="update-task-grid-2">
            <div>
              <button type="submit" className="add-task-button" name="save">
                Save changes
              </button>
            </div>

            <div className="tasks-deatils-div border rounded">
              <div className="tasks-deatils-div-details-header">
                <h6>Details</h6>
              </div>
              <hr className="bg-body-secondary"></hr>

              <div className="details-table">
                <div className="details-div">
                  <p className="fw-medium">Project</p>
                  <p>{task.project_id}</p>
                </div>
                <div className="details-div">
                  <p className="fw-medium">Assignee</p>
                  <p>{task.assignee.name}</p>
                </div>
                <div className="details-div">
                  <p className="fw-medium">Reporter</p>
                  <p>{task.reporter.name}</p>
                </div>
                <div className="details-div">
                  <p className="fw-medium">Status</p>
                  <p>todo...</p>
                </div>
                <div className="details-div">
                  <p className="fw-medium">Priority</p>
                  <p>todo...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </form>
  );
}
