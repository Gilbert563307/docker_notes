import { ALERT_TYPES } from "../../../../shared/presentation/components/bs5/BS5Alert";
import {
  DEFAULT_PROJECT_ID,
  DEFAULT_TASKS_ARCHIVE,
  MAX_BOARD_ITEMS,
  MAX_KAN_BOARDS,
  PRIORITY_FILTER_TYPE_TAGS,
  STATUS_FILTER_TYPE_TAGS,
  TASKS_ARCHIVED_SESSION_FILTER,
  TASKS_PATH,
} from "../../../../config";
import { Task } from "../../domain/Task";
import { Assignee } from "../../domain/Assignee";
import { Reporter } from "../../domain/Reporter";
import { TasksMapper } from "../mapper/TasksMapper";
import { TaskDto } from "../dto/TaskDto";
import { NotificationDto } from "../../../notification/application/dto/NotificationDto";
import { AssigneeDto } from "../dto/AssigneeDto";
import { ReporterDto } from "../dto/ReporterDto.js";
import { ArchiveTaskDto } from "../../presentation/dto/ArchiveTaskDto";
import { CreateTaskDto } from "../../presentation/dto/CreateTaskDto";
import { ListTasksDto } from "./dto/ListTasksDto";
import { GetTasksQueryClausesDto } from "./dto/GetTasksQueryClausesDto";
import { TasksQueries } from "../../domain/TasksQueries";
import { HelpersV2 } from "../../../../shared/helpers/HelpersV2";
import { FirebaseUtil } from "../../../../shared/helpers/FirebaseUtil";

import { orderBy, where } from "firebase/firestore";
import tasksRepository from "../../data/TasksRepository";
import kanBoardsRepository from "../../data/KanBoardsRepository.js";
import { asBlob } from "html-docx-js-typescript";
import { KanBoardMapper } from "../mapper/KanBoardMapper.js";
import { PageAble } from "../../../../firebase_entity_manager/domain/PageAble.js";

/**
 * @typedef {import("../../data/TasksRepository").default} TasksRepository
 */

class TasksService {
  #tasksRepository;
  #kanBoardsRepository;
  #helpers;
  #firebaseUtil;
  #cacheLastDocumentSnapShot = null;
  #cacheFirstDocumentSnapShot = null;

  /**
   *
   * @param {TasksRepository} tasksRepository
   * @param {import("../../data/KanBoardsRepository.js").default} kanBoardsRepository
   * @param {HelpersV2} helpers
   * @param {FirebaseUtil} firebaseUtil
   */
  constructor(tasksRepository, kanBoardsRepository, helpers, firebaseUtil) {
    this.#tasksRepository = tasksRepository;
    this.#kanBoardsRepository = kanBoardsRepository;
    this.#helpers = helpers;
    this.#firebaseUtil = firebaseUtil;
  }

  /**
   * Creates a new task with default values if not provided in the payload.
   *
   * @param {CreateTaskDto} payload - Task details provided by the user.
   * @returns {Promise<{created: boolean, notificationDto: NotificationDto}>} - The result of task creation.
   */
  async createTask(payload) {
    try {
      const userUid = this.#firebaseUtil.getUserUid();
      const userDisplayName = this.#firebaseUtil.getDisplayName();
      // Define default values for the task
      const currentServerTimestamp = this.#tasksRepository.getCurrentServerTimestamp();

      const task = new Task.Builder()
        .id("")
        .projectId(payload.getProjectId() || DEFAULT_PROJECT_ID.toString())
        .userUid(userUid)
        .title(payload.getTitle())
        .description(payload.getDescription())
        .status(payload.getStatus())
        .priority(payload.getPriority())
        .assignee(new Assignee(userDisplayName, userUid))
        .reporter(new Reporter(userDisplayName, userUid))
        .createdAt(currentServerTimestamp)
        .updatedAt(currentServerTimestamp)
        .build();

      // Attempt to add the document to the collection
      this.#tasksRepository.createDocument(task.toJsonWithoutId());

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
  }

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
  async getTotalTasksInDatabaseByUserAndFilters(payload) {
    // Get total records from server according to where clause set by the user
    const queryItems = this.getTasksQueryClauses(new GetTasksQueryClausesDto(payload.getSearchTerm()));
    return await this.#tasksRepository.countDocumentsByQuery(queryItems);
  }

  /**
   * TODO refactor
   * @returns {{filters: Array<number>, notificationDto: NotificationDto}}
   */
  getActiveStatusFilters() {
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
  }

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
  }

  /**
   *
   * @returns {{filters: Array<number>, notificationDto: NotificationDto}}
   */
  getActivePriorityFilters() {
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
  }

  /**
   *
   * @param {GetTasksQueryClausesDto} payload
   * @returns {Array<any>}
   */
  getTasksQueryClauses(payload) {
    const userUid = this.#firebaseUtil.getUserUid();
    // Get the session archived filter
    const tasksArchived = this.#helpers.getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

    const statusFilters = this.getActiveStatusFilters();
    const priorityFilters = this.getActivePriorityFilters();

    const baseQueryItems = [
      where("user_uid", "==", userUid),
      where("archived", "==", tasksArchived),
      orderBy("created_at", "desc"),
    ];

    // @ts-ignore
    const tasksQuerys = new TasksQueries(baseQueryItems);

    if (statusFilters.filters.length > 0) {
      tasksQuerys.addQueryItem(where("status", "in", statusFilters.filters));
    }

    if (priorityFilters.filters.length > 0) {
      tasksQuerys.addQueryItem(where("priority", "in", priorityFilters.filters));
    }

    if (payload.getSearchTerm() && payload.getSearchTerm() != "") {
      const searchTerm = payload.getSearchTerm()?.trim();
      tasksQuerys.addQueryItem(this.#tasksRepository.getSearchQueryBeforeFieldName("title", searchTerm));
      tasksQuerys.addQueryItem(this.#tasksRepository.getSearchQueryAfterFieldName("title", searchTerm));
    }

    return tasksQuerys.getQueryItems();
  }

  /**
   * Generates a Firestore query to fetch tasks for the current page.
   *
   * @param {ListTasksDto} payload - The current page number for pagination.
   * @returns {Promise<Array<any>>}
   */
  async getTasksByQuery(payload) {
    const queryItems = this.getTasksQueryClauses(new GetTasksQueryClausesDto(payload.getSearchTerm()));
    return await this.#tasksRepository.getPaginatedDocumentsByQueryItems(
      new PageAble(queryItems, payload.getCurrentPage(), payload.getItemsPerPage()),
    );
  }

  /**
   *
   * @param {string} searchTearm
   * @returns {Promise<{results: import("../../../../types/types").ListTasks,  notificationDto: NotificationDto }>}
   */
  listTasksBySearchTerm = async (searchTearm) => {
    return await this.#listTasks(
      new ListTasksDto(this.#helpers.getCurrentPageNumber(), this.#helpers.getTheCurrentItemsPerPage(), searchTearm),
    );
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
  #listTasks = async (payload) => {
    try {
      const results = await this.getTasksByQuery(payload);
      const tasksDto = TasksMapper.arrayToDtoList(results);

      //get total records for pagination
      const totalRecords = await this.getTotalTasksInDatabaseByUserAndFilters(payload);

      //get total pages for pagination
      const totalPages = this.#helpers.getTotalPages(totalRecords);
      //return results
      return {
        results: { tasks: tasksDto, total: totalRecords, pages: totalPages },
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        results: { tasks: [], total: 15, pages: 2 },
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  };

  /**
   * @param {{boardId: string}} payload
   * @returns {Promise<{tasks: Array<TaskDto>, notificationDto: NotificationDto}>}
   */
  listBoardTasks = async (payload) => {
    try {
      const userUid = this.#firebaseUtil.getUserUid();
      // Get the session archived filter
      // const tasksArchived = getSessionFilter(TASKS_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

      //THIS IS FOR WHE THE MAIN DEV I STILL HAS TASKS ON THE DEFAULT PROJECT ID
      const boardId = payload.boardId === "0" ? 0 : payload.boardId;

      const results = await this.#tasksRepository.findBoardTasks(userUid, boardId, MAX_BOARD_ITEMS);
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
  updateTask = async (payload) => {
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
        this.#tasksRepository.getCurrentServerTimestamp(),
      );

      const updated = await this.#tasksRepository.updateDocument(task.getId(), task.toJsonWithoutId());
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
  readTask = async (taskId) => {
    try {
      const document = await this.#tasksRepository.readDocument(taskId);
      const kanBaord = await this.#kanBoardsRepository.getKanBoardByProjectId(document?.project_id);

      const taskDto = TasksMapper.toDto({ ...document, projectName: kanBaord?.name });

      return {
        task: taskDto,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      // Return an error response if the fetch operation fails
      return {
        task: this.#getEmptyTaskDto(),
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
  archiveTask = async (payload) => {
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
      const updated = await this.#tasksRepository.updateDocument(task.getId(), task.toJsonWithoutId());

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
  async deleteTask(taskId) {
    try {
      const deleted = await this.#tasksRepository.deleteDocument(taskId);
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

  async listKanBoardsByUser() {
    try {
      const results = await this.#kanBoardsRepository.listKanBoardsByUser(
        this.#firebaseUtil.getUserUid(),
        MAX_KAN_BOARDS,
      );
      return {
        results: KanBoardMapper.arrayToDtoList(results),
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
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
  async downloadTask(payload) {
    if (payload.description === "") {
      return {
        downloaded: false,
        notificationDto: new NotificationDto("Download failed: The file is empty", ALERT_TYPES.INFO),
      };
    }
    return await this.#convertHtmlToDocx(payload);
  }

  async getTasks() {
    return await this.#listTasks(
      new ListTasksDto(this.#helpers.getCurrentPageNumber(), this.#helpers.getTheCurrentItemsPerPage(), undefined),
    );
  }

  /**
   * @param {string} string
   * @returns {string}
   */
  #convertToValidFilename(string) {
    return string.replace(/[\/|\\:*?"<>]/g, " ");
  }

  /**
   * TODO ADD T
   * @param {{description: string, filename: string}} payload
   * @returns {Promise<{downloaded: Boolean, notificationDto: NotificationDto}>}
   */
  async #convertHtmlToDocx(payload) {
    try {
      const { description, filename } = payload;

      const data = await asBlob(description);
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);

      const correct_filename = this.#convertToValidFilename(filename);

      // Create a temporary link to download the DOCX file
      const link = document.createElement("a");
      link.href = url;
      link.download = `${correct_filename}.docx`;
      document.body.appendChild(link);

      // Trigger the download and clean up
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return {
        downloaded: true,
        notificationDto: new NotificationDto("", ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        downloaded: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  /**
   *
   * @param {Map<string, boolean>} mapIdsToDelete
   * @param {{page: number, tasks: Array<TaskDto>, total: number }} currentState
   * @returns {Promise<{tasks:{page: number, tasks: Array<TaskDto>, total: number }, deleted: boolean, notificationDto: NotificationDto }>}
   */
  async deleteMultipleTasks(mapIdsToDelete, currentState) {
    try {
      /**
       * @type {Array<string>}
       */
      const updatedIdsToDelete = [];
      mapIdsToDelete.forEach((value, taskId) => {
        if (value === true) {
          updatedIdsToDelete.push(taskId);
        }
      });

      const deleted = await this.#tasksRepository.deleteMultipleDocuments(updatedIdsToDelete);

      // Check if anything was actually deleted to make the message more accurate
      const count = updatedIdsToDelete.length;
      const message = `${count} task${count !== 1 ? "s" : ""} deleted successfully.`;

      const tasks = currentState.tasks.filter((task) => !updatedIdsToDelete.includes(task.getId()));
      const newSate = {
        tasks: tasks,
        page: currentState.page,
        total: currentState.total - tasks.length,
      };

      return {
        tasks: newSate,
        deleted: deleted,
        notificationDto: new NotificationDto(message, ALERT_TYPES.SUCCESS),
      };
    } catch (error) {
      return {
        tasks: currentState,
        deleted: false,
        notificationDto: new NotificationDto(error.message, ALERT_TYPES.DANGER),
      };
    }
  }

  #getEmptyTaskDto() {
    return new TaskDto(
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
    );
  }
}

const tasksService = new TasksService(tasksRepository, kanBoardsRepository, new HelpersV2(), new FirebaseUtil());

export { tasksService };
