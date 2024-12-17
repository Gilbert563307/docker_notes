import React from "react";
import DataHandler from "./DataHandler";
import { MAX_FOLDERS_TO_FETCH } from "../config";
import { ALERT_TYPES } from "../view/components/bs5/BS5Alert";

export default function FoldersLogic() {
  const {
    collectionRef,
    userUid,
    query,
    where,
    getDocs,
    limit,
    orderBy,
    convertQuerySnapShotDocs,
  } = DataHandler({ table: "folders" });

  async function getFolders() {
    try {
      const foldersQuery = query(
        collectionRef,
        where("user_uid", "==", userUid),
        orderBy("created_at", "desc"),
        limit(MAX_FOLDERS_TO_FETCH)
      );

      const querySnapshot = await getDocs(foldersQuery);

      const response = convertQuerySnapShotDocs(querySnapshot);
      return {
        folders: response.results,
        message: response.message,
        type: ALERT_TYPES.SUCCESS,
      };
    } catch (error) {
      return {
        folders: [],
        message: error.message,
        type: ALERT_TYPES.DANGER,
      };
    }
  }
  return { getFolders };
}
