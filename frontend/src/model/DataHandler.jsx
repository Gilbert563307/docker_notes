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


    /**
     * //TODO to use the orderby with the created_at or updated_at, u must create an index in google firebase
     * @param {{ seconds: number, nanoseconds: number } } object 
     * @returns {{ string }}
     */
    const convertTimeStampToDate = (object) => {
        return new Timestamp(object.seconds, object.nanoseconds).toDate();
    };

    /**
  * Calculates the total number of pages based on the total number of records and items per page.
  * 
  * @param {number} totalRecords - The total number of records.
  * @returns {number} The total number of pages.
  */
    const getTotalPages = (totalRecords) => {
        // Get the user-set items per page.
        const size = parseInt(getUrlParams(ITEMS_PER_PAGE) || DEFAULT_ITEMS_PER_PAGE);

        // Calculate the total number of pages.
        const pages = (totalRecords + size - 1) / size;
        return parseInt(pages);
    }

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
    }

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
            const endText = startText + '\uf8ff';

            return [where(fieldName, '>=', startText), where(fieldName, '<=', endText)]

        } catch (error) {
            console.log(`[getSearchQuery]: ${error.message}`);
            return []
        }
    }

    const convertQuerySnapShotDocs = (querySnapshot) => {
        try {
            // Map through the query snapshot to add the document ID to each task.
            const results = querySnapshot.docs.map((document) => {
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
                }
            });
            return {
                results: results,
                message: "",
                type: ALERT_TYPES.SUCCESS
            };
        } catch (error) {
            console.log(`[convertQuerySnapShotDocs]: ${error.message}`);
            return {
                results: [],
                message: error.message,
                type: ALERT_TYPES.DANGER
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
    };
}
