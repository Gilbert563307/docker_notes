import React, { useState } from 'react'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook'
import "../../assets/css/views/tasks/CollectListTasks.css";
import { Show } from '../components/custom/Show';
import BS5Modal, { MODAL_SIZES } from '../components/bs5/BS5Modal';
import TasksCreateTaskComponent from './components/TasksCreateTaskComponent';
import useGetTasksHook from '../../hooks/useGetTasksHook';
import ListTasks from './components/ListTasks';


/**
 * CollectListTasks component
 *
 * This component renders a page for managing tasks . It includes a search bar,
 * a button to add a new task, and a modal for creating new tasks. The component
 * also sets the page title to "Tasks ".
 *
 * @returns {JSX.Element}
 */
export default function CollectListTasks() {
  useSetPageTitleHook({ title: "Tasks " });
  const { tasks } = useGetTasksHook();
  const [createTaskModal, setCreateTaskModal] = useState(false);

  /**
   * Opens the create tas modal.
   * If the modal is already open, it does nothing.
   */
  const openCreateModal = () => {
    if (createTaskModal) return;
    setCreateTaskModal(true);
  }

  /**
   * Closes the create task modal.
   * If the modal is already closed, it does nothing.
   */
  const closeCreateModal = () => {
    if (createTaskModal === false) return;
    setCreateTaskModal(false);
  }


  return (
    <article className='tasks-article d-flex flex-column gap-1'>
      <div className='tasks-header d-flex justify-content-between'>
        <div>
          searchbar...
        </div>
        <div>
          <button aria-describedby='create task button' onClick={openCreateModal} className='add-task-button'><i className="fa-thin fa-plus"></i>Add Task</button>
        </div>
      </div>

      <div className='tasks-content'>
        <ListTasks tasks={tasks}/>
      </div>

      <Show>
        <Show.When isTrue={createTaskModal}>
          <BS5Modal
            modal_id="create_task_modal"
            modal_label="create_task_modal"
            modal_title="Add new task"
            modal_content={<TasksCreateTaskComponent closeModal={closeCreateModal} />}
            closeModal={closeCreateModal}
            modal_footer={false}
            headerCentre={true}
            modalSize={MODAL_SIZES.LARGE}
          />
        </Show.When>
      </Show>

    </article>
  )
}
