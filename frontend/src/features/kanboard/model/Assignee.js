export class Assignee {
  constructor(name, assignee_id) {
    this.name = name;
    this.assignee_id = assignee_id;
  }

  getName(){
    return this.name
  }

  getAssigneeId(){
    return this.assignee_id;
  }


  toCreateObject(){
    return {
      name: this.getName(),
      assignee_id: this.getAssigneeId()
    };
   }

  /** Update one or more fields */
  update(data = {}) {
    Object.assign(this, data);
  }
}
