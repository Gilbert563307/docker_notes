import React, { useState } from 'react'
import useSetPageTitleHook from '../../hooks/useSetPageTitleHook'
import "../../assets/css/views/notes/CollectListNotes.css";
import { Show } from '../components/custom/Show';
import BS5Modal, { MODAL_SIZES } from '../components/bs5/BS5Modal';
import NotesCreateNoteComponent from './components/NotesCreateNoteComponent';

/**
 * CollectListNotes component
 *
 * This component renders a page for managing notes. It includes a search bar,
 * a button to add a new note, and a modal for creating new notes. The component
 * also sets the page title to "Notes".
 *
 * @returns {JSX.Element}
 */
export default function CollectListNotes() {
  useSetPageTitleHook({ title: "Notes" });
  const [createNoteModal, setCreateNotModal] = useState(false);

  /**
   * Opens the create note modal.
   * If the modal is already open, it does nothing.
   */
  const openCreateModal = () => {
    if (createNoteModal) return;
    setCreateNotModal(true);
  }

  /**
   * Closes the create note modal.
   * If the modal is already closed, it does nothing.
   */
  const closeCreateModal = () => {
    if (createNoteModal === false) return;
    setCreateNotModal(false);
  }


  return (
    <article className='notes-article d-flex flex-column gap-1'>
      <div className='notes-header d-flex justify-content-between'>
        <div>
          searchbar...
        </div>
        <div>
          <button aria-describedby='create note button' onClick={openCreateModal} className='add-note-button'><i className="fa-thin fa-plus"></i>Add Note</button>
        </div>
      </div>

      <div className='notes-content'>
        content....
      </div>

      <Show>
        <Show.When isTrue={createNoteModal}>
          <BS5Modal
            modal_id="create_note_modal"
            modal_label="create_note_modal"
            modal_title="Add new note"
            modal_content={<NotesCreateNoteComponent/>}
            closeModal={closeCreateModal}
            modal_footer={false}
            headerCentre={true}
            modalSize={MODAL_SIZES.LARGE}
          />
        </Show.When>
      </Show>

    </article>
  )
}
