import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, updateDoc } from "firebase/firestore";
import { QueryConstraintCollectionManager } from "./QueryConstraintCollectionManager.js";

export class CrudCollectionManager extends QueryConstraintCollectionManager {
  _collectionName;
  _collectionRef;
  _database;
  #cachedDocuments = new Map();
  #pageCursors = new Map();

  /**
   *
   * @param {Firestore} database
   * @param {string} collectionName
   */
  constructor(database, collectionName) {
    super();
    this.#validate(collectionName, database);
    this._database = database;
    this._collectionName = collectionName;
    //init config
    this._collectionRef = collection(this._database, this._collectionName);
  }

  /**
   *
   * @param {Object} document
   * @returns {Promise<boolean>}
   */
  async createDocument(document) {
    await addDoc(this._collectionRef, document);
    this.#resetCache();
    return true;
  }

  /**
   *
   * @param {string} documentId
   * @returns {Promise<Object>}
   */
  async readDocument(documentId) {
    return await this.#readDocument(this._database, this._collectionName, documentId);
  }

  /**
   *
   * @param {string} collectionName
   * @param {string} documentId
   * @returns {Promise<Object>}
   */
  async readDocumentFromCollection(collectionName, documentId) {
    return await this.#readDocument(this._database, collectionName, documentId);
  }

  /**
   *
   * @param {string} documentId
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  async updateDocument(documentId, data) {
    if (documentId === null || documentId === undefined || typeof documentId !== "string") {
      throw new Error("Document id missing or is of incorrect type. Document type must be of type string");
    }

    // get document
    const document = doc(this._database, this._collectionName, documentId);
    await updateDoc(document, data);
    this.#resetCache();
    return true;
  }

  /**
   *
   * @param {string} documentId
   * @returns {Promise<boolean>}
   */
  async deleteDocument(documentId) {
    if (documentId === null || documentId === undefined || typeof documentId !== "string") {
      throw new Error("Document id missing or is of incorrect type. Document type must be of type string");
    }

    const documentRef = doc(this._database, this._collectionName, documentId);
    await deleteDoc(documentRef);
    this.#resetCache();
    return true;
  }

  /**
   *
   * @param {Firestore} database
   * @param {string} collectionName
   * @param {string} documentId
   * @returns
   */
  async #readDocument(database, collectionName, documentId) {
    if (documentId === null || documentId === undefined || typeof documentId !== "string") {
      throw new Error("Document id missing or is of incorrect type. Document type must be of type string");
    }

    // Get a reference to the document in the database
    const reference = doc(database, collectionName, documentId);

    // Fetch the document snapshot
    const snapshot = await getDoc(reference);

    // Check if the document exists
    if (!snapshot.exists()) {
      throw new Error(`Document ${documentId} not found in ${collectionName}`);
    }

    // Get the document data and assign document id to it also
    return { ...snapshot.data(), id: documentId };
  }

  /**
   *
   * @param {string} documentId
   * @returns {Promise<Object | null>}
   */
  async findOrFail(documentId) {
    if (documentId === null || documentId === undefined || typeof documentId !== "string") {
      throw new Error("Document id missing or is of incorrect type. Document type must be of type string");
    }

    // Get a reference to the document in the database
    const reference = doc(this._database, this._collectionName, documentId);

    // Fetch the document snapshot
    const snapshot = await getDoc(reference);

    // Check if the document exists
    if (!snapshot.exists()) {
      return null;
    }

    // Get the document data and assign document id to it also
    return { ...snapshot.data(), id: documentId };
  }

  getCachedDocuments() {
    return this.#cachedDocuments;
  }

  getPageCursors() {
    return this.#pageCursors;
  }

  setToCachedDocuments(key, docs) {
    this.#cachedDocuments.set(key, docs);
  }

  setToPageCursors(key, doc) {
    this.#pageCursors.set(key, doc);
  }

  #resetCache() {
    this.#cachedDocuments = new Map();
    this.#pageCursors = new Map();
  }

  /**
   * Validates the integrity of constructor arguments.
   * @param {string} collectionName
   * @param {Firestore} database
   * @throws {Error} If validation fails.
   */
  #validate(collectionName, database) {
    // Validate collectionName: Must be a string and not just whitespace
    if (typeof collectionName !== "string" || !collectionName.trim()) {
      throw new Error("Invalid collectionName: must be a non-empty string.");
    }

    // Validate database: Check if the 'type' property matches the Firestore definition
    const validTypes = ["firestore-lite", "firestore"];

    if (!database || !validTypes.includes(database.type)) {
      throw new Error(`Invalid database: expected firestore or firestore-lite, but got ${database?.type}`);
    }
  }
}
