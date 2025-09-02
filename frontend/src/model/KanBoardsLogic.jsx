import React from 'react'
import DataHandler from './DataHandler';
import { MAX_KAN_BOARDS } from '../config';
import { ALERT_TYPES } from '../view/components/bs5/BS5Alert';

export default function KanBoardsLogic() {

    const { collectionRef, userUid, query, limit, where, orderBy, getDocs, convertQuerySnapShotDocs } = DataHandler({ table: "kanboards" });

    async function listKanBoards() {
        try {
            // Construct the query to get all tasks for the current user UID with a
            const kanBoardsQuery = query(
                collectionRef,
                where("user_uid", "==", userUid),
                // where("archived", "==", tasksArchived),
                orderBy("updated_at", "desc"),
                limit(MAX_KAN_BOARDS)
            );

            // Execute the query to get the tasks.
            const querySnapshot = await getDocs(kanBoardsQuery);

            const { results, message, type } =
                convertQuerySnapShotDocs(querySnapshot);
            return {
                tasks: results,
                message: message,
                type: type,
            };
        } catch (error) {
            console.log(`[listKanBoards]: ${error.message}`);
            return {
                tasks: [],
                message: error.message,
                type: ALERT_TYPES.DANGER,
            };
        }

    }
    return { listKanBoards }
}
