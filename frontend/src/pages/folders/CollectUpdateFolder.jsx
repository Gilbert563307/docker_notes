import React from "react";
import useGetFolderHook from "../../shared/hooks/useGetFolderHook";
import UpdateFolderComponent from "../../features/drive/component/folders/UpdateFolderComponent";
import { Show } from "../../shared/presentation/components/custom/Show";

export default function CollectUpdateFolder() {
  const { folder, dispatch } = useGetFolderHook();

  function checkIfTheFolderIsLoadedIn(object) {
    if (Object.keys(object).length === 0) return false;
    return true;
  }

  return (
    <>
      <Show>
        <Show.When isTrue={checkIfTheFolderIsLoadedIn(folder)}>
          <UpdateFolderComponent folder={folder} dispatch={dispatch} />
        </Show.When>
        <Show.Else>
          <article className="d-flex justify-content-center read-project-component">
            <p>Loading....</p>
          </article>
        </Show.Else>
      </Show>
    </>
  );
}
