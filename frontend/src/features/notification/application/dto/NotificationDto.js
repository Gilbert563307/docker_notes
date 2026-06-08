//maybe use one ALERT_TYPES but added it here for less coupling
const ALERT_TYPES = {
  INFO: 0,
  DANGER: 1,
  SUCCESS: 2,
  PRIMARY: 3,
};

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

  static Builder = class {
    #message = "";
    #type = ALERT_TYPES.PRIMARY;

    message(value) {
      this.#message = value;
      return this;
    }

    info() {
      this.#type = ALERT_TYPES.INFO;
      return this;
    }

    danger() {
      this.#type = ALERT_TYPES.DANGER;
      return this;
    }

    success() {
      this.#type = ALERT_TYPES.SUCCESS;
      return this;
    }

    primary() {
      this.#type = ALERT_TYPES.PRIMARY;
      return this;
    }

    build() {
      return new NotificationDto(this.#message, this.#type);
    }
  };

  /**
   *
   * @param {string} message
   * @param {number} type
   */
  #validate(message, type) {
    if (typeof message !== "string") {
      throw new Error("Notification message must be a string.");
    }

    if (type === null || type === undefined || typeof type !== "number") {
      throw new Error("Notification type must be a number.");
    }
  }
}
