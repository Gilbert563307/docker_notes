import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Outlet } from 'react-router-dom';
import useBS5PreloaderHook from '../hooks/useBS5PreloaderHook';
import { ALERT_ACTIONS, ALERT_TYPES } from '../view/components/bs5/BS5Alert';
import NotificationV3 from '../view/components/notifications/NotificationV3';
import TasksLogic from '../model/TasksLogic';

/**
 * @typedef {Object} Task
 * @property {number} id - The unique identifier for the task.
 * @property {string} user_uid - The unique identifier for the user.
 * @property {string} title - The title of the task.
 * @property {string} description - The description of the task.
 * @property {integer} status - The status of the task.
 * @property {integer} priority - The priority level of the task.
 */

/**
 * @typedef {Array<Task>} Tasks - State for tasks.
 */

/**
 * @typedef {Object} InitialState
 * @property {Task | Object} task - The current task.
 * @property {{ tasks: Tasks, lastVisibleTask: {}}} tasks - The list of tasks.
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
  tasks: { tasks: [], lastVisibleTask: {} },
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
 */
export const TASKS_CONTROLLER_ACTIONS = {
  LIST: "LIST_TASKS",
  CREATE: "CREATE_TASK",
  READ: "READ_TASK",
  UPDATE: "UPDATE_TASK",
  ARCHIVE: "ARCHIVE_TASK",
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

// Create context with initial state and dispatch function
const tasksControllerContext = createContext(
  /** @type {ContextValue} */({
    state: initialState,
    dispatch: () => { },
  })
);

/**
 * Custom hook to use the TasksController context.
 * Throws an error if used outside the TaksControllerProvider.
 * @returns {ContextValue} The context value.
 */
export const useTasksControllerContext = () => {
  const context = useContext(tasksControllerContext);
  if (!context) {
    throw new Error(
      "useTasksControllerContext must be used within a TasksControllerProvider"
    );
  }
  return context;
};

/**
 * TasksController component that provides an outlet for nested routes.
 * @returns {JSX.Element} The TasksController component.
 */
export default function TasksController() {
  const { createTask, listTasks } = TasksLogic();

  //import the methods and loader component from our custom component
  const { showLoader, closeLoader, PreloaderComponent } = useBS5PreloaderHook();

  const REDUCER_ACTIONS = {
    SET_NOTIFICATION: "SET_NOTIFICATION", //Action type for setting a notification.
  };

  /**
   * Reducer function for managing state changes.
   * @param {InitialState} state - Current state.
   * @param {Object} action - Action object containing type and payload.
   * @returns {Object} - Updated state.
   */
  const reducer = (state, action) => {
    switch (action.type) {
      case REDUCER_ACTIONS.SET_TASKS:
        return {
          ...state,
          tasks: action.payload,
        }

      case REDUCER_ACTIONS.SET_NOTIFICATION:
        return {
          ...state,
          notification: action.payload,
        };
      default:
        return state;
    }
  };

  // Defining the state and the dispatchAction using the useReducer hook
  const [state, dispatchAction] = useReducer(reducer, initialState);


  /**
   * 
   * @param {{title: string, description: string,  priority: number }} payload 
   */
  const collectCreateTask = async (payload) => {
    try {
      const taskCreated = await createTask(payload);

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_NOTIFICATION,
        payload: taskCreated,
      });

      //reftech tasks afte creating one
      await collectListTasks();
    } catch (error) {
      setErrorToState(error);
    }
  }


  const collectListTasks = async () => {
    try {
      const tasks = await listTasks();

      // Update state with the created task response
      dispatchAction({
        type: REDUCER_ACTIONS.SET_TASKS,
        payload: tasks.results,
      });

    } catch (error) {
      setErrorToState(error)
    }
  }


  /**
   * Sets error to the state and dispatches notification.
   * @param {Error} error - The error object.
   */
  const setErrorToState = (error) => {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: error.message, type: ALERT_TYPES.DANGER },
    });
  };

  const closeAlert = () => {
    dispatchAction({
      type: REDUCER_ACTIONS.SET_NOTIFICATION,
      payload: { message: "", type: 0 },
    });
  };


  /**
  * Dispatches actions based on the specified type and payload.
  * @param {{ type: string; payload?: any; }} action - The action object containing type and payload.
  * @returns {Promise<void>} - A Promise that resolves when the operation is completed.
  */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatch = async (
    /** @type {{ type: string; payload?: any; }} */ action
  ) => {
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
        case ALERT_ACTIONS.CLOSE_ALERT:
          closeAlert();
          break;
        default:
          console.log(
            `TasksController: No action type found ${action.type}`
          );
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
  };

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
