import React from "react";
import { ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import {
  DEFAULT_PROJECT_ID,
  DEFAULT_TASKS_ARCHIVE,
  MAX_BOARD_ITEMS,
  PRIORITY_FILTER_TYPE_TAGS,
  STATUS_FILTER_TYPE_TAGS,
  TASKS_ARCHIVED_SESSION_FILTER,
  TASKS_PATH,
  TASKS_PRIORITY,
  TASKS_STATUS,
} from "../config";
import { useAuthProvider } from "../context/AuthProvider";
import useHelpers from "../helpers/useHelpers";
import DataHandler from "./DataHandler";
import { Query } from "firebase/firestore";

export default function TasksLogic() {
  const { user } = useAuthProvider();
  const { getSessionFilter, getHowManyFiltersAreActiveByCurrentPath } =
    useHelpers();

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
    doc,
    db,
    table,
    updateDoc,
    getDoc,
    deleteDoc,
    getSearchQueryByFieldName,
    convertQuerySnapShotDocs,
    fetchResultsOnPageOne,
    fetchPaginatedResults,
    getDocument,
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
      /**
       * @type {import("../types/types").Task}
       */
      const defaultValues = {
        project_id: payload.project_id || DEFAULT_PROJECT_ID,
        user_uid: userUid,
        status: payload.status || TASKS_STATUS.TODO,
        description: payload.description || "",
        priority: payload.priority || TASKS_PRIORITY.LOW,
        assignee: payload.assignee || {
          name: user.displayName,
          assignee_id: user.uid,
        },
        reporter: payload.reporter || {
          name: user.displayName,
          assignee_id: user.uid,
        },
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
      const { queryItems } = getTasksQueryClauses();

      // Get total records from server according to where clause set by the user
      const totalQuery = query(collectionRef, ...queryItems);
      const totalRecordsSnapShot = await getCountFromServer(totalQuery);
      const totalRecords = totalRecordsSnapShot.data().count;

      return totalRecords;
    } catch (error) {
      console.log(
        `[getTotalTasksInDatabaseByUserAndFilters]: ${error.message}`
      );
      return 0;
    }
  };

  /**
   *
   * @returns {{filters: Array<number>, message: string, type: number}}
   */
  const getActiveStatusFilters = () => {
    try {
      const { names } = getActiveFiltersNamesOnTaskPath();

      // Filter and retrieve active status tags based on task names.
      const results = STATUS_FILTER_TYPE_TAGS.filter((tag) =>
        names.includes(tag.config)
      ).map((tag) => tag.value);

      // Return successful response with active status filters.
      return {
        filters: results,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[getActiveStatusFilters]: ${error.message}`);
      // On error, return a response with error message and danger alert type.
      return {
        filters: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   *
   * @returns {{names: Array<string>, message: string, type: number}}
   */
  const getActiveFiltersNamesOnTaskPath = () => {
    try {
      // Retrieve all active filters by the current task path.
      const allActiveFilters =
        getHowManyFiltersAreActiveByCurrentPath(TASKS_PATH);

      // If no active filters, return default success response with empty filters.
      if (allActiveFilters.length === 0) {
        return {
          names: [],
          message: "",
          type: ALERT_TYPES.SUCCESS,
        };
      }

      // Map active filters to their task names.
      const activeStatusTasksNames = allActiveFilters.map((task) => task.name);

      return {
        names: activeStatusTasksNames,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      // On error, return a response with error message and danger alert type.
      return {
        names: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   *
   * @returns {{filters: Array<number>, message: string, type: number}}
   */
  const getActivePriorityFilters = () => {
    try {
      const { names } = getActiveFiltersNamesOnTaskPath();

      // Filter and retrieve active status tags based on task names.
      const results = PRIORITY_FILTER_TYPE_TAGS.filter((tag) =>
        names.includes(tag.config)
      ).map((tag) => tag.value);

      // Return successful response with active status filters.
      return {
        filters: results,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[getActivePriorityFilters]: ${error.message}`);
      // On error, return a response with error message and danger alert type.
      return {
        filters: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * @param {{searchTearm?: string}} payload
   * @returns {{queryItems: Array<Query> | Array, message: string, type: number}}
   */
  const getTasksQueryClauses = (payload = {}) => {
    try {
      // Get the session archived filter
      const tasksArchived =
        getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) ||
        DEFAULT_TASKS_ARCHIVE;

      const statusFilters = getActiveStatusFilters();
      const priorityFilters = getActivePriorityFilters();

      let queryItems = [
        where("user_uid", "==", userUid),
        where("archived", "==", tasksArchived),
        orderBy("created_at", "desc"),
      ];
      if (statusFilters.filters.length > 0) {
        queryItems = [
          ...queryItems,
          where("status", "in", statusFilters.filters),
        ];
      }

      if (priorityFilters.filters.length > 0) {
        queryItems = [
          ...queryItems,
          where("priority", "in", priorityFilters.filters),
        ];
      }

      if (payload.searchTearm && payload.searchTearm != "") {
        const { searchTearm } = payload;
        queryItems = [
          ...queryItems,
          ...getSearchQueryByFieldName("title", searchTearm),
        ];
      }

      return {
        queryItems: queryItems,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[getTasksQueryClauses]: ${error.message}`);
      return {
        queryItems: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * Generates a Firestore query to fetch tasks for the current page.
   *
   * @param {{currentPage: number, itemsPerPage?: number, searchTearm?: string }} payload - The current page number for pagination.
   * @returns {Promise<{resultsQuery: Query | null, message: string, type: number}>} The Firestore query to fetch tasks for the specified page.
   */
  const getTasksQuery = async (payload) => {
    try {
      // Destructure the vars
      const { currentPage } = payload;

      // Get the number of items to be displayed per page
      const itemsPerPage = getTheCurrentItemsPerPage();
      const { queryItems } = getTasksQueryClauses(payload);

      // If the current page is the first page, create a query limited by the items per page
      if (currentPage === 1) {
        return fetchResultsOnPageOne(queryItems, itemsPerPage);
      }

      return fetchPaginatedResults(
        currentPage,
        payload,
        itemsPerPage,
        queryItems
      );
    } catch (error) {
      console.log(`[getTasksQuery]: ${error.message}`);
      return {
        resultsQuery: null,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   *
   * @param {{currentPage: number, searchTearm: string}} payload
   * @returns {Promise<{results: import("../types/types").ListTasks | {},  message: string, type: number }>}
   */
  const listTasksBySearchTerm = async (payload) => {
    try {
      return await listTasks(payload);
    } catch (error) {
      console.log(`[listTasksBySearchTerm]: ${error.message}`);
      return {
        results: { tasks: [], total: 0, pages: 0 },
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * Fetches a list of tasks for the current user.
   *
   * This function queries the Firestore collection to retrieve tasks associated with the current user's UID,
   * with a limit on the number of items per page. It includes the document ID in the task data and handles
   * potential errors during the fetch process.
   * @param {{ currentPage: number, itemsPerPage?: number, searchTearm?: string}} payload
   * @returns {Promise<{results: import("../types/types").ListTasks | {},  message: string, type: number }>} A promise that resolves to an object containing the fetched tasks, a message, and an alert type.
   */
  const listTasks = async (payload) => {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const { resultsQuery } = await getTasksQuery(payload);

      // Execute the query to get the tasks.
      const querySnapshot = await getDocs(resultsQuery);

      const { results } = convertQuerySnapShotDocs(querySnapshot);

      //get total records for pagination
      const totalRecords = await getTotalTasksInDatabaseByUserAndFilters();
      //get total pages for pagination
      const totalPages = getTotalPages(totalRecords);
      //return results
      return {
        results: { tasks: results, total: totalRecords, pages: totalPages },
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[listTasks]: ${error.message}`);
      return {
        results: { tasks: [], total: 0, pages: 0 },
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * @returns {Promise<{tasks: import("../types/types").Tasks, message: string, type: number}>}
   */
  const listBoardTasks = async () => {
    try {
      // Get the session archived filter
      // const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

      const tasksQuery = query(
        collectionRef,
        where("user_uid", "==", userUid),
        // where("archived", "==", tasksArchived),
        orderBy("updated_at", "desc"),
        limit(MAX_BOARD_ITEMS)
      );

      // Execute the query to get the tasks.
      const querySnapshot = await getDocs(tasksQuery);

      const { results, message, type } =
        convertQuerySnapShotDocs(querySnapshot);
      return {
        tasks: results,
        message: message,
        type: type,
      };
    } catch (error) {
      console.log(`[listBoardTasks]: ${error.message}`);
      return {
        tasks: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
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
      await updateDoc(task, updatedPayload);

      return {
        updated: true,
        message: "Your task has been succesfully been updated",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[updateTask]: ${error.message}`);
      return {
        updated: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * Fetches a task from the database by its ID.
   * @param {string} taskId
   * @returns {Promise<{task: import("../types/types").Task | {}, message: string, type: number}>}
   */
  const readTask = async (taskId) => {
    try {
      const { document, message, type } = await getDocument(taskId);
      return {
        task: document,
        message: message,
        type: type,
      };
    } catch (error) {
      // Return an error response if the fetch operation fails
      console.log(`[readTask]: ${error.message}`);
      return {
        task: {},
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * Archives a task by its ID.
   *
   * @param {{id: string, archived: boolean}} payload - The ID of the task to be archived.
   * @returns {Promise<{ archived: boolean, message: string, type: number }>} - A promise that resolves to an object indicating the result of the archiving process.
   */
  const archiveTask = async (payload) => {
    try {
      const { updated, message, type } = await updateTask(payload);

      // Return the result of the update operation
      return {
        archived: updated,
        message: message,
        type: type,
      };
    } catch (error) {
      // Return an error response if the update operation fails
      console.log(`[archiveTask]: ${error.message}`);
      return {
        archived: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   *
   * @param {string} taskId
   * @returns {Promise<{ deleted: boolean, message: string, type: number }>}
   */
  async function deleteTask(taskId) {
    try {
      const taskRef = doc(db, table, taskId);
      const deleted = await deleteDoc(taskRef);
      return {
        deleted: Boolean(deleted),
        message: "Your task has been deleted",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[deleteTask]: ${error.message}`);
      return {
        deleted: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  return {
    createTask,
    listTasks,
    updateTask,
    readTask,
    archiveTask,
    deleteTask,
    listBoardTasks,
    listTasksBySearchTerm,
  };
}
