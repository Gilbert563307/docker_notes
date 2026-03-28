import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
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
import { db } from "../../../../database/firebaseConfig";
import { ListTasksDto } from "./dto/ListTasksDto";
import { GetTasksQueryClausesDto } from "./dto/GetTasksQueryClausesDto";
import { TasksQueries } from "../../domain/TasksQueries";
import { CollectionManager } from "../../../../firebase_entity_manager/CollectionManager";
import { KanBoardMapper } from "../mapper/KanBoardMapper";

/** @typedef {import("../service/CombinationGameService").default} CombinationGameService */


/** @typedef {import("../../../../shared/helpers/Helpers").default} Helpers */


export class TasksService{
    #collectionManager;
    #helpers;
    #firebaseUtil;
    #initialTaskDto = new TaskDto(
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
  null,
)


    /**
     * 
     * @param {CollectionManager} collectionManager 
     * @param {Helpers} helpers 
     * @param {*} firebaseUtil 
     */
    constructor(collectionManager, helpers, firebaseUtil){
        this.#collectionManager = collectionManager;
        this.#helpers = helpers;
        this.#firebaseUtil = firebaseUtil;
    }

    
    /**
       * Creates a new task with default values if not provided in the payload.
       *
       * @param {CreateTaskDto} payload - Task details provided by the user.
       * @returns {Promise<{created: boolean, notificationDto: NotificationDto}>} - The result of task creation.
       */
      async  createTask (payload){
        try {
          // Define default values for the task
          const currentServerTimestamp = this.#collectionManager.getCurrentServerTimestamp();
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
    
          //TODO THINK IF WE NEED BUILDER PATTERN IN FUTURE
          // const task = new Task.Builder()
          //   .projectId(payload.getProjectId() || DEFAULT_PROJECT_ID.toString())
          //   .userUid(userUid)
          //   .title(payload.getTitle())
          //   .description(payload.getDescription() || "")
          //   .status(payload.getStatus() || TASKS_STATUS.TODO)
          //   .priority(payload.getPriority() || TASKS_PRIORITY.LOW)
          //   .assignee(new Assignee(user.getDisplayName(), user.getUid()))
          //   .reporter(new Reporter(user.getDisplayName(), user.getUid()))
          //   .archived(false)
          //   .createdAt(currentServerTimestamp)
          //   .updatedAt(currentServerTimestamp)
          //   .build();
    
          // Attempt to add the document to the collection
          this.#collectionManager.createDocument(task.toJsonWithoutId());
    
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
       */
       async getTotalTasksInDatabaseByUserAndFilters (payload){
        // Get total records from server according to where clause set by the user
        const queryItems = this.getTasksQueryClauses(new GetTasksQueryClausesDto(payload.getSearchTerm()));
        return await this.#collectionManager.countDocumentsByQuery(queryItems);
      };
    
      /**
       * TODO refactor
       * @returns {{filters: Array<number>, notificationDto: NotificationDto}}
       */
        getActiveStatusFilters () {
        try {
          const { names } = this.getActiveFiltersNamesOnTaskPath();
    
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
       getActiveFiltersNamesOnTaskPath() {
        try {
          // Retrieve all active filters by the current task path.
          const allActiveFilters = this.#helpers.getHowManyFiltersAreActiveByCurrentPath(TASKS_PATH);
    
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
       getActivePriorityFilters(){
        try {
          const { names } = this.getActiveFiltersNamesOnTaskPath();
    
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
       * @returns {Array<any>}
       */
       getTasksQueryClauses(payload) {
        // Get the session archived filter
        const tasksArchived = this.#helpers.getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;
    
        const statusFilters = getActiveStatusFilters();
        const priorityFilters = getActivePriorityFilters();
    
        const baseQueryItems = [
          this.#helpers.collectionManager.whereQuery("user_uid", "==", userUid),
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
    
        return tasksQuerys.getQueryItems();
      }
    
      /**
       * Generates a Firestore query to fetch tasks for the current page.
       *
       * @param {ListTasksDto} payload - The current page number for pagination.
       * @returns {Promise<{documents: Array<any>, notificationDto: NotificationDto}>} The Firestore query to fetch tasks for the specified page.
       */
      const getTasksByQuery = async (payload) => {
        try {
          const queryItems = getTasksQueryClauses(new GetTasksQueryClausesDto(payload.getSearchTerm()));
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
          const document = await this.#collectionManager.readDocument(taskId);
          const kanBaord = await this.#collectionManager.readDocumentFromCollection("kanboards", document?.project_id);
          const taskDto = TasksMapper.toDto( {...document, projectName: kanBaord?.name});
    
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
    
      async function listKanBoardsByUser() {
        
      }
    
      /**
       *
       * @param {{description: string, filename: string}} payload
       */
      async function downloadTask(payload) {
        if (payload.description === "") {
          return {
            downloaded: false,
            notificationDto: new NotificationDto("Download failed: The file is empty", ALERT_TYPES.INFO),
          };
        }
        return await convertHtmlToDocx(payload);
      }
    
      async function getTasks() {
        return await listTasks(new ListTasksDto(getCurrentPageNumber(), getTheCurrentItemsPerPage(), undefined));
      }
}