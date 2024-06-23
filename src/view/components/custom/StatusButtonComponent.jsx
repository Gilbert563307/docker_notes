import React, { useRef } from 'react';
import { TASKS_STATUS } from '../../../config';
import useHtmlCssHelpers from '../../../helpers/useHtmlCssHelpers';

/**
 * StatusButtonComponent renders a button with a dropdown to select task status.
 * @param {Object} props - The component props.
 * @param {number} props.taskStatus - The current status of the task.
 * @param {Function} props.callBackFn - The callback function to handle status change.
 * @returns {JSX.Element} The rendered component.
 */

// eslint-disable-next-line react/prop-types
export default function StatusButtonComponent({ taskStatus, callBackFn }) {
    // Create a ref for the status dropdown button
    const statusDropDownRef = useRef();

    // Destructure getStatusBadge from the custom hook
    const { getStatusBadge } = useHtmlCssHelpers();

    /**
     * Handles the selection of a status dropdown item.
     * @param {number} status - The selected status.
     */
    const toggleSelectedStatusDropDownItem = (status) => {
        callBackFn(status);
        //click the button because otherwise bs5 doest close the button dropdown
        statusDropDownRef.current.click();
    };

    /**
     * Dropdown items for status selection.
     * @type {Array<{content: number, onclick: Function}>}
     */
    const statusDropDownItems = [
        { content: TASKS_STATUS.TODO, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.TODO) },
        { content: TASKS_STATUS.IN_PROGRESS, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.IN_PROGRESS) },
        { content: TASKS_STATUS.COMPLETED, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.COMPLETED) },
    ];

    // Class for the parent button to reflect the current task status
    const statusParentBtnStatus = `selected-status-item-${taskStatus}`;

    return (
        <div className="dropdown">
            <button
                className={`btn-status-dropdown dropdown-toggle ${statusParentBtnStatus}`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ref={statusDropDownRef}
            >
                {getStatusBadge(taskStatus)}
            </button>
            <ul className="dropdown-menu">
                {statusDropDownItems.map((statusItem, index) => (
                    <li key={index}>
                        <button className="dropdown-item" type='button' onClick={statusItem.onclick}>
                            {getStatusBadge(statusItem.content)}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
