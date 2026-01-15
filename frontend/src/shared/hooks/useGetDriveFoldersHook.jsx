import React from "react";
import {
  DRIVE_CONTROLLER_ACTIONS,
  useDriveControllerContext,
} from "../controller/DriveController";

export default function useGetDriveFoldersHook() {
  const { state, dispatch } = useDriveControllerContext();

  const fetchDriveFolders = () => {
    dispatch({ type: DRIVE_CONTROLLER_ACTIONS.LIST_FOLDERS });
  };

  React.useEffect(() => {
    fetchDriveFolders();
  }, []);

  return { folders: state.folders };
}
