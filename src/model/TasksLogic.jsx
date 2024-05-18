import React from 'react';
import { ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import DataHandler from './DataHandler';
import { TASKS_STATUS } from '../config';

/**
 * Logic component for managing tasks.
 *
 */
export default function TasksLogic() {
    const {
        collectionRef,
        userId,
        addDoc,
    } = DataHandler({ table: "tasks" });

    /**
     * Creates a new task.
     *
     * @param {Object} payload - The data for the new task.
     * @param {string} payload.title - The title of the task.
     * @param {string} payload.description - The description of the task.
     * @param {number} payload.priority - The priority level of the task.
     * @returns {Promise<{ created: boolean, message: string, type: string }>} A promise resolving to an object indicating whether the task was created successfully, along with a message and alert type.
     */
    const createTask = async (payload) => {
        try {
            const newPayload = { ...payload, user_uid: userId, status: TASKS_STATUS.TODO };
            const created = await addDoc(collectionRef, newPayload);
            const isTaskCreated = created ? true : false;

            return {
                created: isTaskCreated,
                message: "Your task has been created",
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

    return { createTask };
}
