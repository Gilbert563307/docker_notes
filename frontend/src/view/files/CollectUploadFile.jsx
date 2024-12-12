import React, { useRef, useState } from "react";
import "../../assets/css/views/CollectUploadFile.css";
import { ALLOWED_UPLOAD_FILE_TYPES } from "../../config";

export default function CollectUploadFile() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files);
    const acceptedFiles = selectedFiles.filter((file) =>
      ALLOWED_UPLOAD_FILE_TYPES.includes(
        file.name.split(".").pop().toLowerCase()
      )
    );
    setUploadedFiles(acceptedFiles);
  }

  React.useEffect(() => {
    // Handle file uploads (e.g., display progress, upload to server)
    console.log("Uploaded Files:", uploadedFiles);
  }, [uploadedFiles]);

  function dragOverHandler(event) {
    console.log("File(s) in drop zone");
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
  }

  function removeFile(file) {
    setUploadedFiles(uploadedFiles.filter((f) => f != file));
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

        <div>
          <label htmlFor="folders_data_list" className="form-label">
            Click to select the folder to upload files to
          </label>
          <input
            className="form-control"
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
          />
          <datalist id="datalistOptions">
            <option value="MYHU" />
            <option value="AI" />
            <option value="MOD" />
            <option value="BIM" />
          </datalist>
        </div>
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

        <div className="uploaded-files-container">
          {uploadedFiles.map((f) => {
            const sizeInKB = (f.size / 1024).toFixed(2);
            const sizeInMB = (f.size / (1024 * 1024)).toFixed(2);

            let displaySize;
            if (sizeInKB < 1024) {
              displaySize = `${sizeInKB} KB`;
            } else {
              displaySize = `${sizeInMB} MB`;
            }

            return (
              <div className="uploaded-file">
                <div className="uploaded-file-header">
                  <div className="uploaded-file-header-options">
                    <div>
                      <i className="fa-duotone fa-solid fa-file fa-xl"></i>
                    </div>
                    <div>{f.name}</div>
                  </div>

                  <button
                    className="remove-upload-button"
                    onClick={() => removeFile(f)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
                <p className="upload-file-info-text uploaded-file-size">
                  size: {displaySize}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
