/* eslint-disable no-undef */
import assert from "node:assert";
import { Timestamp } from "firebase/firestore";
import { DriveFile } from "../src/features/drive/domain/DriveFile";

describe("DriveFile domain", () => {
  it("should expose correct domain data via getters", () => {
    // Arrange
    const id = "file-1";
    const name = "document.pdf";
    const folderId = "folder-1";
    const userUid = "user-1";
    const size = 1024;
    const type = "application/pdf";
    const archived = false;
    const createdAt = Timestamp.now();
    const updatedAt = Timestamp.now();

    const file = new DriveFile(
      id,
      name,
      folderId,
      userUid,
      size,
      type,
      archived,
      createdAt,
      updatedAt
    );

    // Assert
    assert.strictEqual(file.getId(), id);
    assert.strictEqual(file.getName(), name);
    assert.strictEqual(file.getFolderId(), folderId);
    assert.strictEqual(file.getUserUid(), userUid);
    assert.strictEqual(file.getSize(), size);
    assert.strictEqual(file.getType(), type);
    assert.strictEqual(file.getIsArchived(), archived);
    assert.strictEqual(file.getCreatedAt(), createdAt);
    assert.strictEqual(file.getUpdatedAt(), updatedAt);
  });
});
