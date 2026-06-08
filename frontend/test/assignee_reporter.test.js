import assert from "node:assert";
import { Assignee } from "../src/features/kanboard/domain/Assignee";
import { Reporter } from "../src/features/kanboard/domain/Reporter";

describe("Assignee domain", () => {
  it("should expose correct data via getters", () => {
    const assignee = new Assignee("Alice", "id-1");

    assert.strictEqual(assignee.getName(), "Alice");
    assert.strictEqual(assignee.getAssigneeId(), "id-1");
  });
});

describe("Reporter domain", () => {
  it("should expose correct data via getters", () => {
    const reporter = new Reporter("Bob", "id-2");

    assert.strictEqual(reporter.getName(), "Bob");
    assert.strictEqual(reporter.getAssigneeId(), "id-2");
  });
});
