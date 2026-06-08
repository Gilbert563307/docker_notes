import { Timestamp } from "firebase/firestore";

export class Audit {
  #id;
  #title;
  #message;
  #response;
  #created_at;
  #updated_at;

  /**
   * 
   * @param {string} id 
   * @param {string} title 
   * @param {string} message 
   * @param {string} response 
   * @param {Timestamp} created_at 
   * @param {Timestamp} updated_at 
   */
  constructor(id, title, message, response, created_at, updated_at) {
    this.#id = id;
    this.#title = title;
    this.#message = message;
    this.#response = response;
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

  getResponse() {
    return this.#response;
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
      response: this.#response,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }

   toJsonWithoutId() {
    return {
      title: this.#title,
      message: this.#message,
      response: this.#response,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
