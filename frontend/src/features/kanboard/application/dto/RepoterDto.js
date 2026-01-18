export class ReporterDto {
  constructor(name, assignee_id) {
    this.name = name;
    this.assignee_id = assignee_id;
  }

  getName() {
    return this.name;
  }

  getAssigneeId() {
    return this.assignee_id;
  }

  toJson() {
    return { name: this.name, assignee_id: this.assignee_id };
  }
}
