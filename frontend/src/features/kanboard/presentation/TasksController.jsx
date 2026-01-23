import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TasksService from "../application/service/TasksService";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { TaskDto } from "../application/dto/TaskDto";
import { AssigneeDto } from "../application/dto/AssigneeDto";
import { ReporterDto } from "../application/dto/RepoterDto";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";
import { ArchiveTaskDto } from "./dto/ArchiveTaskDto";
import { CreateTaskDto } from "./dto/CreateTaskDto";

/**
 * @typedef {Object} InitialState
 * @property {TaskDto} task - The current task.
 * @property {import("../../../types/types").ListTasks} tasks - The list of tasks.

 */

const initialTaskDto = new TaskDto(
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  new AssigneeDto(null, null),
  new ReporterDto(null, null),
  null,
  null,
  null,
);

/**
 * Initial state for the tasks controller.
 * @type {InitialState}
 */
const initialState = {
  task: initialTaskDto,
  tasks: { tasks: [], total: 0, pages: 0 },
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
  SEARCH_TASKS_BY_SEARCH_TERM: "SEARCH_TASKS_BY_SEARCH_TERM",
  SET_NOTIFICATION: "SET_NOTIFICATION",
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
  }),
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
  const { createTask, getTasks, updateTask, readTask, archiveTask, deleteTask, listTasksBySearchTerm, downloadTask } =
    TasksService();

  // const { getCurrentPageNumber } = useHelpers();
  const navigate = useNavigate();

  const REDUCER_ACTIONS = {
    SET_TASKS: "SET_TASKS", //Action type for setting multiple task's.
    SET_TASK: "SET_TASK", //Action type for setting a task.
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
        return {
          ...state,
          tasks: action.payload,
        };
      case REDUCER_ACTIONS.SET_TASK:
        return {
          ...state,
          task: action.payload,
        };
      default:
        return state;
    }
  }

  // Defining the state and the dispatchAction using the useReducer hook
  const [state, dispatchAction] = useReducer(reducer, initialState);

  /**
   *
   * @param {NotificationDto} notificationDto
   * @returns {void}
   */
  function setNotificationToState(notificationDto) {
    if (notificationDto.getMessage() === "") return;
    notificationObserver.addData(notificationDto);
  }

  function closeAlert() {
    notificationObserver.addData(new NotificationDto("", 0));
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
   * @param {CreateTaskDto} payload
   */
  async function collectCreateTask(payload) {
    const taskCreated = await createTask(payload);

    // Update state with the created task response
    setNotificationToState(taskCreated.notificationDto);

    //reftech tasks afte creating one
    //TODO get state and remogve that task with that uuid no need to refesh or make all to api
    // await refreshTasksList(); //REMOVED BECAUSEWHEN U NAVIGATE TO TASKS THE TASKS IS ALLREADY THERE

    //navugate to tasks page
    navigate("/tasks");
  }

  /**
   *
   */
  async function collectListTasks() {
    const tasks = await getTasks();
    setNotificationToState(tasks.notificationDto);

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_TASKS,
      payload: tasks.results,
    });

    dispatchAction({
      type: REDUCER_ACTIONS.SET_TASK,
      payload: initialTaskDto,
    });
  }

  /**
   *
   * @param {TaskDto} payload
   */
  async function collectUpdateTask(payload) {
    const tbuTask = await updateTask(payload);

    // Update state with the created task response
    setNotificationToState(tbuTask.notificationDto);

    // // get the updated task content
    // const results = await readTask(payload.id);

    // // set taskt to state;
    // dispatchAction({
    //   type: REDUCER_ACTIONS.SET_TASK,
    //   payload: results.task,
    // });
  }

  /**
   *
   * @param {string} taskId
   */
  async function collectReadTask(taskId) {
    // try to find the task in the current state;
    const results = await readTask(taskId);

    // Update state with the created task response
    setNotificationToState(results.notificationDto);

    // set taskt to state;
    dispatchAction({
      type: REDUCER_ACTIONS.SET_TASK,
      payload: results.task,
    });
  }

  /** //TODO MAKE PASS ENTIRE TASK
   *
   * @param {ArchiveTaskDto} payload
   */
  async function collectArchiveTask(payload) {
    const tbuArchived = await archiveTask(payload);

    setNotificationToState(tbuArchived.notificationDto);

    //reftech tasks after archive this one
    await refreshTasksList();
  }

  /**
   *
   * @param {string} taskId
   */
  async function collectDeleteTask(taskId) {
    const tbuDeleted = await deleteTask(taskId);

    setNotificationToState(tbuDeleted.notificationDto);

    //reftech tasks after archive this one
    await refreshTasksList();

    //navugate to tasks page
    navigate("/tasks");
  }

  /**
   *
   * @param {{description: string, filename: string}} payload
   */
  async function collectDownloadTask(payload) {
    const downloaded = await downloadTask(payload);
    setNotificationToState(downloaded.notificationDto);
  }

  /**
   *
   * @param {string} searchTearm
   */
  async function collectListTasksBySearchTerm(searchTearm) {
    const tasks = await listTasksBySearchTerm(searchTearm);
    setNotificationToState(tasks.notificationDto);

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_TASKS,
      payload: tasks.results,
    });
  }

  /**
   * Dispatches actions based on the specified type and payload.
   * @param {{ type: string; payload?: any; }} action - The action object containing type and payload.
   * @returns {Promise<void>} - A Promise that resolves when the operation is completed.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function dispatch(/** @type {{ type: string; payload?: any; }} */ action) {
    try {
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
        case "CLOSE_ALERT":
          closeAlert();
          break;
        default:
          //TODO FIND A LOGGER 
          console.log(`TasksController: No action type found ${action.type}`);
          break;
      }
    } catch (error) {
      setNotificationToState(new NotificationDto(error.message, 1));
    }
  }

  /** @returns {ContextValue} */
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );
  return (
    <tasksControllerContext.Provider value={contextValue}>
      <Outlet />
    </tasksControllerContext.Provider>
  );
}
