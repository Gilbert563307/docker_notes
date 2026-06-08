import assert from "node:assert";
import { Folder } from "../src/features/drive/domain/Folder";

describe("Folder domain", () => {
  it("should expose correct domain data via getters", () => {
    // Arrange
    const id = "folder-1";
    const userUid = "user-1";
    const name = "My Folder";
    const color = "#ffcc00";
    const archived = false;
    const createdAt = "2025-01-01";
    const updatedAt = "2025-01-02";

    const folder = new Folder(
      id,
      userUid,
      name,
      color,
      archived,
      createdAt,
      updatedAt
    );

    // Assert
    assert.strictEqual(folder.getId(), id);
    assert.strictEqual(folder.getUserUid(), userUid);
    assert.strictEqual(folder.getName(), name);
    assert.strictEqual(folder.getColor(), color);
    assert.strictEqual(folder.getIsArchived(), archived);
    assert.strictEqual(folder.getCreatedAt(), createdAt);
    assert.strictEqual(folder.getUpdatedAt(), updatedAt);
  });
});
