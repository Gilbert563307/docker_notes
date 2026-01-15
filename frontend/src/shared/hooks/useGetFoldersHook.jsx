import React from "react";
import {
  FOLDERS_CONTROLLER_ACTIONS,
  useFoldersControllerContext,
} from "../controller/FoldersController";
import usePaginationHook from "./usePaginationHook";

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
