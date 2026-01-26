/* eslint-disable no-undef */
import assert from "node:assert";
import { Timestamp } from "firebase/firestore";
import { TASKS_STATUS, TASKS_PRIORITY, DEFAULT_PROJECT_ID } from "../src/config";
import { Assignee } from "../src/features/kanboard/domain/Assignee";
import { Reporter } from "../src/features/kanboard/domain/Reporter";
import { Task } from "../src/features/kanboard/domain/Task";

describe("Task domain", () => {
  it("should expose correct domain data via getters", () => {
    // Arrange
    const id = "task-1";
    const projectId = DEFAULT_PROJECT_ID.toString();
    const userUid = "user-1";
    const title = "Test task";
    const description = "Task description";
    const status = TASKS_STATUS.TODO;
    const priority = TASKS_PRIORITY.MEDIUM;
    const assignee = new Assignee("Alice", "assignee-1");
    const reporter = new Reporter("Bob", "reporter-1");
    const archived = false;
    const createdAt = Timestamp.now();
    const updatedAt = Timestamp.now();

    const task = new Task(
      id,
      projectId,
      userUid,
      title,
      description,
      status,
      priority,
      assignee,
      reporter,
      archived,
      createdAt,
      updatedAt
    );

    // Assert
    assert.strictEqual(task.getId(), id);
    assert.strictEqual(task.getProjectId(), projectId);
    assert.strictEqual(task.getUserUid(), userUid);
    assert.strictEqual(task.getTitle(), title);
    assert.strictEqual(task.getDescription(), description);
    assert.strictEqual(task.getStatus(), status);
    assert.strictEqual(task.getPriority(), priority);
    assert.strictEqual(task.getAssignee(), assignee);
    assert.strictEqual(task.getReporter(), reporter);
    assert.strictEqual(task.getIsArchived(), archived);
    assert.strictEqual(task.getCreatedAt(), createdAt);
    assert.strictEqual(task.getUpdatedAt(), updatedAt);
  });
});
