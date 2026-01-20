import { createContext, useContext, useMemo, useReducer } from "react";
import { Outlet } from "react-router-dom";
import TasksService from "../application/service/TasksService";
import { notificationObserver } from "../../notification/observer/NotificationObserver";
import { NotificationDto } from "../../notification/application/dto/NotificationDto";
import { TaskDto } from "../application/dto/TaskDto";
import { AssigneeDto } from "../application/dto/AssigneeDto";
import { ReporterDto } from "../application/dto/RepoterDto";
import { UpdateBoardTaskDto } from "./dto/UpdateBoardTaskDto";
import { CreateTaskDto } from "./dto/CreateTaskDto";

/**
 * @typedef {Object} InitialState
 * @property {TaskDto} task - The current task.
 * @property {Array<TaskDto>} tasks - The list of tasks.
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
)

/**
 * Initial state for the tasks controller.
 * @type {InitialState}
 */
const initialState = {
  task: initialTaskDto,
  tasks: [],
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
  ARCHIVE: "ARCHIVE_TASK"
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
  }),
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
   * @param {{boardId: string}} payload
   */
  async function collectListBoardTasks(payload) {
    const response = await listBoardTasks(payload);
    setNotificationToState(response.notificationDto);

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_TASKS,
      payload: response.tasks,
    });
  }

  /**
   *
   * @param {UpdateBoardTaskDto} payload
   */
  async function collectUpdateBoardTask(payload) {
    const tbuTask = await updateTask(payload.getTaskDto());

    setNotificationToState(tbuTask.notificationDto);
    await collectListBoardTasks({ boardId: payload.getBoardId() });
  }

  /**
   *
   * @param {CreateTaskDto} payload
   */
  async function collectCreateBoardTask(payload) {

    const taskCreated = await createTask(payload);
    setNotificationToState(taskCreated.notificationDto);

    const { tasks } = await listBoardTasks({ boardId: payload.getProjectId() });

    // Update state with the created task response
    dispatchAction({
      type: REDUCER_ACTIONS.SET_TASKS,
      payload: tasks,
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
        case BOARD_CONTROLLER_ACTIONS.LIST:
          await collectListBoardTasks(action?.payload);
          return;
        case BOARD_CONTROLLER_ACTIONS.UPDATE:
          await collectUpdateBoardTask(action?.payload);
          return;

        case BOARD_CONTROLLER_ACTIONS.CREATE:
          await collectCreateBoardTask(action?.payload);
          return;

        case "CLOSE_ALERT":
          closeAlert();
          return;
        default:
          console.log(`BoardsController: No action type found ${action.type}`);
          return;
      }
    } catch (error) {
      // Close loader in case of error
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
    <boardsControllerContext.Provider value={contextValue}>
      <Outlet />
    </boardsControllerContext.Provider>
  );
}
