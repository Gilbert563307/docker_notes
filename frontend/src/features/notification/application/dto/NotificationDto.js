export class NotificationDto {
  #message;
  #type;
  /**
   *
   * @param {string} message
   * @param {number} type
   */
  constructor(message, type) {
    this.#validate(message, type);
    this.#message = message;
    this.#type = type;
  }

  getMessage() {
    return this.#message;
  }

  getType() {
    return this.#type;
  }

  toJson() {
    return { message: this.#message, type: this.#type };
  }

  #validate(message, type) {
    if (typeof message !== "string") {
      throw new Error("Notification message must be a string.");
    }

    if (type === null || type === undefined || typeof type !== "number") {
      throw new Error("Notification type must be a number.");
    }
  }
}
