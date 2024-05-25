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
        currentServerTimestamp,
        orderBy,
    } = DataHandler({ table: "tasks" });

    /**
     * Creates a new task.
     *
     * @param {Object} payload - The data for the new task.
     * @param {string} payload.title - The title of the task.
     * @param {string} payload.description - The description of the task.
     * @param {number} payload.priority - The priority level of the task.
     * @param {number} payload.created_at - 
     * @param {number} payload.updated_at -
     * @returns {Promise<{ created: boolean, message: string, type: string }>} A promise resolving to an object indicating whether the task was created successfully, along with a message and alert type.
     */
    const createTask = async (payload) => {
        try {
            const newPayload = {
                ...payload,
                user_uid: userUid,
                status: TASKS_STATUS.TODO,
                created_at: currentServerTimestamp,
                updated_at: currentServerTimestamp
            };
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


    const getTasksQuery = async (currentPage) => {
        const itemsPerPage = getTheCurrentItemsPerPage();

        if (currentPage === 1) {
            const tasksQuery = query(
                collectionRef,
                where("user_uid", "==", userUid),
                orderBy("created_at", "asc"),
                limit(itemsPerPage)
            );
            return tasksQuery;
        }

        //get the page limti
        const newPageLimit = currentPage * itemsPerPage;

        //fetch tasks limit by the newPageLimit
        const allDocsLimitedByThePageNumber = query(collectionRef, where("user_uid", "==", userUid), orderBy("created_at", "asc"), limit(newPageLimit));

        const documentSnapshots = await getDocs(allDocsLimitedByThePageNumber);

        //get the current page * items per page - items per page and remove 1 index because its an array
        //so the value can be like
        //map  = {
        //  2: 14   
        //  3: 29   
        //  4: 44,   
        //}
        const offset = ((currentPage * itemsPerPage) - itemsPerPage) -1;

        //Get the last visible document
        const startFromDocument = documentSnapshots.docs[offset];

        return query(
            collectionRef,
            where("user_uid", "==", userUid),
            orderBy("created_at", "asc"),
            startAfter(startFromDocument),
            limit(itemsPerPage)
        )

    }


    /**
    * Fetches a list of tasks for the current user.
    *
    * This function queries the Firestore collection to retrieve tasks associated with the current user's UID,
    * with a limit on the number of items per page. It includes the document ID in the task data and handles
    * potential errors during the fetch process.
    * @param {{ currentPage: number}} payload
    * @returns {Promise<{results: { tasks: import("../controller/TasksController").Tasks}, message: string, type: string }>} A promise that resolves to an object containing the fetched tasks, a message, and an alert type.
     */
    const listTasks = async (payload) => {
        try {
            // Construct the query to get all tasks for the current user UID with a 
            const tasksQuery = await getTasksQuery(payload?.currentPage);

            // Execute the query to get the tasks.
            const querySnapshot = await getDocs(tasksQuery);    

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
                results: { tasks: results, total: totalRecords, pages: totalPages },
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
