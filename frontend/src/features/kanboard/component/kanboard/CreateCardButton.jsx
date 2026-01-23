import React, { useState } from "react";
import { Show } from "../../../../shared/presentation/components/custom/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../shared/presentation/components/bs5/BS5Modal";
import {
  BOARD_CONTROLLER_ACTIONS,
  useBoardsControllerContext,
} from "../../presentation/BoardsController";
import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import { useParams } from "react-router-dom";
import { CreateTaskDto } from "../../presentation/dto/CreateTaskDto";

export default function CreateCardButton({ header }) {
  const { dispatch } = useBoardsControllerContext();
  const [createModal, setcreateModal] = useState(false);
  const { boardId } = useParams();
  const [title, setTitle] = useState("");

  /**
   * Show the create modal.
   */
  const showCreateModal = () => {
    setcreateModal(true);
    if (title != "") {
      setTitle("");
    }
  };

  /**
   * Hide the create modal.
   */
  const hideCreateModal = () => {
    setcreateModal(false);
  };

  const createTask = () => {
    if (title === undefined) return;
    dispatch({ type: BOARD_CONTROLLER_ACTIONS.CREATE, payload: new CreateTaskDto(title, "", null, null, boardId) });
    hideCreateModal();
  };

  const inputField = (
    <form>
      <input
        type="text"
        className="form-control "
        id="title"
        aria-describedby="Title name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={255}
      />
    </form>
  );

  return (
    <React.Fragment>
      <button
        className="add-card-btn rounded"
        aria-label={`Add card to ${header}`}
        onClick={showCreateModal}
      >
        <div className="button-card-content">
          <i className="fa-regular fa-plus"></i>
          <span>Add a card</span>
        </div>
      </button>
      <Show>
        <Show.When isTrue={createModal}>
          <BS5Modal
            modal_id="create_tasks_modal"
            modal_label="create_tasks_modal"
            modal_title="Add Card"
            modal_content={inputField}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={hideCreateModal}
            saveChangesFunction={createTask}
            modalSize={MODAL_SIZES.NONE}
            saveChangesTitle="Save"
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
