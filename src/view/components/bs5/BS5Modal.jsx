import React from "react";
import "../../../assets/css/BS5Modal.css";

export const MODAL_SIZES = {
  NONE: 0,
  SMALL: 1,
  LARGE: 2,
  EXTRA_LARGE: 3,
};

/**
 * 
 * @param {Object} props - Modal properties.
 * @param {string} props.modal_id - Unique identifier for the modal.
 * @param {string} props.modal_label - Accessible label for the modal.
 * @param {string} props.modal_title - Title of the modal.
 * @param {any} props.modal_content - Content to be displayed in the modal.
 * @param {boolean} [props.modal_footer=true] - Flag to show/hide the modal footer.
 * @param {boolean} [props.showSaveChanges=false] - Flag to show/hide the "Save Changes" button.
 * @param {string} [props.saveChangesTitle="Opslaan"] - Text for the "Save Changes" button.
 * @param {import("react").MouseEventHandler} props.closeModal - Function to close the modal.
 * @param {boolean} [props.headerCentre=false] - Flag to center align the modal header.
 * @param {number} [props.modalSize=MODAL_SIZES.NONE] - Size of the modal, using predefined constants (e.g., MODAL_SIZES.SM, MODAL_SIZES.LG).
 * @param {import("react").MouseEventHandler} [props.saveChangesFunction=() => {}] - Function to execute when "Save Changes" button is clicked.
 * @returns {JSX.Element} - Rendered Modal component.
 */
export default function BS5Modal({
  modal_id,
  modal_label,
  modal_title,
  modal_content,
  modal_footer = true,
  showSaveChanges = false,
  saveChangesTitle = "Oplsaan",
  closeModal,
  headerCentre = false,
  modalSize = MODAL_SIZES.NONE,
  saveChangesFunction = () => { },
}) {

  /**
   * pass a modal size as an integer from 0-3 from MODAL_SIZES constant
   * @param {number} modalSize
   * @returns {string} returns BS5 available modal sizes
   */
  const getModalSize = (modalSize) => {
    const availableModalSizes = {
      [MODAL_SIZES.NONE]: "",
      [MODAL_SIZES.SMALL]: "modal-sm",
      [MODAL_SIZES.LARGE]: "modal-lg",
      [MODAL_SIZES.EXTRA_LARGE]: "modal-xl",
    };
    return availableModalSizes[modalSize] || "";
  };

  return (
    <div>
      <div id="modal-overlay"></div>
      <div
        className="modal fade show"
        id={modal_id}
        tabIndex={-1}
        aria-labelledby={modal_label + `Label`}
        aria-hidden="false"
        style={{ display: "block" }}
      >
        <div
          className={`modal-dialog ${getModalSize(
            modalSize
          )} dialogic-modal-margin `}
        >
          <div className="modal-content">
            <div
              className={`modal-header dialogic-modal-header ${headerCentre ? "dialogic-modal-header-centre" : ""
                }`}
            >
              <h1 className="modal-title fs-5 " id={modal_label + `Label`}>
                {modal_title}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">{modal_content}</div>
            {modal_footer && (
              <div className="dialogic-modal-footer">
                <button
                  type="button"
                  tabIndex={0}
                  className="dialogic-button dialogic-dismiss-button"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Annuleren
                </button>
                {showSaveChanges && saveChangesFunction && (
                  <button
                    type="button"
                    tabIndex={0}
                    className="dialogic-button dialogic-primary-button"
                    onClick={saveChangesFunction}
                  >
                    {saveChangesTitle}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





