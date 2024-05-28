import React, { useRef, useState } from 'react'
import { useAuthProvider } from '../../context/AuthProvider';
import { TASKS_CONTROLLER_ACTIONS, useTasksControllerContext } from '../../controller/TasksController';
import { useForm } from 'react-hook-form';


import '@mdxeditor/editor/style.css'
import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, BlockTypeSelect, CodeToggle, ListsToggle, markdownShortcutPlugin, CreateLink, linkDialogPlugin } from '@mdxeditor/editor'
import { TASKS_PRIORITY, TASKS_STATUS } from '../../config';
import "../../assets/css/views/CollectCreateTask.css";
import useHtmlCssHelpers from '../../helpers/useHtmlCssHelpers';

export default function CollectCreateTask() {
  const { user } = useAuthProvider();
  const { dispatch } = useTasksControllerContext();
  const { getStatusBadge, getPriorityBadge } = useHtmlCssHelpers();

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
    //check if the description is empty
    if (description.length === 0) {
      setError('description', { type: 'custom', message: 'The description cannot be empty' });
      return;
    }
    reset();
    //add the custom description, status fields to the payload
    const payload = { ...data, description: description, status: status, priority: priority };
    dispatch({ type: TASKS_CONTROLLER_ACTIONS.CREATE, payload: payload });
  };

  const toggleSelectedStatusDropDownItem = (status) => {
    setStatus(status);
    //click the button because otherwise bs5 doest close the button dropdown
    statusDropDownRef.current.click();
  }

  const toggleSelectedPriorityDropDownItem = (priority) => {
    setPriority(priority);
    //click the button because otherwise bs5 doest close the button dropdown
    priorityDropDownRef.current.click();
  }


  /**
   * Dropdown items for status selection.
   * @type {Array<{content: number, onclick: Function}>}
   */
  const statusDropDownItems = [
    { content: TASKS_STATUS.TODO, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.TODO) },
    { content: TASKS_STATUS.IN_PROGRESS, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.IN_PROGRESS) },
    { content: TASKS_STATUS.COMPLETED, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.COMPLETED) },
  ];

  const priorityDropDownItems = [
    { content: TASKS_PRIORITY.LOW, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.LOW) },
    { content: TASKS_PRIORITY.MEDIUM, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.MEDIUM) },
    { content: TASKS_PRIORITY.HIGH, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.HIGH) },
  ]

  const statusParentBtnStatus = `selected-status-item-${status}`;
  const priorityParentBtnStatus = `selected-priority-item-${priority}`;

  return (
    <article className='create-task-article'>
      <form className="d-flex flex-column g-3" onSubmit={handleSubmit(onSubmit)}>
        {/* start title  */}
        <div className="col-12 mb-2">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className={`form-control ${errors.title && errors.title.type ? "is-invalid" : ""
              }`}
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
          {errors.title && (
            <div className="invalid-feedback d-block">{errors.title.message}</div>
          )}
        </div>
        {/* end title  */}

        {/* start description  */}
        <div className="col-12 mb-2">
          <label htmlFor="description" className="form-label">Description</label>
          <MDXEditor
            markdown={description}
            onChange={(value) => setDescription(value)}
            plugins={[
              headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), markdownShortcutPlugin(),
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
                )
              })
            ]}
          />
          {errors.description && (
            <div className="invalid-feedback d-block">{errors.description.message}</div>
          )}
        </div>
        {/* end description  */}

        <div>
          {/* start status  */}
          <div className='col-md-2 d-flex flex-column  mb-2'>
            <label htmlFor="status" className="form-label">Status</label>

            <div className="dropdown">
              <button className={`btn-status-dropdown dropdown-toggle ${statusParentBtnStatus} `} type="button" data-bs-toggle="dropdown" aria-expanded="false" ref={statusDropDownRef}>
                {getStatusBadge(status)}
              </button>
              <ul className="dropdown-menu">
                {statusDropDownItems.map((statusItem, index) => {
                  return <li key={index}><a className="dropdown-item" href="#" onClick={statusItem.onclick}>{getStatusBadge(statusItem.content)}</a></li>
                })}
              </ul>
            </div>
          </div>
          {/* end status  */}

          {/* start priority  */}
          <div className="col-md-2 mb-2">
            <label htmlFor="priority" className="form-label">Priority</label>
            {/* TASKS_PRIORITY.LOW */}
            <div className="dropdown">
              <button className={`btn-status-dropdown dropdown-toggle ${priorityParentBtnStatus} `} type="button" data-bs-toggle="dropdown" aria-expanded="false" ref={priorityDropDownRef}>
                {getPriorityBadge(priority)}
              </button>
              <ul className="dropdown-menu">
                {priorityDropDownItems.map((priorityItem, index) => {
                  return <li key={index}><a className="dropdown-item" href="#" onClick={priorityItem.onclick}>{getPriorityBadge(priorityItem.content)}</a></li>
                })}
              </ul>
            </div>
          </div>
          {/* end priority  */}

        </div>
        <div className="col-12 mt-3">
          <input type="submit" name="submit" value="Create" className="btn btn-primary"></input>
        </div>
      </form>
    </article>
  )
}
