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
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useAuthProvider } from "../context/AuthProvider";

/**
 * 
 * @param {Object} props 
 * @param {string} props.table - Firebase collection name
 * @returns 
 */
export default function DataHandler({ table }) {
    const { user } = useAuthProvider();
    const collectionRef = collection(db, table);
    const userUid = user ? user.uid : null;
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
        userUid,
        currentServerTimestamp,
        convertTimeStampToDate,
        query,
        limit,
        where,
    };
}
