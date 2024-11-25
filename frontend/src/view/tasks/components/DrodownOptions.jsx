import React from 'react'
import { TASKS_PRIORITY, TASKS_STATUS } from '../../../config';
import useHtmlCssHelpers from '../../../helpers/useHtmlCssHelpers';

export default function DrodownOptions({ statusDropDownRef, priorityDropDownRef, status, setStatus, priority, setPriority }) {

    const { getStatusBadge, getPriorityBadge } = useHtmlCssHelpers();


    const toggleSelectedStatusDropDownItem = (status) => {
        if (statusDropDownRef === undefined) return;
        setStatus(status);
        //click the button because otherwise bs5 doest close the button dropdown
        statusDropDownRef.current.click();
    }

    const toggleSelectedPriorityDropDownItem = (priority) => {
        if (priorityDropDownRef === undefined) return;
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
        <React.Fragment>
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
        </React.Fragment>
    )
}
