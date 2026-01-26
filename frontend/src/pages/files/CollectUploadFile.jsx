import React, { useState, useRef } from "react";
import { ALLOWED_UPLOAD_FILE_TYPES } from "../../config";
import { DRIVE_CONTROLLER_ACTIONS, useDriveControllerContext } from "../../features/drive/presentation/DriveController";
import RepositorySelectFolder from "../../features/drive/component/drive/RepositorySelectFolder";
import { Show } from "../../shared/presentation/components/custom/Show";
import RepositorySelectedFiles from "../../features/drive/component/drive/RepositorySelectedFiles";
import "./css/CollectUploadFile.css";
import { UploadFilesDto } from "../../features/drive/presentation/dto/UploadFilesDto";

export default function CollectUploadFile() {
  const { dispatch } = useDriveControllerContext();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const selectedFolderIdRef = useRef(null);
  const uploadFileDropZoneRef = useRef(null);
  const dragginOverClass = "upload-drag-over";

  /**
   *
   * @param {Event} event
   */
  function handleFileDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const acceptedFiles = droppedFiles.filter((file) =>
      ALLOWED_UPLOAD_FILE_TYPES.includes(file.type || file.name.split(".").pop().toLowerCase()),
    );

    setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    if (uploadFileDropZoneRef?.current?.classList) {
      uploadFileDropZoneRef.current.classList.remove(dragginOverClass);
    }
  }

  function handleFileDragOver(event) {
    event.preventDefault();
    if (uploadFileDropZoneRef?.current?.classList) {
      uploadFileDropZoneRef.current.classList.add(dragginOverClass);
    }
  }

  /**
   *
   * @param {Event} event
   */
  function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files);
    const acceptedFiles = selectedFiles.filter((file) =>
      ALLOWED_UPLOAD_FILE_TYPES.includes(file.type || file.name.split(".").pop().toLowerCase()),
    );
    setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
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
    //TODO CHECK IF THE VALIDATION IN THE DTO IS BEING ACCEPTED otherwise uncomment
    if (uploadedFiles.length === 0) {
      dispatch({
        type: DRIVE_CONTROLLER_ACTIONS.FILE_NOT_SELECTED_TO_UPLOAD,
      });
      return;
    }

    if (selectedFolderIdRef.current === null) {
      dispatch({
        type: DRIVE_CONTROLLER_ACTIONS.FOLDER_NOT_SELECTED_TO_UPLOAD,
      });
      return;
    }

    dispatch({
      type: DRIVE_CONTROLLER_ACTIONS.UPLOAD_FILES,
      payload: new UploadFilesDto(uploadedFiles, selectedFolderIdRef.current),
    });

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
            <p className="upload-file-info-text">Select and upload the files of your choice</p>
          </div>
        </div>
        <RepositorySelectFolder handleFolderSelection={handleFolderSelection} />
        <Show>
          <Show.When isTrue={uploadedFiles.length > 0}>
            <div>
              <a href="#" role="button" onClick={() => setUploadedFiles([])} className="upload-reset-btn">
                reset
              </a>
            </div>
          </Show.When>
        </Show>

        <div
          className="upload-file-drop-zone"
          id="files_drop_zone"
          onDrop={handleFileDrop}
          onDragOver={handleFileDragOver}
          ref={uploadFileDropZoneRef}
        >
          <div className="upload-file-drop-zone-1-child">
            <div className="upload-file-drop-zone-1-child-icon-parent">
              <i className="fa-regular fa-cloud-arrow-up"></i>
            </div>
            <div className="upload-file-drop-zone-content">
              <p>Choose a file or drag & drop it here</p>
              <p className="upload-file-info-text upload-supported-file-types">
                Supported file types: PDF, DOCX, DOC, TXT, MD. Maximum file size: 100MB.
              </p>
            </div>
            <div className="upload-file-browse-btn-container">
              <input
                className="upload-file-browse-btn form-control"
                type="file"
                id="file-uploader-btn"
                name="Browse File"
                multiple={true}
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileSelect}
              ></input>
            </div>
          </div>
        </div>

        <RepositorySelectedFiles uploadedFiles={uploadedFiles} removeFile={removeFile}></RepositorySelectedFiles>

        <Show>
          <Show.When isTrue={uploadedFiles.length > 0}>
            <div>
              <button type="button" className="btn btn-primary" onClick={uploadFiles}>
                Upload files
              </button>
            </div>
          </Show.When>
        </Show>
      </div>
    </article>
  );
}
