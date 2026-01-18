import { AssigneeDto } from "../dto/AssigneeDto.js";
import { ReporterDto } from "../dto/RepoterDto.js";
import { TaskDto } from "../dto/TaskDto.js";

export class TasksMapper {
  /**
   *
   * @param {Array<import("../../../../types/types.js").Task>} arrayList
   * @returns {Array<TaskDto>}
   */
  static arrayToDtoList(arrayList) {
    return arrayList.map((task) => this.toDto(task));
  }

  /**
   *
   * @param {import("../../../../types/types.js").Task} task
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
}
