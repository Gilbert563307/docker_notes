import React from 'react'
import SessionMemoryFilter from '../../components/custom/SessionMemoryFilter'
import { COMPLETED_STATUS_TASKS_SESSION_FILTER, HIGH_PRIORITY_TASKS_SESSION_FILTER, IN_STATUS_PROGRESS_TASKS_SESSION_FILTER, LOW_PRIORITY_TASKS_SESSION_FILTER, MEDIUM_PRIORITY_TASKS_SESSION_FILTER, TODO_STATUS_TASKS_SESSION_FILTER } from '../../../config'


export default function TasksFilters() {
  return (
    <div className='d-flex justify-content-between'>
      <div>
        <h6>Status:</h6>

        <SessionMemoryFilter
          FILTER_TO_CHECK={TODO_STATUS_TASKS_SESSION_FILTER}
          LABEL="Todo"
          ID="todo"
        />

        <SessionMemoryFilter
          FILTER_TO_CHECK={IN_STATUS_PROGRESS_TASKS_SESSION_FILTER}
          LABEL="In progress"
          ID="in_progress_tasks"
        />

        <SessionMemoryFilter
          FILTER_TO_CHECK={COMPLETED_STATUS_TASKS_SESSION_FILTER}
          LABEL="Completed"
          ID="completed"
        />

      </div>

      <div>
        <h6>Priority:</h6>

        <SessionMemoryFilter
          FILTER_TO_CHECK={LOW_PRIORITY_TASKS_SESSION_FILTER}
          LABEL="Low"
          ID="low"
        />

        <SessionMemoryFilter
          FILTER_TO_CHECK={MEDIUM_PRIORITY_TASKS_SESSION_FILTER}
          LABEL="Meduim"
          ID="meduim"
        />

        <SessionMemoryFilter
          FILTER_TO_CHECK={HIGH_PRIORITY_TASKS_SESSION_FILTER}
          LABEL="high"
          ID="high"
        />

      </div>

    </div>
  )
}
