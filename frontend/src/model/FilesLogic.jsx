import React from "react";
import { ALERT_TYPES } from "../view/components/bs5/BS5Alert";
import { asBlob } from "html-docx-js-typescript";
import DataHandler from "./DataHandler";
import useHelpers from "../helpers/useHelpers";
import { Query } from "firebase/firestore";
// import { DEFAULT_TASKS_ARCHIVE, FILES_ARCHIVED_SESSION_FILTER } from '../config';

export default function FilesLogic() {
  const {
    getTheCurrentItemsPerPage,
    userUid,
    where,
    orderBy,
    getSearchQueryByFieldName,
    query,
    collectionRef,
    limit,
    getDocs,
    startAfter,
    convertQuerySnapShotDocs,
    getCountFromServer,
    getTotalPages,
    writeBatch,
    db,
    doc,
    BACKEND_URL,
    BACKEND_TOKEN,
    currentServerTimestamp,
  } = DataHandler({ table: "files" });

  const { getCurrentPageNumber } = useHelpers();

  /**
   * @param {{searchTearm?: string}} payload
   * @returns {{queryItems: Array<Query> | Array, message: string, type: number}}
   */
  function getFilesQueryClauses(payload) {
    try {
      // const tasksArchived = getSessionFilter(FILES_ARCHIVED_SESSION_FILTER) || DEFAULT_TASKS_ARCHIVE;

      let queryItems = [
        where("user_uid", "==", userUid),
        // where("archived", "==", tasksArchived),
        orderBy("created_at", "desc"),
      ];

      if (payload && payload.searchTearm && payload.searchTearm != "") {
        const { searchTearm } = payload;
        queryItems = [
          ...queryItems,
          ...getSearchQueryByFieldName("name", searchTearm),
        ];
      }

      return {
        queryItems: queryItems,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[getFilessQueryClauses]: ${error.message}`);
      return {
        queryItems: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {Array} queryItems
   * @param {number} itemsPerPage
   * @returns {{query: Query, message: string, type: number} | void}
   */
  function fetchFilesOnPageOne(queryItems, itemsPerPage) {
    const filesQuery = query(collectionRef, ...queryItems, limit(itemsPerPage));
    return { query: filesQuery, message: "", type: ALERT_TYPES.SUCCESS };
  }

  /**
   *
   * @param {number} currentPage
   * @param {Object} payload
   * @param {number} itemsPerPage
   * @param {Array} queryItems
   * @returns {Promise<{query: Query, message: string, type: number}>}
   */
  async function fetchPaginatedFiles(
    currentPage,
    payload,
    itemsPerPage,
    queryItems
  ) {
    // Calculate the limit for fetching documents up to the current page
    const newPageLimit = currentPage * (payload?.itemsPerPage || itemsPerPage);

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
    const startFromDocument = documentSnapshots.docs[offset];
    if (!startFromDocument) {
      throw new Error("No document found to start after for the given page.");
    }

    // Return a query that starts after the last visible document of the previous page
    const filesQuery = query(
      collectionRef,
      ...queryItems,
      startAfter(startFromDocument),
      limit(itemsPerPage)
    );
    return { query: filesQuery, message: "", type: ALERT_TYPES.SUCCESS };
  }

  /**
   * Generates a Firestore query to fetch tasks for the current page.
   *
   * @param {{ searchTearm?: string }} payload - The current page number for pagination.
   * @returns {Promise<{query: Query | null, message: string, type: number}>} The Firestore query to fetch tasks for the specified page.
   */
  function getFilesTasksQuery(payload) {
    try {
      const currentPage = getCurrentPageNumber();

      // Get the number of items to be displayed per page
      const itemsPerPage = getTheCurrentItemsPerPage();
      const { queryItems } = getFilesQueryClauses(payload);

      // If the current page is the first page, create a query limited by the items per page
      if (currentPage === 1) {
        return fetchFilesOnPageOne(queryItems, itemsPerPage);
      }

      return fetchPaginatedFiles(
        currentPage,
        payload,
        itemsPerPage,
        queryItems
      );
    } catch (error) {
      return { query: null, message: error.message, type: ALERT_TYPES.DANGER };
    }
  }

  async function getTotalTasksInDatabaseByUserAndFilters() {
    try {
      const payload = { searchTearm: "" };
      const { queryItems } = getFilesQueryClauses(payload);

      const totalQuery = query(collectionRef, ...queryItems);
      const totalRecordsSnapShot = await getCountFromServer(totalQuery);
      const totalRecords = totalRecordsSnapShot.data().count;
      return totalRecords;
    } catch (error) {
      console.log(
        `[getTotalTasksInDatabaseByUserAndFilters]: ${error.message}`
      );
      return 0;
    }
  }

  /**
   *
   * @param {{ searchTearm?: string}} payload
   * @returns
   */
  async function listFiles(payload) {
    try {
      // Construct the query to get all tasks for the current user UID with a
      const { query } = await getFilesTasksQuery(payload);

      // Execute the query to get the files.
      const querySnapshot = await getDocs(query);

      const { results } = convertQuerySnapShotDocs(querySnapshot);

      //get total records for pagination
      const totalRecords = await getTotalTasksInDatabaseByUserAndFilters();
      //get total pages for paginartion
      const totalPages = getTotalPages(totalRecords);

      //return results
      return {
        results: { files: results, total: totalRecords, pages: totalPages },
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        results: { files: [], total: 0, pages: 0 },
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @returns {string}
   */
  function generateRandomFileName() {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 7);
    return `${timestamp}-${randomPart}`;
  }

  /**
   *
   * @param {string} html
   * @returns {Promise<{downloaded: Boolean, message: string, type: number}>}
   */
  async function convertHtmlToDocx(html) {
    try {
      const data = await asBlob(html);
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);

      const filename = generateRandomFileName();

      // Create a temporary link to download the DOCX file
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.docx`;
      document.body.appendChild(link);

      // Trigger the download and clean up
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return {
        downloaded: true,
        message: "",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[convertHtmlToDocx] #${error.message}`);
      return {
        downloaded: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }
  /**
   * Upload files to the backend server
   *
   * @param {{files: Array<File>, folderId: string}} payload
   * @returns {Promise<{uploaded: boolean, message: string, type: number}>}
   */
  async function uploadFilesToBackendServer(payload) {
    const formData = new FormData();

    // Append files to FormData
    payload.files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    // Append additional fields
    formData.append("folder_id", payload.folderId);
    formData.append("user_uid", userUid);

    //localhost:8000/files/upload?user_uid=4a422422542e48ec029f6d21bc93c2d3cd24f823a33dba037672c5d1808c6fcf&token=ab47c9f1d2e34567ac89de12b3f45a67

    try {
      const response = await fetch(`${BACKEND_URL}files/upload`, {
        method: "POST",
        body: formData, // Use FormData for file uploads
        // No need to set Content-Type manually; the browser sets it for FormData
      });

      if (!response.ok) {
        // Handle HTTP error responses
        const errorResponse = await response.json();
        console.error(
          `[uploadFilesToBackendServer] Backend Error:`,
          errorResponse
        );
        throw new Error(errorResponse.message || "File upload failed.");
      }

      const data = await response.json();
      console.log("File Upload Response:", data);

      return {
        uploaded: true,
        message: "Files uploaded successfully.",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.error(`[uploadFilesToBackendServer] ${error.message}`);
      return {
        uploaded: false,
        message: error.message || "An error occurred during file upload.",
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  /**
   *
   * @param {{files: Array<File>, folderId: string}} payload
   * @returns {Promise<{uploaded: Boolean, message: string, type: number}>}
   */
  async function uploadFiles(payload) {
    try {
      // Create a batch write operation
      const batch = writeBatch(db);

      //loop through data to  get the filename
      payload.files.forEach((file) => {
        const fileToUploadPayload = {
          name: file.name,
          folder_id: payload.folderId,
          user_uid: userUid,
          created_at: currentServerTimestamp,
          updated_at: currentServerTimestamp,
        };

        //create doc ref
        const docRef = doc(collectionRef);
        batch.set(docRef, fileToUploadPayload);
      });
      //add all data to firebase db
      const uploaded = await batch.commit();

      //upload the files to the backend server
      const uploadedToServer = await uploadFilesToBackendServer(payload);

      return {
        uploaded: Boolean(uploaded) && Boolean(uploadedToServer),
        message: uploadedToServer.message || "File(s) uploaded successfully.",
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      console.log(`[uploadFiles] ${error.message}`);
      return {
        uploaded: false,
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }

  return { convertHtmlToDocx, listFiles, uploadFiles };
}
