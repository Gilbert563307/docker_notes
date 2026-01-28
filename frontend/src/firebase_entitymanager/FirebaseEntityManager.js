import {
  collection,
  CollectionReference,
  Firestore,
  DocumentData,
  serverTimestamp,
  FieldValue,
  Timestamp,
  doc,
  getDoc,
  where,
  orderBy,
  query,
  Query,
  getDocs,
  limit,
  startAfter,
  addDoc,
  getCountFromServer,
} from "firebase/firestore";

export class FirebaseEntityManager {
  #collectionName;
  #collectionRef;
  #database;

  /**
   * Collection name for the firebase collection
   * @param {string} collectionName
   * @param {Firestore} database
   */
  constructor(collectionName, database) {
    this.#collectionName = collectionName;
    this.#database = database;

    //init config
    this.#collectionRef = collection(this.#database, this.#collectionName);
  }

  /**
   *
   * @returns {CollectionReference<DocumentData, DocumentData>}
   */
  getCollectionReference() {
    return this.#collectionRef;
  }

  /**
   *
   * @returns {FieldValue}
   */
  getCurrentServerTimestamp() {
    return serverTimestamp();
  }

  getCollectionName() {
    return this.#collectionName;
  }

  getDatabase() {
    return this.#database;
  }

  async getDocument(documentId) {
    // Get a reference to the document in the database
    const reference = doc(this.#database, this.#collectionName, documentId);

    // Fetch the document snapshot
    const snapshot = await getDoc(reference);

    // Check if the document exists
    if (!snapshot.exists()) {
      throw new Error("An error occurred while fetching the document.");
    }

    // Get the document data and assign document id to it also
    return { ...snapshot.data(), id: documentId };
  }

  /**
   * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
   * must contain the specified field and that the value should satisfy the
   * relation constraint provided.
   *
   * @param fieldPath - The path to compare
   * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
   *   "&lt;=", "!=").
   * @param value - The value for comparison
   * @returns The created {@link QueryFieldFilterConstraint}.
   */
  whereQuery(fieldPath, opStr, value) {
    return where(fieldPath, opStr, value);
  }

  /**
   * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
   * specified field, optionally in descending order instead of ascending.
   *
   * Note: Documents that do not contain the specified field will not be present
   * in the query result.
   *
   * @param fieldPath - The field to sort by.
   * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
   * not specified, order will be ascending.
   * @returns The created {@link QueryOrderByConstraint}.
   */
  orderByQuery(fieldPath, directionStr) {
    return orderBy(fieldPath, directionStr);
  }

  /**
   *
   * @param {Array<any>} queryItems
   * @param {number} page
   * @param {number} itemsPerPage
   */
  async getPaginatedDocumentsByQueryItems(queryItems, page, itemsPerPage) {
    if (queryItems === null || queryItems === undefined) {
      throw new Error("Query array is missing");
    }

    if (page === null || page === undefined || typeof page !== "number") {
      throw new Error("Page number is missing");
    }

    if (itemsPerPage === null || itemsPerPage === undefined || typeof itemsPerPage !== "number") {
      throw new Error("Page size is missing");
    }

    let resultsQuery;
    if (page === 1) {
      resultsQuery = query(this.#collectionRef, ...queryItems, limit(itemsPerPage));
    }
    resultsQuery = await this.#getPaginatedCollectionQuery(page, itemsPerPage, queryItems);

    // Execute the query to get the tasks.
    const querySnapshot = await getDocs(resultsQuery);
    return this.#convertQuerySnapShotDocs(querySnapshot);
  }

  async getAllDocuments() {
    const querySnapshot = query(this.#collectionRef);
    return await getDocs(querySnapshot);
  }

  /**
   *
   * @param {string} fieldName
   * @param {string} searchText
   * @returns {Array<Query>}
   */
  getSearchQueryByFieldName(fieldName, searchText) {
    if (!searchText) return [];

    const startText = searchText;
    const endText = startText + "\uf8ff";

    return [where(fieldName, ">=", startText), where(fieldName, "<=", endText)];
  }

  /**
   *
   * @param {*} name
   * @returns
   */
  getCollectionReferenceByCollectionName(name) {
    return collection(this.#database, name);
  }

  async #getPaginatedCollectionQuery(currentPage, itemsPerPage, queryItems) {
    // Calculate the limit for fetching documents up to the current page
    const newPageLimit = currentPage * itemsPerPage;

    // Fetch tasks limited by the new page limit
    const allDocsLimitedByThePageNumber = query(this.#collectionRef, ...queryItems, limit(newPageLimit));

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
    return query(this.#collectionRef, ...queryItems, startAfter(startFromDocument), limit(itemsPerPage));
  }

  /**
   * 
   * @param {Object} document 
   * @returns {void}
   */
  async createDocument(document) {
    await addDoc(this.#collectionRef, document);
  }

  /**
   * 
   * @param {Array<any>} queryItems 
   * @returns {Promise<number>}
   */
  async countDocumentsByQuery(queryItems) {
    const totalQuery = query(this.#collectionRef, ...queryItems);
    const totalRecordsSnapShot = await getCountFromServer(totalQuery);
    return totalRecordsSnapShot.data().count;
  }

  /**
   * @param {{ seconds: number, nanoseconds: number } } object
   * @returns { Date }
   */
  #convertTimeStampToDate(object) {
    if (object.nanoseconds === null || object.seconds === null) {
      throw new Error("Something went wrong while converting time stamp to date");
    }
    return new Timestamp(object.seconds, object.nanoseconds).toDate();
  }

  /**
   * METHOD STILL IN DEVELOPMENT
   * @param {*} querySnapshot
   * @returns
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
        created_at: data.created_at.toDate(),
        updated_at: data.updated_at.toDate(),
      };
    });
  }
}
