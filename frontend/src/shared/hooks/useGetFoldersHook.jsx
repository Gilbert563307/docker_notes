import React from "react";

import usePaginationHook from "./usePaginationHook";
import { FOLDERS_CONTROLLER_ACTIONS, useFoldersControllerContext } from "../../features/drive/presentation/FoldersController";

export default function useGetFoldersHook() {
  const { state, dispatch } = useFoldersControllerContext();

  const fetchFiles = () => {
    dispatch({ type: FOLDERS_CONTROLLER_ACTIONS.LIST });
  };

  usePaginationHook({ methodToCall: fetchFiles });

  return {
    folders: state.folders.folders,
    total: state.folders.total,
    pages: state.folders.pages,
  };
}
