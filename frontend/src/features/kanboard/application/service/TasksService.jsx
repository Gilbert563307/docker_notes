import { ALERT_ACTIONS, ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
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
import useHelpers from "../../../../shared/helpers/useHelpers";
import FirebaseInterface from "../../../../shared/data/FirebaseInterface";
import { Task } from "../../domain/Task";
import { Assignee } from "../../domain/Assignee";
import { Reporter } from "../../domain/Reporter";
import { TasksMapper } from "../mapper/TasksMapper";
import { TaskDto } from "../dto/TaskDto";
import FilesService from "../../../../shared/application/service/FilesService";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import { AssigneeDto } from "../dto/AssigneeDto";
import { ReporterDto } from "../dto/RepoterDto";
import { ArchiveTaskDto } from "../../presentation/dto/ArchiveTaskDto";
import { CreateTaskDto } from "../../presentation/dto/CreateTaskDto";
import FirebaseInterfaceV2 from "../../../../shared/data/FirebaseInterfaceV2";
import { Query } from "firebase/firestore";
import { CollectionManager } from "../../../../firebase_entitymanager/CollectionManager";
import { db } from "../../../../database/firebaseConfig";
import { ListTasksDto } from "./dto/ListTasksDto";
import { GetTasksQueryClausesDto } from "./dto/GetTasksQueryClausesDto";
import { TasksQueries } from "../../domain/TasksQueries";

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

const collectionManager = new CollectionManager("tasks", db);

export default function TasksService() {
  const {
    getSessionFilter,
    getHowManyFiltersAreActiveByCurrentPath,
    getCurrentPageNumber,
    getTheCurrentItemsPerPage,
    getTotalPages,
  } = useHelpers();
  const { convertHtmlToDocx } = FilesService();

  // const {
  //   collectionRef,
  //   userUid,
  //   addDoc,
  //   query,
  //   where,
  //   getDocs,
  //   limit,
  //   getCountFromServer,
  //   getTotalPages,
  //   getTheCurrentItemsPerPage,
  //   currentServerTimestamp,
  //   orderBy,
  //   doc,
  //   db,
  //   table,
  //   updateDoc,
  //   deleteDoc,
  //   getSearchQueryByFieldName,
  //   convertQuerySnapShotDocs,
  //   fetchResultsOnPageOne,
  //   fetchPaginatedResults,
  //   getDocument,
  // } = FirebaseInterface({ table: "tasks" });

  const { userUid, user, BACKEND_URL, X_TOKEN } = FirebaseInterfaceV2();

  /**
   * Creates a new task with default values if not provided in the payload.
   *
   * @param {CreateTaskDto} payload - Task details provided by the user.
   * @returns {Promise<{created: boolean, notificationDto: NotificationDto}>} - The result of task creation.
   */
  const createTask = async (payload) => {
    try {
      // Define default values for the task
      const currentServerTimestamp = collectionManager.getCurrentServerTimestamp();
      const task = new Task(
        "",
        payload.getProjectId() || DEFAULT_PROJECT_ID.toString(),
        userUid,
        payload.getTitle(),
        payload.getDescription() || "",
        payload.getStatus() || TASKS_STATUS.TODO,
        payload.getPriority() || TASKS_PRIORITY.LOW,
        new Assignee(user.getDisplayName(), user.getUid()),
        new Reporter(user.getDisplayName(), user.getUid()),
        false,
        currentServerTimestamp,
        currentServerTimestamp,
      );

      // Attempt to add the document to the collection
      collectionManager.createDocument(task.toJsonWithoutId());

      // Return success message if task creation was successful
      return {
        created: true,
        notificationDto: new NotificationDto("Your task has been created", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // Return error message in case of failure
      return {
        created: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
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
   * @param {ListTasksDto} payload
   * @returns {Promise<number>} A promise that resolves to the total count of tasks.
   * @throws {Error} If there's an error while retrieving the total count of tasks.
   */
  const getTotalTasksInDatabaseByUserAndFilters = async (payload) => {
    try {
      // Get total records from server according to where clause set by the user
      const { queryItems } = getTasksQueryClauses(new GetTasksQueryClausesDto(payload.getSearchTerm()));
      return await collectionManager.countDocumentsByQuery(queryItems);
    } catch (error) {
      return 0;
    }
  };

  /**
   * TODO refactor
   * @returns {{filters: Array<number>, notificationDto: NotificationDto}}
   */
  const getActiveStatusFilters = () => {
    try {
      const { names } = getActiveFiltersNamesOnTaskPath();

      // Filter and retrieve active status tags based on task names.
      const results = STATUS_FILTER_TYPE_TAGS.filter((tag) => names.includes(tag.config)).map((tag) => tag.value);

      // Return successful response with active status filters.
      return {
        filters: results,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // On error, return a response with error message and danger alert type.
      return {
        filters: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   *
   * @returns {{names: Array<string>, notificationDto: NotificationDto}}
   */
  const getActiveFiltersNamesOnTaskPath = () => {
    try {
      // Retrieve all active filters by the current task path.
      const allActiveFilters = getHowManyFiltersAreActiveByCurrentPath(TASKS_PATH);

      // If no active filters, return default success response with empty filters.
      if (allActiveFilters.length === 0) {
        return {
          names: [],
          notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
        };
      }

      // Map active filters to their task names.
      const activeStatusTasksNames = allActiveFilters.map((task) => task.name);

      return {
        names: activeStatusTasksNames,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // On error, return a response with error message and danger alert type.
      return {
        names: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   *
   * @returns {{filters: Array<number>, notificationDto: NotificationDto}}
   */
  const getActivePriorityFilters = () => {
    try {
      const { names } = getActiveFiltersNamesOnTaskPath();

      // Filter and retrieve active status tags based on task names.
      const results = PRIORITY_FILTER_TYPE_TAGS.filter((tag) => names.includes(tag.config)).map((tag) => tag.value);

      // Return successful response with active status filters.
      return {
        filters: results,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // On error, return a response with error message and danger alert type.
      return {
        filters: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   *
   * @param {GetTasksQueryClausesDto} payload
   */
  function getTasksQueryClauses(payload) {
    try {
      // Get the session archived filter
      const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

      const statusFilters = getActiveStatusFilters();
      const priorityFilters = getActivePriorityFilters();

      const baseQueryItems = [
        collectionManager.whereQuery("user_uid", "==", userUid),
        collectionManager.whereQuery("archived", "==", tasksArchived),
        collectionManager.orderByQuery("created_at", "desc"),
      ];

      // @ts-ignore
      const tasksQuerys = new TasksQueries(baseQueryItems);

      if (statusFilters.filters.length > 0) {
        tasksQuerys.addQueryItem(collectionManager.whereQuery("status", "in", statusFilters.filters));
      }

      if (priorityFilters.filters.length > 0) {
        tasksQuerys.addQueryItem(collectionManager.whereQuery("priority", "in", priorityFilters.filters));
      }

      if (payload.getSearchTerm() && payload.getSearchTerm() != "") {
        const searchTerm = payload.getSearchTerm()?.trim();
        tasksQuerys.addQueryItem(collectionManager.getSearchQueryBeforeFieldName("title", searchTerm));
        tasksQuerys.addQueryItem(collectionManager.getSearchQueryAfterFieldName("title", searchTerm));
      }


      return {
        queryItems: tasksQuerys.getQueryItems(),
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        queryItems: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   * Generates a Firestore query to fetch tasks for the current page.
   *
   * @param {ListTasksDto} payload - The current page number for pagination.
   * @returns {Promise<{documents: Array<any>, notificationDto: NotificationDto}>} The Firestore query to fetch tasks for the specified page.
   */
  const getTasksByQuery = async (payload) => {
    try {
      const { queryItems } = getTasksQueryClauses(new GetTasksQueryClausesDto(payload.getSearchTerm()));

      const documents = await collectionManager.getPaginatedDocumentsByQueryItems(
        queryItems,
        payload.getCurrentPage(),
        payload.getItemsPerPage(),
      );

      return {
        documents: documents,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        documents: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   *
   * @param {string} searchTearm
   * @returns {Promise<{results: import("../../../../types/types").ListTasks,  notificationDto: NotificationDto }>}
   */
  const listTasksBySearchTerm = async (searchTearm) => {
    return await listTasks(new ListTasksDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), searchTearm));
  };

  /**
   * Fetches a list of tasks for the current user.
   *
   * This function queries the Firestore collection to retrieve tasks associated with the current user's UID,
   * with a limit on the number of items per page. It includes the document ID in the task data and handles
   * potential errors during the fetch process.
   * @param {ListTasksDto} payload
   * @returns {Promise<{results: import("../../../../types/types").ListTasks,  notificationDto: NotificationDto }>} A promise that resolves to an object containing the fetched tasks, a message, and an alert type.
   */
  const listTasks = async (payload) => {
    try {
      const results = await getTasksByQuery(payload);
      const tasksDto = TasksMapper.arrayToDtoList(results.documents);

      //get total records for pagination
      const totalRecords = await getTotalTasksInDatabaseByUserAndFilters(payload);

      //get total pages for pagination
      const totalPages = getTotalPages(totalRecords);
      //return results
      return {
        results: { tasks: tasksDto, total: totalRecords, pages: totalPages },
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        results: { tasks: [], total: 0, pages: 0 },
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   * @param {{boardId: string}} payload
   * @returns {Promise<{tasks: Array<TaskDto>, notificationDto: NotificationDto}>}
   */
  const listBoardTasks = async (payload) => {
    try {
      // Get the session archived filter
      // const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

      //THIS IS FOR WHE THE MAIN DEV I STILL HAS TASKS ON THE DEFAULT PROJECT ID
      const boardId = payload.boardId === "0" ? 0 : payload.boardId;

      const query = collectionManager.createQuery([
        collectionManager.whereQuery("user_uid", "==", userUid),
        // where("archived", "==", tasksArchived),
        collectionManager.whereQuery("project_id", "==", boardId),
        collectionManager.orderByQuery("updated_at", "desc"),
        collectionManager.limitByQuery(MAX_BOARD_ITEMS),
      ]);

      const results = await collectionManager.getDocumentsByQuery(query);
      const tasksDto = TasksMapper.arrayToDtoList(results);

      return {
        tasks: tasksDto,
        notificationDto: new NotificationDto("", ALERT_TYPES.PRIMARY),
      };
    } catch (error) {
      return {
        tasks: [],
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   *
   * @param {TaskDto} payload
   * @returns {Promise<{ updated: boolean, notificationDto: NotificationDto }>}
   */
  const updateTask = async (payload) => {
    try {
      const task = TasksMapper.fromDtoToEntity(payload);

      // manually updated the updated_at
      task.update(
        task.getProjectId(),
        task.getUserUid(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus(),
        task.getPriority(),
        task.getAssignee(),
        task.getReporter(),
        task.getIsArchived(),
        task.getCreatedAt(),
        collectionManager.getCurrentServerTimestamp(),
      );

      const updated = await collectionManager.updateDocument(task.getId(), task.toJsonWithoutId());
      return {
        updated: updated,
        notificationDto: new NotificationDto("Your task has been successfully been updated", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        updated: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   * Fetches a task from the database by its ID.
   * @param {string} taskId
   * @returns {Promise<{task: TaskDto | Object, notificationDto: NotificationDto}>}
   */
  const readTask = async (taskId) => {
    try {
      const document = await collectionManager.readDocument(taskId);
      const taskDto = TasksMapper.toDto(document);
      return {
        task: taskDto,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // Return an error response if the fetch operation fails
      return {
        task: initialTaskDto,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   * Archives a task by its ID.
   *
   * @param {ArchiveTaskDto} payload - The ID of the task to be archived.
   * @returns {Promise<{ archived: boolean, notificationDto: NotificationDto }>} - A promise that resolves to an object indicating the result of the archiving process.
   */
  const archiveTask = async (payload) => {
    try {
      const task = TasksMapper.fromDtoToEntity(payload.getTaskDto());
      task.update(
        task.getProjectId(),
        task.getUserUid(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus(),
        task.getPriority(),
        task.getAssignee(),
        task.getReporter(),
        payload.getIsArchived(),
        task.getCreatedAt(),
        task.getUpdatedAt(),
      );
      const updated = await collectionManager.updateDocument(task.getId(), TasksMapper.fromEntityToDto(task));

      return {
        archived: updated,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // Return an error response if the update operation fails
      return {
        archived: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   *
   * @param {string} taskId
   * @returns {Promise<{ deleted: boolean, notificationDto: NotificationDto }>}
   */
  async function deleteTask(taskId) {
    try {
      const deleted = await collectionManager.deleteDocument(taskId);
      return {
        deleted: deleted,
        notificationDto: new NotificationDto("Your task has been deleted", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        deleted: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
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
    return await listTasks(new ListTasksDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), undefined));
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
