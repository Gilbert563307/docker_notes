import assert from "node:assert";
import { KanBoard } from "../src/features/kanboard/domain/KanBoard";
                
describe("KanBoard domain", () => {
  it("should expose correct domain data via getters", () => {
    // Arrange (test data)
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const userUid = "d492f2bc-0720-4890-8837-94fd1fda306e";
    const name = "Tasks";
    const color = "#a4c6b8";
    const isArchived = false;
    const isCollaborative = false;
    const createdAt = "2025-20-12";
    const updatedAt = "2025-20-12";

    const kanBoard = new KanBoard(
      id,
      userUid,
      name,
      color,
      isArchived,
      isCollaborative,
      createdAt,
      updatedAt
    );

    // Assert
    assert.strictEqual(kanBoard.getId(), id);
    assert.strictEqual(kanBoard.getUserUid(), userUid);
    assert.strictEqual(kanBoard.getName(), name);
    assert.strictEqual(kanBoard.getColor(), color);
    assert.strictEqual(kanBoard.getIsArchived(), isArchived);
    assert.strictEqual(kanBoard.getIsCollaborative(), isCollaborative);
    assert.strictEqual(kanBoard.getCreatedAt(), createdAt);
    assert.strictEqual(kanBoard.getUpdatedAt(), updatedAt);
  });
});
