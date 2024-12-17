import React, { useState, useRef } from "react";
import "../../assets/css/views/CollectUploadFile.css";
import {
  ALLOWED_UPLOAD_FILE_TYPES,
  DEFAULT_SELECT_FOLDER_MESSAGE,
} from "../../config";
import RepositorySelectFolder from "../components/drive/components/RepositorySelectFolder";
import { Show } from "../components/custom/Show";
import RepositorySelectedFiles from "../components/drive/components/RepositorySelectedFiles";
import {
  DRIVE_CONTROLLER_ACTIONS,
  useDriveControllerContext,
} from "../../controller/DriveController";
import { ALERT_TYPES } from "../components/bs5/BS5Alert";

export default function CollectUploadFile() {
  const { dispatch } = useDriveControllerContext();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const selectedFolderIdRef = useRef(null);

  /**
   *
   * @param {Event} event
   */
  function handleFileDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const acceptedFiles = droppedFiles.filter((file) =>
      ALLOWED_UPLOAD_FILE_TYPES.includes(
        file.name.split(".").pop().toLowerCase()
      )
    );
    setUploadedFiles(acceptedFiles);
  }

  /**
   *
   * @param {Event} event
   */
  function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files);
    const acceptedFiles = selectedFiles.filter((file) =>
      ALLOWED_UPLOAD_FILE_TYPES.includes(
        file.name.split(".").pop().toLowerCase()
      )
    );
    setUploadedFiles(acceptedFiles);
  }

  /**
   *
   * @param {File} file
   */
  function removeFile(file) {
    setUploadedFiles(uploadedFiles.filter((f) => f != file));
  }

  /**
   *
   * @param {Event} event
   */
  function handleFolderSelection(event) {
    if (event === null || event.target === null) return;
    // if (event.target?.value === DEFAULT_SELECT_FOLDER_MESSAGE) return;
    selectedFolderIdRef.current = event.target?.value;
  }

  function uploadFiles() {
    if (uploadedFiles.length === 0) {
      return dispatch({
        type: DRIVE_CONTROLLER_ACTIONS.SET_NOTIFICATION,
        payload: {
          message: "You must select at least 1 file.",
          type: ALERT_TYPES.DANGER,
        },
      });
    }

    if (selectedFolderIdRef.current === null) {
      return dispatch({
        type: DRIVE_CONTROLLER_ACTIONS.SET_NOTIFICATION,
        payload: {
          message:
            "You must select at least 1 folder to upload the file(s) into.",
          type: ALERT_TYPES.DANGER,
        },
      });
    }
    const payload = { files: uploadedFiles, folderId: selectedFolderIdRef.current };
    dispatch({ type: DRIVE_CONTROLLER_ACTIONS.UPLOAD_FILES, payload: payload });

    //reset form
    setUploadedFiles([]);
    selectedFolderIdRef.current = null;
  }

  return (
    <article className="upload-file-article">
      <div className="upload-file-container">
        <div className="upload-file-header">
          <div className="upload-file-header-icon">
            <i className="fa-regular fa-cloud-arrow-up"></i>
          </div>
          <div className="upload-file-header-info">
            <h3 className="upload-file-title">Upload files</h3>
            <p className="upload-file-info-text">
              Select and upload the files of your choice
            </p>
          </div>
        </div>
        <RepositorySelectFolder handleFolderSelection={handleFolderSelection} />
        <Show>
          <Show.When isTrue={uploadedFiles.length > 0}>
            <div>
              <a
                href="#"
                role="button"
                onClick={() => setUploadedFiles([])}
                className="upload-reset-btn"
              >
                reset
              </a>
            </div>
          </Show.When>
        </Show>

        <div
          className="upload-file-drop-zone"
          id="files_drop_zone"
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="upload-file-drop-zone-1-child">
            <div className="upload-file-drop-zone-1-child-icon-parent">
              <i className="fa-regular fa-cloud-arrow-up"></i>
            </div>
            <div className="upload-file-drop-zone-content">
              <p>Choose a file or drag & drop it here</p>
              <p className="upload-file-info-text upload-supported-file-types">
                Supported file types: PDF, DOCX, DOC, TXT. Maximum file size:
                50MB.
              </p>
            </div>
            <div className="upload-file-browse-btn-container">
              <input
                className="upload-file-browse-btn form-control"
                type="file"
                id="file-uploader-btn"
                name="Browse File"
                multiple={true}
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileSelect}
              ></input>
            </div>
          </div>
        </div>

        <RepositorySelectedFiles
          uploadedFiles={uploadedFiles}
          removeFile={removeFile}
        ></RepositorySelectedFiles>

        <Show>
          <Show.When isTrue={uploadedFiles.length > 0}>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={uploadFiles}
              >
                Upload files
              </button>
            </div>
          </Show.When>
        </Show>
      </div>
    </article>
  );
}
