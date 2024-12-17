import React from "react";
import useGetDriveFoldersHook from "../../../../hooks/useGetDriveFoldersHook";
import { DEFAULT_SELECT_FOLDER_MESSAGE } from "../../../../config";
import { Show } from "../../custom/Show";

/**
 *
 * @param {Object} props
 * @param {Function} props.handleFolderSelection
 * @returns {JSX.Element}
 */
export default function RepositorySelectFolder({ handleFolderSelection }) {
  const { folders } = useGetDriveFoldersHook();
  return (
    <Show>
      <Show.When isTrue={folders.length === 0}>
        <p>No folders were found, create a folder first</p>
      </Show.When>
      <Show.Else>
        <div>
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={handleFolderSelection}
          >
            <option defaultChecked={true}>
              {DEFAULT_SELECT_FOLDER_MESSAGE}
            </option>

            {folders.map(
              (
                /** @type {import("../../../../types/types").Folder} **/ folder
              ) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )
            )}
          </select>
        </div>
      </Show.Else>
    </Show>
  );
}
