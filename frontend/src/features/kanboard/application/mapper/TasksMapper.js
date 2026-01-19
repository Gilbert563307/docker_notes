import { Assignee } from "../../domain/Assignee.js";
import { Reporter } from "../../domain/Reporter.js";
import { Task } from "../../domain/Task.js";
import { AssigneeDto } from "../dto/AssigneeDto.js";
import { ReporterDto } from "../dto/RepoterDto.js";
import { TaskDto } from "../dto/TaskDto.js";

export class TasksMapper {
  /**
   *
   * @param {Array<Object>} arrayList
   * @returns {Array<TaskDto>}
   */
  static arrayToDtoList(arrayList) {
    return arrayList.map((task) => this.toDto(task));
  }

  /**
   *
   * @param {Object} task
   * @returns {TaskDto}
   */
  static toDto(task) {
    return new TaskDto(
      task.id,
      task.project_id,
      task.user_uid,
      task.title,
      task.description,
      task.status,
      task.priority,
      new AssigneeDto(task.assignee.name, task.assignee.assignee_id),
      new ReporterDto(task.reporter.name, task.reporter.assignee_id),
      task.archived,
      task.created_at,
      task.updated_at,
    );
  }

  /**
   * @param {TaskDto} taskDto
   * @returns {Task}
   */
  static fromDtoToEntity(taskDto) {
    return new Task(
      taskDto.getId(),
      taskDto.getProjectId(),
      taskDto.getUserUid(),
      taskDto.getTitle(),
      taskDto.getDescription(),
      taskDto.getStatus(),
      taskDto.getPriority(),
      new Assignee(taskDto.getAssigneeName(), taskDto.getAssigneeId()),
      new Reporter(taskDto.getAssigneeName(), taskDto.getAssigneeId()),
      taskDto.getIsArchived(),
      taskDto.getCreatedAt(),
      taskDto.getUpdatedAt(),
    );
  }

  /**
   *
   * @param {Task} task
   */
  static fromEntityToDto(task) {
    return new TaskDto(
      task.getId(),
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
      task.getUpdatedAt(),
    );
  }
}
