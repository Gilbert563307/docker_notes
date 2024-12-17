import React from "react";

/**
 *
 * @param {Object} props
 * @param {Array<File>} props.uploadedFiles
 * @param {Function} props.removeFile
 * @returns
 */
export default function RepositorySelectedFiles({ uploadedFiles, removeFile }) {
  return (
    <div className="uploaded-files-container">
      {uploadedFiles.map((f, index) => {
        const sizeInKB = (f.size / 1024).toFixed(2);
        const sizeInMB = (f.size / (1024 * 1024)).toFixed(2);

        let displaySize;
        if (parseInt(sizeInKB) < 1024) {
          displaySize = `${sizeInKB} KB`;
        } else {
          displaySize = `${sizeInMB} MB`;
        }

        return (
          <div className="uploaded-file" key={index}>
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
  );
}
