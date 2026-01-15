import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FOLDERS_CONTROLLER_ACTIONS,
  useFoldersControllerContext,
} from "../controller/FoldersController";

/**
 *
 * @returns {{folder: import("../../types/types").Folder | {}, dispatch: Function}}
 */
export default function useGetFolderHook() {
  const { folderId } = useParams();
  const { state, dispatch } = useFoldersControllerContext();

  useEffect(() => {
    /**
     *
     * @param {string | undefined} folderId
     * @returns {Void}
     */
    function fetchFolderById(folderId) {
      if (!folderId) return;

      dispatch({ type: FOLDERS_CONTROLLER_ACTIONS.READ, payload: folderId });
    }

    fetchFolderById(folderId);
  }, [folderId]);
  return { folder: state?.folder, dispatch };
}
