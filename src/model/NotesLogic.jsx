import React from 'react';
import { ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import DataHandler from './DataHandler';
import { NOTES_STATUS } from '../config';

/**
 * Logic component for managing notes.
 *
 */
export default function NotesLogic() {
    const {
        collectionRef,
        userId,
        addDoc,
    } = DataHandler({ table: "notes" });

    /**
     * Creates a new note.
     *
     * @param {Object} payload - The data for the new note.
     * @param {string} payload.title - The title of the note.
     * @param {string} payload.description - The description of the note.
     * @param {number} payload.priority - The priority level of the note.
     * @returns {Promise<{ created: boolean, message: string, type: string }>} A promise resolving to an object indicating whether the note was created successfully, along with a message and alert type.
     */
    const createNote = async (payload) => {
        try {
            const newPayload = { ...payload, user_uid: userId, status: NOTES_STATUS.TODO };
            const created = await addDoc(collectionRef, newPayload);
            const isNoteCreated = created ? true : false;
            return {
                created: isNoteCreated,
                message: isNoteCreated ?? "Your note has been created",
                type: ALERT_TYPES.SUCCESS,
            }
        } catch (error) {
            return {
                created: false,
                message: error.message,
                type: ALERT_TYPES.DANGER
            }
        }
    }

    return { createNote };
}
