import { Firestore } from "firebase/firestore";
import { db } from "../../../database/firebaseConfig";
import { CollectionRepository } from "../../../firebase_entity_manager/data/CollectionRepository";

class FilesRepository extends CollectionRepository {
  /**
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(database) {
    super("files", database);
  }
}

const filesRepository = new FilesRepository(db);
export default filesRepository;
