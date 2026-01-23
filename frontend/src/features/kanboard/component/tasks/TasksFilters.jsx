import React from 'react'
import SessionMemoryFilter from '../../../../shared/presentation/components/custom/SessionMemoryFilter';
import { TASKS_ARCHIVED_SESSION_FILTER } from '../../../../config';
import StatusTypeTags from '../StatusTypeTags';
import PriorityTypeTags from '../PriorityTypeTags';
import "../../css/TasksFilters.css";


export default function TasksFilters() {
  return (
    <div className='tasks-filters'>
      <SessionMemoryFilter
        FILTER_TO_CHECK={TASKS_ARCHIVED_SESSION_FILTER}
        LABEL="Archived tasks"
        ID="Archived_tasks"
      />

      <div className="btn-group">
        <button
          className="btn btn-secondary btn-sm dropdown-toggle dialogic-domain-filter-btn"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Status
        </button>
        <ul className="dialogic-domain-dropdown dropdown-menu">
          <StatusTypeTags />
        </ul>
      </div>

      <div className="btn-group">
        <button
          className="btn btn-secondary btn-sm dropdown-toggle dialogic-domain-filter-btn"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Priority
        </button>
        <ul className="dialogic-domain-dropdown dropdown-menu">
          <PriorityTypeTags />
        </ul>
      </div>

    </div>
  )
}
