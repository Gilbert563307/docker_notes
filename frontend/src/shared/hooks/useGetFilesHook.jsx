import React from 'react'
import { DRIVE_CONTROLLER_ACTIONS, useDriveControllerContext } from '../controller/DriveController'
import usePaginationHook from './usePaginationHook';

/**
 * 
 * @returns {{files: import("../../types/types").DriveFiles, total: number, pages: number}}
 */
export default function useGetFilesHook() {
    const { state, dispatch } = useDriveControllerContext();

    const fetchFiles = () => {
        dispatch({ type: DRIVE_CONTROLLER_ACTIONS.LIST });
    };

    usePaginationHook({ methodToCall: fetchFiles });

    return {
        files: state.files.files,
        total: state.files.total,
        pages: state.files.pages
    };
}
