import React from "react";
import useGetFolderHook from "../../shared/hooks/useGetFolderHook";
import UpdateFolderComponent from "../../features/drive/component/folders/UpdateFolderComponent";

export default function CollectUpdateFolder() {
  const { folder, dispatch } = useGetFolderHook();

  return <UpdateFolderComponent folder={folder} dispatch={dispatch} />;
}
