import { Firestore } from "firebase/firestore";
import { CollectionRepository } from "../../../firebase_entity_manager/data/CollectionRepository";
import { db } from "../../../database/firebaseConfig";

class FoldersRepository extends CollectionRepository {
  /**
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(database) {
    super("folders", database);
  }
}

const foldersRepository = new FoldersRepository(db);
export default foldersRepository;
