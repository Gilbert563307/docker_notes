import { MDXEditor } from '@mdxeditor/editor';
import React from 'react'
import { useLocation } from 'react-router-dom';
import "../../assets/css/views/tasks/CollectReadTask.css";
// import '@mdxeditor/editor/style.css'


export default function CollectReadTask() {
  let { state } = useLocation();

  if (state === null || state === undefined) {
    return (<>
      <p>No task found</p>
    </>)
  }

  /**
  * @type {import("../../controller/TasksController").Task}
  */
  const task = state?.task;


  return (
    <article className='read-task'>
      <div className='read-task-div'>
        <div>
          <p className='fs-1 task-title'>{task.title}</p>
          <div>
            <label htmlFor="description" className="form-label">Description</label>
            <MDXEditor
              readOnly={true}
              markdown={task.description}
            >
            </MDXEditor>
          </div>
        </div>
        <div>

          <div>
            <button>progess</button>
          </div>

          <div>
            <div>
              Details
            </div>
            <table className='table table-sm'>
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <td>{task.project_id}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="col">Assignee</th>
                  <td>{task.assignee.name}</td>

                </tr>
                <tr>
                  <th scope="col">Reporter</th>
                  <td>{task.reporter.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </article>
  )
}
