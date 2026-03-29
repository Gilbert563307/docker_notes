import { Firestore } from "firebase/firestore";
import { db } from "../../../database/firebaseConfig";
import { CollectionRepository } from "../../../firebase_entity_manager/data/CollectionRepository";

class SessionRepository extends CollectionRepository {
  /**
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(database) {
    super("sessions", database);
  }
}
const sessionRepository = new SessionRepository(db);
export default sessionRepository;
