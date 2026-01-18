import { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet } from "react-router-dom";
import { ALERT_ACTIONS, ALERT_TYPES } from "../../../shared/components/bs5/BS5Alert";
import TasksService from "../application/service/TasksService";
import { notificationObserver } from "../../notification/observer/NotificationObserver";

/**
 * @typedef {Object} InitialState
 * @property {import("../../../types/types").Task | Object} task - The current task.
 * @property {import("../../../types/types").Tasks | []} tasks - The list of tasks.
 */

/**
 * Initial state for the tasks controller.
 * @type {InitialState}
 */
const initialState = {
  task: {},
  tasks: []
};

/**
 * Enum representing different actions for the tasks controller.
 * @typedef {Object} TasksControllerActions
 * @property {string} LIST - Action type for listing tasks.
 * @property {string} CREATE - Action type for creating a task.
 * @property {string} READ - Action type for reading a task.
 * @property {string} UPDATE - Action type for updating a task.
 * @property {string} ARCHIVE - Action type for archiving a task.
 */
export const BOARD_CONTROLLER_ACTIONS = {
  LIST: "LIST_TASKS",
  CREATE: "CREATE_TASK",
  READ: "READ_TASK",
  UPDATE: "UPDATE_TASK",
  ARCHIVE: "ARCHIVE_TASK",
  SET_NOTIFICATION: "SET_NOTIFICATION"
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

// Create context with initial state and dispatch function
const boardsControllerContext = createContext(
  /** @type {ContextValue} */ ({
    state: initialState,
    dispatch: () => {},
  })
);

/**
 * Custom hook to use the BoardsController context.
 * Throws an error if used outside the BoardsControllerProvider.
 * @returns {ContextValue} The context value.
 */
export function useBoardsControllerContext() {
  try {
    return useContext(boardsControllerContext);
  } catch (error) {
    throw new Error(error.message);
  }
}

export default function BoardsController() {
  const { createTask, listBoardTasks, updateTask } = TasksService();

  const REDUCER_ACTIONS = {
    SET_TASKS: "SET_TASKS", //Action type for setting multiple task's.
    SET_TASK: "SET_TASK" //Action type for setting a task.
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
   * @param {{message: string, type: number}} object
   * @returns {void | null}
   */
  function setNotificationToState(object) {
    if (object.message === "") return;
    notificationObserver.addData(object);
  }

  /**
   * Sets error to the state and dispatches notification.
   * @param {Error} error - The error object.
   */
  function setErrorToState(error) {
    notificationObserver.addData({ message: error.message, type: ALERT_TYPES.DANGER });
  }

   function closeAlert() {
    notificationObserver.addData({ message: "", type: 0 });
  }

  /**
   *
   * @param {{ message: string, type: number }} notification
   */
  function collectSetNotification(notification) {
    setNotificationToState(notification);
  }

  /**
   * @param {{boardId: string}} payload
   */
  async function collectListBoardTasks(payload) {
    try {
      const response = await listBoardTasks(payload);
      setNotificationToState(response);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASKS,
        payload: response.tasks,
      });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{task:import("../../../types/types").Task, boardId: string }} payload
   */
  async function collectUpdateBoardTask(payload) {
    try {
      
      const taskPayload = payload.task;
      const tbuTask = await updateTask(taskPayload);

      if (tbuTask.type != ALERT_TYPES.SUCCESS) {
        // Update state with the created task response
        setNotificationToState(tbuTask);
      }
      await collectListBoardTasks({ boardId: payload.boardId });
    } catch (error) {
      setErrorToState(error);
    }
  }

  /**
   *
   * @param {{task: import("../../../types/types").createTaskPayload, boardId: string}} payload
   */
  async function collectCreateBoardTask(payload) {
    try {
      const task = {...payload.task, project_id: payload.boardId};

      const taskCreated = await createTask(task);

      if (taskCreated.type === ALERT_TYPES.DANGER) {
        // Update state with the created task response
        setNotificationToState(taskCreated);
      }

      const { tasks } = await listBoardTasks({ boardId: payload.boardId });

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASKS,
        payload: tasks,
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

      // Handle different action types
      switch (action.type) {
        case BOARD_CONTROLLER_ACTIONS.LIST:
          await collectListBoardTasks(action?.payload);
          return;
        case BOARD_CONTROLLER_ACTIONS.UPDATE:
          await collectUpdateBoardTask(action?.payload);
          return;

        case BOARD_CONTROLLER_ACTIONS.CREATE:
          await collectCreateBoardTask(action?.payload);
          return;

        case BOARD_CONTROLLER_ACTIONS.SET_NOTIFICATION:
          collectSetNotification(action?.payload);
          return;

        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();
          return;
        default:
          console.log(`BoardsController: No action type found ${action.type}`);
          return;
      }
    } catch (error) {
      // Close loader in case of error
      setErrorToState(error);
      console.log(`BoardsController: error ${error}`);
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
    <boardsControllerContext.Provider value={contextValue}>
      <Outlet />
    </boardsControllerContext.Provider>
  );
}
