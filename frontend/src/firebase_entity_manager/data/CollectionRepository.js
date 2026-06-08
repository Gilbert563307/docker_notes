import { Firestore } from "firebase/firestore";
import { CollectionManager } from "../CollectionManager";

export class CollectionRepository extends CollectionManager {
  /**
   * Initializes the collection manager.
   * @param {string} collectionName - Name of the Firestore collection.
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(collectionName, database) {
    super(collectionName, database);
  }
}
