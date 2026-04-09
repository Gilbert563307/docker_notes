import {
  collection,
  CollectionReference,
  Firestore,
  serverTimestamp,
  FieldValue,
  query,
  getDocs,
  startAfter,
  getCountFromServer,
  QuerySnapshot,
  QueryConstraint,
  limit,
  QueryFieldFilterConstraint,
  Query,
  Timestamp,
  writeBatch,
  WriteBatch,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { CrudCollectionManager } from "./CrudCollectionManager.js";
import { PageAble } from "./domain/PageAble.js";

/**
 * Manages Firestore collection operations, providing utilities for
 * querying, pagination, and batching.
 * @extends CrudCollectionManager
 */
export class CollectionManager extends CrudCollectionManager {
  /**
   * Initializes the collection manager.
   * @param {string} collectionName - Name of the Firestore collection.
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(collectionName, database) {
    super(database, collectionName);
  }

  /**
   * Gets the reference for the current collection.
   * @returns {CollectionReference}
   */
  getCollectionReference() {
    return this._collectionRef;
  }

  /**
   * Creates a new document reference with an auto-generated ID.
   * @returns {DocumentReference}
   */
  createDocumentReference() {
    return doc(this._collectionRef);
  }

  /**
   *
   * @param {string} documentId
   * @returns
   */
  getDocumentReferenceById(documentId) {
    if (!documentId) {
      throw new Error("Document id must not be null");
    }
    return doc(this._database, this._collectionName, documentId);
  }

  /**
   * Returns a Firestore server timestamp FieldValue.
   * @returns {FieldValue}
   */
  getCurrentServerTimestamp() {
    return serverTimestamp();
  }

  /**
   * Returns the name of the managed collection.
   * @returns {string}
   */
  getCollectionName() {
    return this._collectionName;
  }

  /**
   * Returns the Firestore database instance.
   * @returns {Firestore}
   */
  getDatabase() {
    return this._database;
  }

  /**
   * Returns a collection reference for a different collection by name.
   * @param {string} name - The name of the target collection.
   * @returns {CollectionReference}
   */
  getCollectionReferenceByCollectionName(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Collection name must be a non-empty string.");
    }
    return collection(this._database, name);
  }

  /**
   * Creates a Firestore Query based on provided constraints.
   * @param {Array<QueryConstraint>} queryItems - Array of Firestore query constraints (where, orderBy, etc).
   * @returns {Query}
   */
  createQuery(queryItems) {
    if (!Array.isArray(queryItems)) throw new Error("queryItems must be an array.");
    return query(this._collectionRef, ...queryItems);
  }

  /**
   * Creates a query for a different collection without instantiating a new manager.
   * @param {string} collectionName - The name of the collection to query.
   * @param {Array<QueryConstraint>} queryItems - Array of Firestore query constraints.
   * @returns {Query}
   */
  createQueryByGivenCollectionName(collectionName, queryItems) {
    if (typeof collectionName !== "string" || !collectionName.trim()) {
      throw new Error("Collection name must be a non-empty string.");
    }

    if (!Array.isArray(queryItems)) {
      throw new Error("queryItems must be an array of Firestore constraints.");
    }
    return query(collection(this._database, collectionName), ...queryItems);
  }

  /**
   * Returns the Firestore Timestamp class.
   * @returns {typeof Timestamp}
   */
  getTimestampClass() {
    return Timestamp;
  }

  /**
   * Creates a new write batch operation.
   * @returns {WriteBatch}
   */
  createBatchOperation() {
    return writeBatch(this._database);
  }

  /**
   * Fetches a specific page of documents based on query constraints.
   * @param {PageAble} pageAble
   */
  async getPaginatedDocumentsByQueryItems(pageAble) {
    const pageNum = pageAble.getPage();

    // 1. Return from data cache if we have it
    if (pageAble.skipCache() === false) {
      if (super.getCachedDocuments().has(pageNum)) {
        return super.getCachedDocuments().get(pageNum);
      }
    }

    let resultsQuery;
    if (pageAble.isFirstPage()) {
      resultsQuery = query(this._collectionRef, ...pageAble.getQueryItems(), limit(pageAble.getItemsPerPage()));
    } else {
      // 2. Get the anchor from the PREVIOUS page
      const prevPageAnchor = super.getPageCursors().get(pageNum - 1);

      if (!prevPageAnchor) {
        // If the user tries to jump to Page 5 but hasn't loaded Page 4,
        throw new Error("Sequential pagination required");
      }

      resultsQuery = query(
        this._collectionRef,
        ...pageAble.getQueryItems(),
        startAfter(prevPageAnchor),
        limit(pageAble.getItemsPerPage()),
      );
    }

    const snapshot = await getDocs(resultsQuery);

    // 3. Store the last doc as the anchor for the NEXT page
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    super.setToPageCursors(pageNum, lastDoc);

    const docs = this.#convertQuerySnapShotDocs(snapshot);
    super.setToCachedDocuments(pageNum, docs);

    return docs;
  }

  /**
   * Retrieves all documents within the collection.
   * @returns {Promise<Array<Object>>}
   */
  async getAllDocuments() {
    const querySnapshot = await getDocs(this._collectionRef);
    return this.#convertQuerySnapShotDocs(querySnapshot);
  }

  /**
   * Retrieves all documents matching the provided query constraints.
   * @param {Array<QueryConstraint>} queryItems - Firestore query constraints.
   * @returns {Promise<Array<Object>>}
   */
  async getAllDocumentsByQuery(queryItems) {
    if (!Array.isArray(queryItems)) throw new Error("queryItems must be an array.");

    const resultsQuery = query(this._collectionRef, ...queryItems);
    const querySnapshot = await getDocs(resultsQuery);
    return this.#convertQuerySnapShotDocs(querySnapshot);
  }

  /**
   * Returns raw document snapshots based on a query.
   * @param {Array<QueryConstraint>} queryItems - Firestore query constraints.
   * @returns {Promise<QuerySnapshot>}
   */
  async getDocumentSnapShotsByQuery(queryItems) {
    if (!Array.isArray(queryItems)) throw new Error("queryItems must be an array.");

    const resultsQuery = query(this._collectionRef, ...queryItems);
    return await getDocs(resultsQuery);
  }

  /**
   * Counts the total number of documents matching a specific query.
   * @param {Array<QueryConstraint>} queryItems - Firestore query constraints.
   * @returns {Promise<number>} The total count of matching documents.
   */
  async countDocumentsByQuery(queryItems) {
    if (!Array.isArray(queryItems)) throw new Error("queryItems must be an array.");

    const totalQuery = query(this._collectionRef, ...queryItems);
    const totalRecordsSnapShot = await getCountFromServer(totalQuery);
    return totalRecordsSnapShot.data().count;
  }

  /**
   * Executes a pre-constructed Firestore Query and returns the data.
   * @param {Query} query - The Firestore Query object.
   * @returns {Promise<Array<Object>>}
   */
  async getDocumentsByQuery(query) {
    if (!query) throw new Error("A valid Firestore Query object is required.");
    const querySnapshot = await getDocs(query);
    return this.#convertQuerySnapShotDocs(querySnapshot);
  }

  /**
   * Delete multiple documents by provided document id's
   * @param {Array<string>} documentIds
   */
  async deleteMultipleDocuments(documentIds) {
    if (!documentIds) {
      throw new Error("Document ids must not be null");
    }
    if (!Array.isArray(documentIds)) {
      throw new Error("Document ids must be of type array");
    }
    if (documentIds.length === 0) return false;

    const batch = this.createBatchOperation();

    documentIds.forEach((id) => {
      const docRef = this.getDocumentReferenceById(id);
      batch.delete(docRef);
    });

    //Added a try carch so if one fails then they all fail
    try {
      await batch.commit();
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Internal helper to calculate pagination using cursor-based logic.
   * @param {number} currentPage
   * @param {number} itemsPerPage
   * @param {Array<QueryConstraint>} queryItems
   * @returns {Promise<Query>}
   */
  async #getPaginatedCollectionQuery(currentPage, itemsPerPage, queryItems) {
    // 1. Validation Check
    if (
      !Number.isInteger(currentPage) ||
      currentPage <= 1 ||
      !Number.isInteger(itemsPerPage) ||
      itemsPerPage <= 0 ||
      !Array.isArray(queryItems)
    ) {
      throw new Error(
        `Invalid pagination parameters: currentPage(${currentPage}), itemsPerPage(${itemsPerPage}). ` +
          `Ensure page is > 1 and itemsPerPage is > 0.`,
      );
    }
    // Calculate the limit for fetching documents up to the current page
    const newPageLimit = currentPage * itemsPerPage;
    // Fetch tasks limited by the new page limit
    const allDocsLimitedByThePageNumber = query(this._collectionRef, ...queryItems, limit(newPageLimit));
    // Get document snapshots for the calculated limit clause
    const documentSnapshots = await getDocs(allDocsLimitedByThePageNumber);
    // Calculate the offset to start from the last doc in the array
    const offset = (currentPage - 1) * itemsPerPage;
    // Get the document to start after, based on the offset
    const startFromDocument = documentSnapshots.docs[offset - 1];
    if (!startFromDocument) {
      throw new Error("No document found to start after for the given page.");
    }
    // Return a query that starts after the last visible document of the previous page
    return query(this._collectionRef, ...queryItems, startAfter(startFromDocument), limit(itemsPerPage));
  }

  /**
   * Maps a QuerySnapshot into a standard array of objects including document IDs.
   * @param {QuerySnapshot} querySnapshot - The snapshot from Firestore.
   * @returns {Array<Object>}
   */
  #convertQuerySnapShotDocs(querySnapshot) {
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      if (!data.created_at || !data.updated_at) {
        console.warn(`Missing timestamps for doc ${doc.id}`);
        return {
          ...data,
          id: doc.id,
          created_at: null,
          updated_at: null,
        };
      }

      return {
        ...data,
        id: doc.id,
      };
    });
  }
}
