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
        userUid,
        addDoc,
        query,
        where,
        getDocs,
        limit,
        getCountFromServer,
        getTotalPages,
        getTheCurrentItemsPerPage,
        startAfter,
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
     * Retrieves the total number of tasks from the server.
     * 
     * This function fetches the total number of tasks from the server by querying the Firestore collection.
     * It then returns the total count of tasks.
     * 
     * @async
     * @returns {Promise<number>} A promise that resolves to the total count of tasks.
     * @throws {Error} If there's an error while retrieving the total count of tasks.
     */
    const getTotalTasks = async () => {
        try {
            // Get total records from server
            const totalRecordsSnapShot = await getCountFromServer(collectionRef);
            const totalRecords = totalRecordsSnapShot.data().count;
            return totalRecords;
        } catch (error) {
            console.error('Error getting total tasks count:', error);
            return 0;
        }
    };

    /**
     * Constructs a Firestore query to fetch tasks based on the page number and last visible document.
     * 
     * @param {number} pageNumber - The current page number.
     * @param {DocumentSnapshot} lastVisible - The last visible document from the previous query.
     * @returns {Query} The Firestore query to fetch tasks.
     */
    const getTasksQuery = (pageNumber, lastVisible) => {
        // Get the total items per page.
        const itemsPerPage = getTheCurrentItemsPerPage();

        // If the page number is greater than 1, construct the query with startAfter.
        if (pageNumber && pageNumber > 1) {
            const tasksQuery = query(
                collectionRef,
                where("user_uid", "==", userUid),
                startAfter(lastVisible),
                //limit on the number of items per page.
                limit(itemsPerPage)
            );
            return tasksQuery;
        }

        // If the page number is 1 or not set when the component is mounted, construct the query without startAfter.
        const tasksQuery = query(
            collectionRef,
            where("user_uid", "==", userUid),
            //limit on the number of items per page.
            limit(itemsPerPage)
        );
        return tasksQuery;
    }


    /**
    * Fetches a list of tasks for the current user.
    *
    * This function queries the Firestore collection to retrieve tasks associated with the current user's UID,
    * with a limit on the number of items per page. It includes the document ID in the task data and handles
    * potential errors during the fetch process.
    * @param {{  currentPage: number, lastVisibleTask: Object}} payload
    * @returns {Promise<{results: { tasks: import("../controller/TasksController").Tasks, lastVisibleTask: Object }, message: string, type: string }>} A promise that resolves to an object containing the fetched tasks, a message, and an alert type.
     */
    const listTasks = async (payload) => {
        try {
            // Construct the query to get all tasks for the current user UID with a 
            const tasksQuery = getTasksQuery(payload.currentPage, payload.lastVisibleTask)

            // Execute the query to get the tasks.
            const querySnapshot = await getDocs(tasksQuery);

            // Get the last visible document from the query snapshot.
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            // Map through the query snapshot to add the document ID to each task.
            const results = querySnapshot.docs.map((document) => ({
                ...document.data(),
                id: document.id,
            }));
            
            //get total records for pagination
            const totalRecords = await getTotalTasks();
            //get total pages for paginartion
            const totalPages = getTotalPages(totalRecords);

            //retutn results
            return {
                results: { tasks: results, lastVisibleTask: lastVisible, total: totalRecords, pages: totalPages },
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
