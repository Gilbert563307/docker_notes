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
        convertTimeStampToDate,
        orderBy,
        doc,
        db,
        table,
        updateDoc,
        getDoc,
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
                updated_at: currentServerTimestamp,
                archived: false,
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


    /**
     * Generates a Firestore query to fetch tasks for the current page.
     * 
     * @param {number} currentPage - The current page number for pagination.
     * @returns {Promise<Query>} The Firestore query to fetch tasks for the specified page.
     */
    const getTasksQuery = async (currentPage) => {
        // Get the number of items to be displayed per page
        const itemsPerPage = getTheCurrentItemsPerPage();

        // If the current page is the first page, create a query limited by the items per page
        if (currentPage === 1) {
            const tasksQuery = query(
                collectionRef,
                where("user_uid", "==", userUid),
                where("archived", "==", false),
                orderBy("created_at", "asc"),
                limit(itemsPerPage)
            );
            return tasksQuery;
        }

        // Calculate the limit for fetching documents up to the current page
        const newPageLimit = currentPage * itemsPerPage;

        // Fetch tasks limited by the new page limit
        const allDocsLimitedByThePageNumber = query(
            collectionRef,
            where("user_uid", "==", userUid),
            where("archived", "==", false),
            orderBy("created_at", "asc"),
            limit(newPageLimit)
        );

        // Get document snapshots for the calculated limit
        const documentSnapshots = await getDocs(allDocsLimitedByThePageNumber);

        //get the current page * items per page - items per page and remove 1 index because its an array
        //so the value can be like
        //map  = {
        //  2: 14   
        //  3: 29   
        //  4: 44,   
        //}
        // Calculate the offset to determine the starting point for the current page
        const offset = ((currentPage * itemsPerPage) - itemsPerPage) - 1;

        // Get the document to start after, based on the offset
        const startFromDocument = documentSnapshots.docs[offset];


        // Return a query that starts after the last visible document of the previous page
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
            const results = querySnapshot.docs.map((document) => {
                const convertedCreatedAt = convertTimeStampToDate({
                    seconds: document.data().created_at.seconds,
                    nanoseconds: document.data().created_at.nanoseconds,
                });

                const convertedUpdatedAt = convertTimeStampToDate({
                    seconds: document.data().updated_at.seconds,
                    nanoseconds: document.data().updated_at.nanoseconds,
                });
                return {
                    ...document.data(),
                    id: document.id,
                    created_at: convertedCreatedAt,
                    updated_at: convertedUpdatedAt,
                }
            })

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

    /**
     * 
     * @param {import("../controller/TasksController").Task} payload 
     * @returns {Promise<{ updated: boolean, message: string, type: string }>}
     */
    const updateTask = async (payload) => {
        try {
            //manualy updated the updated_at
            const updatedPayload = { ...payload, updated_at: currentServerTimestamp };

            //get document
            const task = doc(db, table, payload.id);

            //update document
            const updatedTask = updateDoc(task, updatedPayload);
            if (!updatedTask) return { updated: false, message: "Something went wrong while updating your task", type: ALERT_TYPES.DANGER };

            return {
                updated: true,
                message: "Your task has been succesfully been updated",
                type: ALERT_TYPES.SUCCESS,
            }

        } catch (error) {
            return {
                updated: false,
                message: error.message,
                type: ALERT_TYPES.DANGER
            };
        }
    }

    /**
     * Fetches a task from the database by its ID.
     * @param {string} taskId 
     * @returns {Promise<{task: import("../controller/TasksController").Task, message: string, type: number}>}
     */
    const readTask = async (taskId) => {
        try {
            // Get a reference to the task document in the database
            const taskRef = doc(db, table, taskId);

            // Fetch the document snapshot
            const taskSnap = await getDoc(taskRef);

            // Check if the task document exists
            if (!taskSnap.exists()) {
                return {
                    message: 'An error occurred while fetching the task.',
                    type: ALERT_TYPES.DANGER
                };
            }

            // Get the document data
            const taskDocData = taskSnap.data();

            // Manually assign the ID to the task because Firebase doesn't return the ID
            const task = { ...taskDocData, id: taskId };

            // Return the task with a success message
            return {
                task: task,
                message: "",
                type: ALERT_TYPES.SUCCESS
            };
        } catch (error) {
            // Return an error response if the fetch operation fails
            return {
                task: {},
                message: error.message,
                type: ALERT_TYPES.DANGER
            };
        }
    }

    /**
     * Archives a task by its ID.
     * 
     * @param {string} taskId - The ID of the task to be archived.
     * @returns {Promise<{ updated: boolean, message: string, type: string }>} - A promise that resolves to an object indicating the result of the archiving process.
     */
    const archiveTask = async (taskId) => {
        try {
            // Create a mock task with the given ID and mark it as archived
            const task = { id: taskId, archived: true };

            const archived = await updateTask(task);

            // Return the result of the update operation
            return archived;
        } catch (error) {
            // Return an error response if the update operation fails
            return {
                updated: false,
                message: error.message,
                type: ALERT_TYPES.DANGER
            };
        }
    };
    return { createTask, listTasks, updateTask, readTask, archiveTask };
}
