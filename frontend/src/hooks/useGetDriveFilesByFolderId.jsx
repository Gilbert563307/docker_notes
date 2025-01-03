import React, { useEffect } from "react";
import {
  FOLDERS_CONTROLLER_ACTIONS,
  useFoldersControllerContext,
} from "../controller/FoldersController";
import { useParams } from "react-router-dom";

/**
 *
 * @returns {{files: import("../types/types").DriveFiles, total: number, pages: number}}
 */
export default function useGetDriveFilesByFolderId() {
  const { folderId } = useParams();
  const { state, dispatch } = useFoldersControllerContext();

  useEffect(() => {
    /**
     *
     * @param {string | undefined} folderId
     * @returns {Void}
     */
    function fetchFilesByFolderId(folderId) {
      if (!folderId) return;

      dispatch({
        type: FOLDERS_CONTROLLER_ACTIONS.LIST_FILES_IN_FOLDER,
        payload: folderId,
      });
    }
    fetchFilesByFolderId(folderId);
  }, [folderId]);

  return {
    files: state?.files.files,
    total: state?.files.total,
    pages: state?.files.pages,
  };
}
