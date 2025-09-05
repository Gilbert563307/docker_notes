import { db, auth, storage } from "../database/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  query,
  limit,
  where,
  getCountFromServer,
  startAfter,
  orderBy,
  getDoc,
  startAt,
  endAt,
  writeBatch,
  Query,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useAuthProvider } from "../context/AuthProvider";
import useHelpers from "../helpers/useHelpers";
import { DEFAULT_ITEMS_PER_PAGE, ITEMS_PER_PAGE } from "../config";
import { ALERT_TYPES } from "../view/components/bs5/BS5Alert";

/**
 *
 * @param {Object} props
 * @param {string} props.table - Firebase collection name
 * @returns
 */
export default function DataHandler({ table }) {
  const { getUrlParams } = useHelpers();
  const { user } = useAuthProvider();
  const collectionRef = collection(db, table);
  const userUid = user ? user.uid : null;
  const currentServerTimestamp = serverTimestamp();
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const X_TOKEN = user ? user.token : null;

  /**
   * @param {{ seconds: number, nanoseconds: number } } object
   * @returns { Date | null }
   */
  const convertTimeStampToDate = (object) => {
    try {
      return new Timestamp(object.seconds, object.nanoseconds).toDate();
    } catch (error) {
      console.log(`[convertTimeStampToDate] ${error.message}`);
      return null;
    }
  };

  /**
   * Calculates the total number of pages based on the total number of records and items per page.
   *
   * @param {number} totalRecords - The total number of records.
   * @returns {number} The total number of pages.
   */
  const getTotalPages = (totalRecords) => {
    // Get the user-set items per page.
    const size = parseInt(
      getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE
    );

    // Calculate the total number of pages.
    const pages = (totalRecords + size - 1) / size;
    return parseInt(pages);
  };

  /**
   * Retrieves the current number of items per page.
   *
   * This function retrieves the number of items per page from the URL parameters.
   * If the parameter is not found or is invalid, it falls back to the default value.
   *
   * @returns {number} The current number of items per page.
   */
  const getTheCurrentItemsPerPage = () => {
    return parseInt(getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE);
  };

  /**
   *
   * @param {string} fieldName
   * @param {string} searchText
   * @returns {Array}
   */
  const getSearchQueryByFieldName = (fieldName, searchText) => {
    try {
      if (!searchText) return [];

      const startText = searchText;
      const endText = startText + "\uf8ff";

      return [
        where(fieldName, ">=", startText),
        where(fieldName, "<=", endText),
      ];
    } catch (error) {
      console.log(`[getSearchQuery]: ${error.message}`);
      return [];
    }
  };

  /**
   *
   * @param {number} seconds
   * @param {number} nanoseconds
   * @returns {{date: null | Date, error: string, type: number} }
   */
  function convertFirebaseTimestampToDate(seconds, nanoseconds) {
    try {
      const date = convertTimeStampToDate({
        seconds: seconds,
        nanoseconds: nanoseconds,
      });

      return {
        date: date,
        error: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        date: null,
        error: error.message(),
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  const convertQuerySnapShotDocs = (querySnapshot) => {
    try {
      // Map through the query snapshot to add the document ID to each task.
      const results = querySnapshot.docs.map((document) => {
        //https://stackoverflow.com/questions/68304942/there-is-a-delay-on-updating-a-timestamp-field-compared-to-any-other-field
        // When a user creates or updates `currentTimestamp` in Firebase,
        // the value may temporarily return as null if fetched immediately.
        // To avoid this, wait a few seconds before fetching the updated data.

        if (
          document.data().created_at === null ||
          document.data().updated_at === null
        ) {

          const dateNow = Date.now();
          return {
            ...document.data(),
            id: document.id,
            created_at: dateNow,
            updated_at: dateNow,
          };
        }

        const convertedCreatedAt = convertTimeStampToDate({
          seconds: document.data().created_at.seconds,
          nanoseconds: document.data().created_at.nanoseconds,
        });

        const convertedUpdatedAt = convertTimeStampToDate({
          seconds: document.data().updated_at.seconds,
          nanoseconds: document.data().updated_at.nanoseconds,
        });

        return {
          ...document.data(),
          id: document.id,
          created_at: convertedCreatedAt,
          updated_at: convertedUpdatedAt,
        };
      });
      return {
        results: results,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[convertQuerySnapShotDocs]: ${error.message}`);
      return {
        results: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  };

  /**
   *
   * @param {number} currentPage
   * @param {Object} payload
   * @param {number} itemsPerPage
   * @param {Array} queryItems
   * @returns {Promise<{resultsQuery: Query | null, message: string, type: number}>}
   */
  async function fetchPaginatedResults(
    currentPage,
    payload,
    itemsPerPage,
    queryItems
  ) {
    try {
      // Calculate the limit for fetching documents up to the current page
      const newPageLimit =
        currentPage * (payload?.itemsPerPage || itemsPerPage);

      // Fetch tasks limited by the new page limit
      const allDocsLimitedByThePageNumber = query(
        collectionRef,
        ...queryItems,
        limit(newPageLimit)
      );

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
      const resultsQuery = query(
        collectionRef,
        ...queryItems,
        startAfter(startFromDocument),
        limit(itemsPerPage)
      );
      return {
        resultsQuery: resultsQuery,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        resultsQuery: null,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {Array} queryItems
   * @param {number} itemsPerPage
   * @returns {{resultsQuery: Query | null, message: string, type: number}}
   */
  function fetchResultsOnPageOne(queryItems, itemsPerPage) {
    try {
      const resultsQuery = query(
        collectionRef,
        ...queryItems,
        limit(itemsPerPage)
      );
      return {
        resultsQuery: resultsQuery,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        resultsQuery: null,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {string} documentId
   * @returns {Promise<{document: Object, message: string, type: number}>}
   */
  async function getDocument(documentId) {
    try {
      // Get a reference to the document in the database
      const reference = doc(db, table, documentId);

      // Fetch the document snapshot
      const snapshot = await getDoc(reference);

      // Check if the document exists
      if (!snapshot.exists()) {
        return {
          document: {},
          message: "An error occurred while fetching the document.",
          type: ALERT_TYPES.DANGER,
        };
      }

      // Get the document data
      const docData = snapshot.data();

      // Manually assign the ID to the doc because Firebase doesn't return the ID
      return {
        document: { ...docData, id: documentId },
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[getDocument]: ${error.message}`);
      return {
        document: {},
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  return {
    collectionRef,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
    storage,
    ref,
    uploadBytes,
    userUid,
    currentServerTimestamp,
    convertTimeStampToDate,
    query,
    limit,
    where,
    collection,
    getCountFromServer,
    getTotalPages,
    getTheCurrentItemsPerPage,
    startAfter,
    orderBy,
    db,
    table,
    getDoc,
    startAt,
    endAt,
    getSearchQueryByFieldName,
    convertQuerySnapShotDocs,
    writeBatch,
    BACKEND_URL,
    Timestamp,
    X_TOKEN,
    fetchPaginatedResults,
    fetchResultsOnPageOne,
    getDocument,
  };
}
