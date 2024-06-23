import React, { useRef } from 'react';
import { TASKS_PRIORITY, TASKS_STATUS } from '../../../config';
import useHtmlCssHelpers from '../../../helpers/useHtmlCssHelpers';

/**
 * @param {Object} props - The component props.
 * @param {number} props.priorityStatus - The current status of the task.
 * @param {Function} props.callBackFn - The callback function to handle status change.
 * @returns {JSX.Element} The rendered component.
 */

// eslint-disable-next-line react/prop-types
export default function PriorityButtonComponent({ priorityStatus, callBackFn }) {

    const { getPriorityBadge } = useHtmlCssHelpers();

    // Create a ref for the status dropdown button

    const priorityDropDownRef = useRef();

    /**
    * Handles the selection of a status dropdown item.
    * @param {number} status - The selected status.
    */
    const toggleSelectedPriorityDropDownItem = (status) => {
        callBackFn(status);
        //click the button because otherwise bs5 doest close the button dropdown
        priorityDropDownRef.current.click();
    };

    const priorityDropDownItems = [
        { content: TASKS_PRIORITY.LOW, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.LOW) },
        { content: TASKS_PRIORITY.MEDIUM, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.MEDIUM) },
        { content: TASKS_PRIORITY.HIGH, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.HIGH) },
    ]

    const priorityParentBtnStatus = `selected-priority-item-${priorityStatus}`;


    return (
        <div className="dropdown">
            <button className={`btn-status-dropdown dropdown-toggle ${priorityParentBtnStatus} `} type="button" data-bs-toggle="dropdown" aria-expanded="false" ref={priorityDropDownRef}>
                {getPriorityBadge(priorityStatus)}
            </button>
            <ul className="dropdown-menu">
                {priorityDropDownItems.map((priorityItem, index) => {
                    return <li key={index}><button className="dropdown-item" type='button'  onClick={priorityItem.onclick}>{getPriorityBadge(priorityItem.content)}</button></li>
                })}
            </ul>
        </div>
    )
}
