import React from 'react';
import { ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import { DEFAULT_PROJECT_ID, DEFAULT_TASKS_ARCHIVE, TASKS_ARCHIVED_SESSION_FILTER, TASKS_BOARD_STATUS, TASKS_PRIORITY, TASKS_STATUS } from '../config';
// import useHelpers from '../helpers/useHelpers';
import { useAuthProvider } from '../context/AuthProvider';
import useHelpers from '../helpers/useHelpers';
import DataHandler from './DataHandler';
import { Query } from 'firebase/firestore';


export default function TasksLogic() {

    const { user } = useAuthProvider();
    const { getSessionFilter } = useHelpers();

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
        deleteDoc,
    } = DataHandler({ table: "tasks" });


    /**
 * Creates a new task with default values if not provided in the payload.
 *
 * @param {import("../types/types").createTaskPayload} payload - Task details provided by the user.
 * @returns {Promise<{created: boolean, message: string, type: number}>} - The result of task creation.
 */
    const createTask = async (payload) => {
        try {
            // Define default values for the task
            const defaultValues = {
                project_id: payload.project_id || DEFAULT_PROJECT_ID,
                user_uid: userUid,
                status: payload.status || TASKS_STATUS.TODO,
                description: payload.description || "",
                board_status: payload.board_status || TASKS_BOARD_STATUS.TODO,
                priority: payload.priority || TASKS_PRIORITY.LOW,
                assignee: payload.assignee || { name: user.displayName, assignee_id: user.uid },
                reporter: payload.reporter || { name: user.displayName, assignee_id: user.uid },
                archived: false,
                created_at: currentServerTimestamp,
                updated_at: currentServerTimestamp,
            };

            // Merge payload with defaults, giving precedence to user-provided values
            const payloadToSave = { ...defaultValues, ...payload };

            // Attempt to add the document to the collection
            const created = await addDoc(collectionRef, payloadToSave);

            // Return success message if task creation was successful
            return {
                created: Boolean(created),
                message: "Your task has been created",
                type: ALERT_TYPES.SUCCESS,
            };
        } catch (error) {
            console.log(`[createTask]: ${error.message}`);
            // Return error message in case of failure
            return {
                created: false,
                message: error.message,
                type: ALERT_TYPES.DANGER,
            };
        }
    };



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
    const getTotalTasksInDatabaseByUserAndFilters = async () => {
        try {
            const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

            // Get total records from server according to where clause set by the user
            const totalQuery = query(collectionRef, where("archived", "==", tasksArchived), where("user_uid", "==", userUid))
            const totalRecordsSnapShot = await getCountFromServer(totalQuery);
            const totalRecords = totalRecordsSnapShot.data().count;

            return totalRecords;
        } catch (error) {
            console.log(`[getTotalTasksInDatabaseByUserAndFilters]: ${error.message}`);
            return 0;
        }
    };

    const getTasksFilters = () => {
        try {
            // Future filtering logic here
            return [];
            // eslint-disable-next-line no-unreachable
        } catch (error) {
            console.log(`[getTasksFilters]: ${error.message}`);
            return [];
        }
    };


    /**
     * Generates a Firestore query to fetch tasks for the current page.
     * 
     * @param {{currentPage: number, itemsPerPage?: number }} payload - The current page number for pagination.
     * @returns {Promise<{tasksQuery: Query | null, message: string, type: number}>} The Firestore query to fetch tasks for the specified page.
     */
    const getTasksQuery = async (payload) => {
        try {
            //destruct the vars
            const { currentPage } = payload;

            // Get the number of items to be displayed per page
            const itemsPerPage = getTheCurrentItemsPerPage();

            //get the session arhived filter
            const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

            // If the current page is the first page, create a query limited by the items per page
            if (currentPage === 1) {

                const tasksQuery = query(
                    collectionRef,
                    where("user_uid", "==", userUid),
                    where("archived", "==", tasksArchived),
                    orderBy("created_at", "asc"),
                    limit(payload?.itemsPerPage || itemsPerPage),
                );
                return { tasksQuery: tasksQuery, message: "", type: ALERT_TYPES.SUCCESS }
            }

            // Calculate the limit for fetching documents up to the current page
            const newPageLimit = currentPage * payload?.itemsPerPage || itemsPerPage;

            // Fetch tasks limited by the new page limit
            const allDocsLimitedByThePageNumber = query(
                collectionRef,
                where("user_uid", "==", userUid),
                where("archived", "==", tasksArchived),
                orderBy("created_at", "asc"),
                limit(newPageLimit)
            );

            // Get document snapshots for the calculated limit clause
            const documentSnapshots = await getDocs(allDocsLimitedByThePageNumber);


            // Calculate the offset to start from the last doc in the arr
            //so the value can be like
            //map  = {
            //  2: 14   
            //  3: 29   
            //  4: 44,   
            //}
            const offset = ((currentPage * itemsPerPage) - itemsPerPage) - 1;

            // Get the document to start after, based on the offset
            const startFromDocument = documentSnapshots.docs[offset];

            // Return a query that starts after the last visible document of the previous page
            const tasksQuery = query(
                collectionRef,
                where("user_uid", "==", userUid),
                orderBy("created_at", "asc"),
                startAfter(startFromDocument),
                limit(itemsPerPage)
            )
            return { tasksQuery: tasksQuery, message: "", type: ALERT_TYPES.SUCCESS }
        } catch (error) {
            console.log(`[getTasksQuery]: ${error.message}`);
            return { tasksQuery: null, message: error.message, type: ALERT_TYPES.DANGER }
        }
    }


    /**
    * Fetches a list of tasks for the current user.
    *
    * This function queries the Firestore collection to retrieve tasks associated with the current user's UID,
    * with a limit on the number of items per page. It includes the document ID in the task data and handles
    * potential errors during the fetch process.
    * @param {{ currentPage: number, itemsPerPage?: number}} payload
    * @returns {Promise<{results: import("../types/types").ListTasks | {},  message: string, type: number }>} A promise that resolves to an object containing the fetched tasks, a message, and an alert type.
     */
    const listTasks = async (payload) => {
        try {
            // Construct the query to get all tasks for the current user UID with a 
            const { tasksQuery } = await getTasksQuery(payload);

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
            const totalRecords = await getTotalTasksInDatabaseByUserAndFilters();
            //get total pages for paginartion
            const totalPages = getTotalPages(totalRecords);
            //retutn results
            return {
                results: { tasks: results, total: totalRecords, pages: totalPages },
                message: "",
                type: ALERT_TYPES.SUCCESS
            };

        } catch (error) {
            console.log(`[listTasks]: ${error.message}`);
            return {
                results: { tasks: [], total: 0, pages: 0 },
                message: error.message,
                type: ALERT_TYPES.DANGER
            };
        }
    };

    /**
     * 
     * @param {import("../types/types").Task} payload 
     * @returns {Promise<{ updated: boolean, message: string, type: number }>}
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
            console.log(`[updateTask]: ${error.message}`);
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
     * @returns {Promise<{task: import("../types/types").Task | {}, message: string, type: number}>}
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
                    task: {},
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
            console.log(`[readTask]: ${error.message}`);
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
     * @param {{id: string, archived: boolean}} payload - The ID of the task to be archived.
     * @returns {Promise<{ archived: boolean, message: string, type: number }>} - A promise that resolves to an object indicating the result of the archiving process.
     */
    const archiveTask = async (payload) => {
        try {
            const archived = await updateTask(payload);

            // Return the result of the update operation
            return {
                archived: Boolean(archived),
                message: "",
                type: ALERT_TYPES.SUCCESSU
            };
        } catch (error) {
            // Return an error response if the update operation fails
            console.log(`[archiveTask]: ${error.message}`);
            return {
                archived: false,
                message: error.message,
                type: ALERT_TYPES.DANGER
            };
        }
    };

    /**
     * 
     * @param {import("../types/types").Task} task 
     * @returns {Promise<{ deleted: boolean, message: string, type: number }>}  
     */
    const deleteTask = async (task) => {
        try {
            const deleted = await deleteDoc(doc(db, table, task));
            return {
                deleted: Boolean(deleted),
                message: "Your task has been deleted",
                type: ALERT_TYPES.DANGER
            }
        } catch (error) {
            console.log(`[deleteTask]: ${error.message}`);
            return {
                deleted: false,
                message: error.message,
                type: ALERT_TYPES.DANGER
            }
        }
    }
    return { createTask, listTasks, updateTask, readTask, archiveTask, deleteTask };
}
