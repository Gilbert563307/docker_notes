import { ALERT_TYPES } from "../../../../shared/components/bs5/BS5Alert";
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
} from "../../../../config";
import { useAuthProvider } from "../../../../shared/context/AuthProvider";
import useHelpers from "../../../../shared/helpers/useHelpers";
import FirebaseInterface from "../../../../shared/data/FirebaseInterface";
import { Task } from "../../domain/Task";
import { Assignee } from "../../domain/Assignee";
import { Reporter } from "../../domain/Reporter";
import { TasksMapper } from "../mapper/TasksMapper";
import { TaskDto } from "../dto/TaskDto";
import FilesService from "../../../../shared/service/FilesService";

export default function TasksService() {
  const { user } = useAuthProvider();
  const { getSessionFilter, getHowManyFiltersAreActiveByCurrentPath, getCurrentPageNumber } = useHelpers();
  const { convertHtmlToDocx } = FilesService();

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
    currentServerTimestamp,
    orderBy,
    doc,
    db,
    table,
    updateDoc,
    deleteDoc,
    getSearchQueryByFieldName,
    convertQuerySnapShotDocs,
    fetchResultsOnPageOne,
    fetchPaginatedResults,
    getDocument,
  } = FirebaseInterface({ table: "tasks" });

  /**
   * Creates a new task with default values if not provided in the payload.
   *
   * @param {import("../../../../types/types").createTaskPayload} payload - Task details provided by the user.
   * @returns {Promise<{created: boolean, message: string, type: number}>} - The result of task creation.
   */
  const createTask = async (payload) => {
    try {
      // Define default values for the task

      const task = new Task(
        null,
        payload.project_id || DEFAULT_PROJECT_ID,
        userUid,
        payload.title,
        payload.description || "",
        payload.status || TASKS_STATUS.TODO,
        payload.priority || TASKS_PRIORITY.LOW,
        payload.assignee || new Assignee(user.displayName, user.uid).toJson(),
        payload.reporter || new Reporter(user.displayName, user.uid).toJson(),
        false,
        currentServerTimestamp,
        currentServerTimestamp,
      );

      // Attempt to add the document to the collection
      const created = await addDoc(collectionRef, task.toJsonWithoutId());

      // Return success message if task creation was successful
      return {
        created: Boolean(created),
        message: "Your task has been created",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
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
      const results = STATUS_FILTER_TYPE_TAGS.filter((tag) => names.includes(tag.config)).map((tag) => tag.value);

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
      const allActiveFilters = getHowManyFiltersAreActiveByCurrentPath(TASKS_PATH);

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
      const results = PRIORITY_FILTER_TYPE_TAGS.filter((tag) => names.includes(tag.config)).map((tag) => tag.value);

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
      const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

      const statusFilters = getActiveStatusFilters();
      const priorityFilters = getActivePriorityFilters();

      let queryItems = [
        where("user_uid", "==", userUid),
        where("archived", "==", tasksArchived),
        orderBy("created_at", "desc"),
      ];
      if (statusFilters.filters.length > 0) {
        queryItems = [...queryItems, where("status", "in", statusFilters.filters)];
      }

      if (priorityFilters.filters.length > 0) {
        queryItems = [...queryItems, where("priority", "in", priorityFilters.filters)];
      }

      if (payload.searchTearm && payload.searchTearm != "") {
        const { searchTearm } = payload;
        queryItems = [...queryItems, ...getSearchQueryByFieldName("title", searchTearm)];
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

      return fetchPaginatedResults(currentPage, payload, itemsPerPage, queryItems);
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
   * @param {string} searchTearm
   * @returns {Promise<{results: import("../../../../types/types").ListTasks | {},  message: string, type: number }>}
   */
  const listTasksBySearchTerm = async (searchTearm) => {
    try {
      //get currentPageNumber
      const currentPage = getCurrentPageNumber();
      //create Payload
      const payload = { currentPage: currentPage, searchTearm: searchTearm };
      return await listTasks(payload);
    } catch (error) {
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
   * @returns {Promise<{results: import("../../../../types/types").ListTasks | {},  message: string, type: number }>} A promise that resolves to an object containing the fetched tasks, a message, and an alert type.
   */
  const listTasks = async (payload) => {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const { resultsQuery } = await getTasksQuery(payload);

      // Execute the query to get the tasks.
      const querySnapshot = await getDocs(resultsQuery);

      const { results } = convertQuerySnapShotDocs(querySnapshot);
      const tasksDto = TasksMapper.arrayToDtoList(results);

      //get total records for pagination
      const totalRecords = await getTotalTasksInDatabaseByUserAndFilters();
      //get total pages for pagination
      const totalPages = getTotalPages(totalRecords);
      //return results
      return {
        results: { tasks: tasksDto, total: totalRecords, pages: totalPages },
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        results: { tasks: [], total: 0, pages: 0 },
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * @param {{boardId: string}} payload
   * @returns {Promise<{tasks: Array<TaskDto>, message: string, type: number}>}
   */
  const listBoardTasks = async (payload) => {
    try {
      // Get the session archived filter
      // const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

      //THIS IS FOR WHE THE MAIN DEV I STILL HAS TASKS ON THE DEFAULT PROJECT ID
      const boardId = payload.boardId === "0" ? 0 : payload.boardId;

      const tasksQuery = query(
        collectionRef,
        where("user_uid", "==", userUid),
        // where("archived", "==", tasksArchived),
        where("project_id", "==", boardId),
        orderBy("updated_at", "desc"),
        limit(MAX_BOARD_ITEMS),
      );

      // Execute the query to get the tasks.
      const querySnapshot = await getDocs(tasksQuery);

      const { results, message, type } = convertQuerySnapShotDocs(querySnapshot);
      const tasksDto = TasksMapper.arrayToDtoList(results);

      return {
        tasks: tasksDto,
        message: message,
        type: type,
      };
    } catch (error) {
      return {
        tasks: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   *
   * @param {import("../../../../types/types").Task} payload
   * @returns {Promise<{ updated: boolean, message: string, type: number }>}
   */
  const updateTask = async (payload) => {
    try {
      const task = new Task(
        payload.id,
        payload.project_id,
        payload.user_uid,
        payload.title,
        payload.description,
        payload.status,
        payload.priority,
        new Assignee(payload.assignee.name, payload.assignee.assignee_id),
        new Reporter(payload.reporter.name, payload.reporter.assignee_id),
        payload.archived,
        payload.created_at,
        payload.updated_at,
      );

      // //manualy updated the updated_at
      task.update({ ...payload, updated_at: currentServerTimestamp });

      // //get document
      const taskDocument = doc(db, table, payload.id);

      // //update document
      await updateDoc(taskDocument, task.toJson());

      return {
        updated: true,
        message: "Your task has been successfully been updated",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
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
   * @returns {Promise<{task: TaskDto | Object, message: string, type: number}>}
   */
  const readTask = async (taskId) => {
    try {
      const { document, message, type } = await getDocument(taskId);
      const taskDto = TasksMapper.toDto(document);
      return {
        task: taskDto,
        message: message,
        type: type,
      };
    } catch (error) {
      // Return an error response if the fetch operation fails
      return {
        task: undefined,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   * Archives a task by its ID.
   *
   * @param {import("../../../../types/types").Task} payload - The ID of the task to be archived.
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
      return {
        deleted: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {{description: string, filename: string}} payload
   */
  async function downloadTask(payload) {
    return await convertHtmlToDocx(payload);
  }

  async function getTasks() {
    return await listTasks({ currentPage: getCurrentPageNumber() });
  }

  return {
    createTask,
    getTasks,
    updateTask,
    readTask,
    archiveTask,
    deleteTask,
    listBoardTasks,
    listTasksBySearchTerm,
    downloadTask,
  };
}
