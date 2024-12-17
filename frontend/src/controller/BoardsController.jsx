import React, { createContext, useContext, useMemo, useReducer } from 'react'
import TasksLogic from '../model/TasksLogic';
import NotificationV3 from '../view/components/notifications/NotificationV3';
import useBS5PreloaderHook from '../hooks/useBS5PreloaderHook';
import { Outlet } from 'react-router-dom';
import { ALERT_ACTIONS, ALERT_TYPES } from '../view/components/bs5/BS5Alert';


/**
 * @typedef {Object} InitialState
 * @property {import("../types/types").Task | Object} task - The current task.
 * @property {import("../types/types").Tasks | []} tasks - The list of tasks.
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
    tasks: [],
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
 * @property {string} SET_NOTIFICATION - Action type for setting a message.
 */
export const BOARD_CONTROLLER_ACTIONS = {
    LIST: "LIST_TASKS",
    CREATE: "CREATE_TASK",
    READ: "READ_TASK",
    UPDATE: "UPDATE_TASK",
    ARCHIVE: "ARCHIVE_TASK",
    SET_NOTIFICATION: "SET_NOTIFICATION,"
};

/**
 * @typedef {Object} ContextValue
 * @property {InitialState} state - Current state.
 * @property {(object: {type: string, payload?: any}) => void} dispatch - Dispatch function.
 */

// Create context with initial state and dispatch function
const boardsControllerContext = createContext(
  /** @type {ContextValue} */({
        state: initialState,
        dispatch: () => { },
    })
);

/**
 * Custom hook to use the BoardsController context.
 * Throws an error if used outside the BoardsControllerProvider.
 * @returns {ContextValue} The context value.
 */
export const useBoardsControllerContext = () => {
    const context = useContext(boardsControllerContext);
    if (!context) {
        throw new Error(
            "useBoardsControllerContext must be used within a BoardsControllerProvider"
        );
    }
    return context;
};

export default function BoardsController() {
    const { createTask, listBoardTasks, updateTask, } = TasksLogic();

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
    const reducer = (state, action) => {
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

   const setNotificationToState = (object) => {
     if (object.message == "") return;
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
   };

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
     * 
     * @param {{ message: string, type: number }} notification 
     */
    const collectSetNotification = (notification) => {
        setNotificationToState(notification);
    }

    const collectListBoardTasks = async () => {
        try {
            const response = await listBoardTasks();

            // Update state with the created task response
            dispatchAction({
                type: REDUCER_ACTIONS.SET_TASKS,
                payload: response.tasks,
            });
        } catch (error) {
            setErrorToState(error)
        }
    }

    /**
     * 
     * @param {import("../types/types").Task} payload 
     */
    const collectUpdateBoardTask = async (payload) => {
        try {
            const tbuTask = await updateTask(payload);

            if (tbuTask.type != ALERT_TYPES.SUCCESS) {
                // Update state with the created task response
                setNotificationToState(tbuTask);
            }

        } catch (error) {
            setErrorToState(error);
        }
    }

    /**
     * 
     * @param {import("../types/types").createTaskPayload} payload 
     */
    const collectCreateBoardTask = async (payload) => {
        try {
            const taskCreated = await createTask(payload);

            if (taskCreated.type === ALERT_TYPES.DANGER) {
                // Update state with the created task response
                setNotificationToState(taskCreated);
            }

            const { tasks } = await listBoardTasks();

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
    const dispatch = async (
    /** @type {{ type: string; payload?: any; }} */ action
    ) => {
        try {
            // Show loader while processing action
            showLoader();

            // Handle different action types
            switch (action.type) {
                case BOARD_CONTROLLER_ACTIONS.LIST:
                    await collectListBoardTasks();
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
                    console.log(
                        `BoardsController: No action type found ${action.type}`
                    );
                    return;
            }
        } catch (error) {
            // Close loader in case of error
            closeLoader();
            setErrorToState(error);
            console.log(`BoardsController: error ${error}`);
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
        <boardsControllerContext.Provider value={contextValue}>
            {PreloaderComponent}
            <NotificationV3
                controllerContext={useBoardsControllerContext}
            ></NotificationV3>
            <Outlet />
        </boardsControllerContext.Provider>
    )
}
