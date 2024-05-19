import React from 'react';
import { ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import DataHandler from './DataHandler';
import { DEFAULT_ITEMS_PER_PAGE, TASKS_STATUS } from '../config';

/**
 * Logic component for managing tasks.
 *
 */
export default function TasksLogic() {
    const {
        collectionRef,
        userUid,
        addDoc,
        query,
        where,
        getDocs,
        limit,
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
            const newPayload = { ...payload, user_uid: userUid, status: TASKS_STATUS.TODO };
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


    /**
    * Fetches a list of tasks for the current user.
    *
    * This function queries the Firestore collection to retrieve tasks associated with the current user's UID,
    * with a limit on the number of items per page. It includes the document ID in the task data and handles
    * potential errors during the fetch process.
    *
    * @returns {Promise<{results: { tasks: import("../controller/TasksController").Tasks, lastVisibleTask: Object }, message: string, type: string }>} A promise that resolves to an object containing the fetched tasks, a message, and an alert type.
     */
    const listTasks = async () => {
        try {
            // Construct the query to get all tasks for the current user UID with a limit on the number of items per page.
            const tasksQuery = query(
                collectionRef,
                where("user_uid", "==", userUid),
                limit(DEFAULT_ITEMS_PER_PAGE)
            );

            // Execute the query to get the tasks.
            const querySnapshot = await getDocs(tasksQuery);

            // Get the last visible document from the query snapshot.
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            // Map through the query snapshot to add the document ID to each task.
            const results = querySnapshot.docs.map((document) => ({
                ...document.data(),
                id: document.id,
            }));

            return {
                results: { tasks: results, lastVisibleTask: lastVisible },
                message: "",
                type: ALERT_TYPES.SUCCESS
            };
        } catch (error) {
            return {
                results: {},
                message: error.message,
                type: ALERT_TYPES.DANGER
            };
        }
    };

    return { createTask, listTasks };
}
