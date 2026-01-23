import React from 'react'

import usePaginationHook from './usePaginationHook';
import { DRIVE_CONTROLLER_ACTIONS, useDriveControllerContext } from '../../features/drive/presentation/DriveController';
import { DriveFileDto } from '../../features/drive/application/dto/DriveFileDto';

/**
 * 
 * @returns {{files: Array<DriveFileDto>, total: number, pages: number}}
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
