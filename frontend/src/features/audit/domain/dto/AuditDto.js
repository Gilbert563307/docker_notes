import { Timestamp } from "firebase/firestore";

export class AuditDto {
  #id;
  #title;
  #message;
  #created_at;
  #updated_at;

  /**
   * 
   * @param {string} id 
   * @param {string} title 
   * @param {string} message 
   * @param {Timestamp} created_at 
   * @param {Timestamp} updated_at 
   */
  constructor(id, title, message,  created_at, updated_at) {
    this.#id = id;
    this.#title = title;
    this.#message = message;
    this.#created_at = created_at;
    this.#updated_at = updated_at;
  }

  getId() {
    return this.#id;
  }

  getTitle() {
    return this.#title;
  }

  getMessage() {
    return this.#message;
  }

 

  getCreatedAt() {
    return this.#created_at;
  }

  getUpdatedAt() {
    return this.#updated_at;
  }

  toJson() {
    return {
      id: this.#id,
      title: this.#title,
      message: this.#message,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

   toJsonWithoutId() {
    return {
      title: this.#title,
      message: this.#message,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
