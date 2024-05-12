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
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

/**
 * 
 * @param {Object} props 
 * @param {string} props.table - Firebase collection name
 * @returns 
 */
export default function DataHandler({ table }) {
    const collectionRef = collection(db, table);
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const currentServerTimestamp = serverTimestamp();
    /**
     * 
     * @param {{ seconds: number, nanoseconds: number } } object 
     * @returns {{ string }}
     */
    const convertTimeStampToDate = (object) => {
        return new Timestamp(object.seconds, object.nanoseconds).toDate();
    };

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
        userId,
        currentServerTimestamp,
        convertTimeStampToDate
    };
}
