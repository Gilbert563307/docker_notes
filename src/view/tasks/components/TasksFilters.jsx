import React from 'react'
import SessionMemoryFilter from '../../components/custom/SessionMemoryFilter'
import { TASKS_ARCHIVED_SESSION_FILTER } from '../../../config'

export default function TasksFilters() {
  return (
    <div className=''>
      <SessionMemoryFilter
          FILTER_TO_CHECK={TASKS_ARCHIVED_SESSION_FILTER}
          LABEL="Archived tasks"
          ID="Archived_tasks"
        />
    </div>
  )
}
