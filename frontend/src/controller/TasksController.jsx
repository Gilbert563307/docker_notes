import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useBS5PreloaderHook from "../hooks/useBS5PreloaderHook";
import { ALERT_ACTIONS, ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import NotificationV3 from "../view/components/notifications/NotificationV3";
import TasksLogic from "../model/TasksLogic";
import useHelpers from "../helpers/useHelpers";
import FilesLogic from "../model/FilesLogic";

/**
 * @typedef {Array<import("../types/types").Task>} Tasks - State for tasks.
 */

/**
 * @typedef {Object} InitialState
 * @property {import("../types/types").Task | Object} task - The current task.
 * @property {import("../types/types").ListTasks} tasks - The list of tasks.
 * @property {Object} notification - The notification object.
 * @property {string} notification.message - The notification message.
 * @property {number} notification.type - The notification type.
 */

/**
 * Initial state for the tasks controller.
 * @type {InitialState}
 */
const initialState = {
  task: {},
  tasks: { tasks: [], total: 0, pages: 0 },
  notification: { message: "", type: 0 },
};

/**
 * Enum representing different actions for the tasks controller.
 * @typedef {Object} TasksControllerActions
 * @property {string} LIST - Action type for listing tasks.
 * @property {string} CREATE - Action type for creating a task.
 * @property {string} READ - Action type for reading a task.
 * @property {string} UPDATE - Action type for updating a task.
 * @property {string} ARCHIVE - Action type for archiving a task.
 * @property {string} DELETE - Action type for deleting a task.
 * @property {string} UPLOAD_TEMP_IMAGE - Action type for uploading a temp image
 * @property {string} SET_NOTIFICATION - Action type for setting a message.
 */
export const TASKS_CONTROLLER_ACTIONS = {
  LIST: "LIST_TASKS",
  CREATE: "CREATE_TASK",
  READ: "READ_TASK",
  UPDATE: "UPDATE_TASK",
  ARCHIVE: "ARCHIVE_TASK",
  DELETE: "DELETE",
  UPLOAD_TEMP_IMAGE: "UPLOAD_TEMP_IMAGE",
  DOWNLOAD_TASK: "DOWNLOAD_TASK",
  SET_NOTIFICATION: "SET_NOTIFICATION",
  SEARCH_TASKS_BY_SEARCH_TERM: "SEARCH_TASKS_BY_SEARCH_TERM",
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

// Create context with initial state and dispatch function
const tasksControllerContext = createContext(
  /** @type {ContextValue} */ ({
    state: initialState,
    dispatch: () => {},
  })
);

/**
 * Custom hook to use the TasksController context.
 * Throws an error if used outside the TasksControllerProvider.
 * @returns {ContextValue} The context value.
 */
export function useTasksControllerContext() {
  try {
    return useContext(tasksControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * TasksController component that provides an outlet for nested routes.
 * @returns {JSX.Element} The TasksController component.
 */
export default function TasksController() {
  const {
    createTask,
    listTasks,
    updateTask,
    readTask,
    archiveTask,
    deleteTask,
    listTasksBySearchTerm,
  } = TasksLogic();

  const { convertHtmlToDocx } = FilesLogic();
  const { getCurrentPageNumber } = useHelpers();
  const navigate = useNavigate();

  //import the methods and loader component from our custom component
  const { showLoader, closeLoader, PreloaderComponent } = useBS5PreloaderHook();

  const REDUCER_ACTIONS = {
    SET_TASKS: "SET_TASKS", //Action type for setting multiple task's.
    SET_TASK: "SET_TASK", //Action type for setting a task.
    SET_NOTIFICATION: "SET_NOTIFICATION", //Action type for setting a notification.
  };

  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} - Updated state.
   */
  function reducer(state, action) {
    switch (action.type) {
      case REDUCER_ACTIONS.SET_TASKS:
        // console.log('Setting tasks:', action.payload);
        return {
          ...state,
          tasks: action.payload,
        };
      case REDUCER_ACTIONS.SET_TASK:
        // console.log('Setting task:', action.payload);
        return {
          ...state,
          task: action.payload,
        };
      case REDUCER_ACTIONS.SET_NOTIFICATION:
        // console.log('Setting notification:', action.payload);
        return {
          ...state,
          notification: action.payload,
        };
      default:
        return state;
    }
  }

  // Defining the state and the dispatchAction using the useReducer hook
  const [state, dispatchAction] = useReducer(reducer, initialState);

  /**
   *
   * @param {{message: string, type: number}} object
   * @returns {void | null}
   */
  function setNotificationToState(object) {
    if (object.message === "") return;
    // Set the message
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: object,
    });

    // Remove message after 20 seconds
    const timeoutId = setTimeout(() => {
      closeAlert();
    }, 20000);

    // Clear timeout if needed
    return () => clearTimeout(timeoutId);
  }

  /**
   * Sets error to the state and dispatches notification.
   * @param {Error} error - The error object.
   */
  function setErrorToState(error) {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: error.message, type: ALERT_TYPES.DANGER },
    });
  }

  function closeAlert() {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: "", type: 0 },
    });
  }

  /**
   *
   * @param {{ message: string, type: number }} notification
   */
  function collectSetNotification(notification) {
    setNotificationToState(notification);
  }

  /**
   * When a user creates a task, refetch the tasks;
   */
  async function refreshTasksList() {
    // const currentPage = getCurrentPageNumber();
    // const payload = { currentPage: currentPage };
    await collectListTasks();
  }

  /**
   *
   * @param {{title: string, description: string,  priority: number }} payload
   */
  async function collectCreateTask(payload) {
    try {
      const taskCreated = await createTask(payload);

      // Update state with the created task response
      setNotificationToState(taskCreated);

      //reftech tasks afte creating one
      //TODO get state and remogve that task with that uuid no need to refesh or make all to api
      await refreshTasksList();

      //navugate to tasks page
      navigate("/tasks");
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   */
  async function collectListTasks() {
    try {
      //get currentPageNumber
      const currentPage = getCurrentPageNumber();
      //create Payload
      const payload = { currentPage: currentPage };

      const tasks = await listTasks(payload);
      setNotificationToState(tasks);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASKS,
        payload: tasks.results,
      });

      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASK,
        payload: {},
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {import("../types/types").Task} payload
   */
  async function collectUpdateTask(payload) {
    try {
      const tbuTask = await updateTask(payload);

      // Update state with the created task response
      setNotificationToState(tbuTask);

      // get the updated task content
      const results = await readTask(payload.id);

      // set taskt to state;
      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASK,
        payload: results.task,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {string} taskId
   */
  async function collectReadTask(taskId) {
    try {
      // try to find the task in the current state;
      const results = await readTask(taskId);

      // Update state with the created task response
      setNotificationToState(results);

      // set taskt to state;
      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASK,
        payload: results.task,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{id: string, archived: boolean}} payload
   */
  async function collectArchiveTask(payload) {
    try {
      const tbuArchived = await archiveTask(payload);

      setNotificationToState(tbuArchived);

      //reftech tasks after archive this one
      await refreshTasksList();
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {string} taskId
   */
  async function collectDeleteTask(taskId) {
    try {
      const tbuDeleted = await deleteTask(taskId);

      setNotificationToState(tbuDeleted);

      //reftech tasks after archive this one
      await refreshTasksList();

      //navugate to tasks page
      navigate("/tasks");
    } catch (error) {
      setErrorToState(error);
    }
  }

  async function collectDownloadTask(payload) {
    try {
      const downloaded = await convertHtmlToDocx(payload);
      setNotificationToState(downloaded);
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {string} searchTearm
   */
  async function collectListTasksBySearchTerm(searchTearm) {
    try {
      //get currentPageNumber
      const currentPage = getCurrentPageNumber();
      //create Payload
      const payload = { currentPage: currentPage, searchTearm: searchTearm };

      const tasks = await listTasksBySearchTerm(payload);
      setNotificationToState(tasks);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASKS,
        payload: tasks.results,
      });

    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   * Dispatches actions based on the specified type and payload.
   * @param {{ type: string; payload?: any; }} action - The action object containing type and payload.
   * @returns {Promise<void>} - A Promise that resolves when the operation is completed.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function dispatch(
    /** @type {{ type: string; payload?: any; }} */ action
  ) {
    try {
      // Show loader while processing action
      showLoader();

      // Handle different action types
      switch (action.type) {
        case TASKS_CONTROLLER_ACTIONS.CREATE:
          await collectCreateTask(action?.payload);
          break;
        case TASKS_CONTROLLER_ACTIONS.LIST:
          await collectListTasks();
          break;
        case TASKS_CONTROLLER_ACTIONS.UPDATE:
          await collectUpdateTask(action?.payload);
          break;
        case TASKS_CONTROLLER_ACTIONS.READ:
          await collectReadTask(action?.payload);
          break;
        case TASKS_CONTROLLER_ACTIONS.SET_NOTIFICATION:
          collectSetNotification(action?.payload);
          break;
        case TASKS_CONTROLLER_ACTIONS.ARCHIVE:
          await collectArchiveTask(action?.payload);
          break;
        case TASKS_CONTROLLER_ACTIONS.DELETE:
          await collectDeleteTask(action?.payload);
          break;
        case TASKS_CONTROLLER_ACTIONS.DOWNLOAD_TASK:
          await collectDownloadTask(action?.payload);
          break;
        case TASKS_CONTROLLER_ACTIONS.SEARCH_TASKS_BY_SEARCH_TERM:
          await collectListTasksBySearchTerm(action?.payload);
          break;
        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();
          break;
        default:
          console.log(`TasksController: No action type found ${action.type}`);
          break;
      }
    } catch (error) {
      // Close loader in case of error
      closeLoader();
      setErrorToState(error);
      console.log(`TasksController: error ${error}`);
    } finally {
      // Close loader after action processing
      closeLoader();
    }
  }

  /** @returns {ContextValue} */
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );
  return (
    <tasksControllerContext.Provider value={contextValue}>
      {PreloaderComponent}
      <NotificationV3
        controllerContext={useTasksControllerContext}
      ></NotificationV3>
      <Outlet />
    </tasksControllerContext.Provider>
  );
}
