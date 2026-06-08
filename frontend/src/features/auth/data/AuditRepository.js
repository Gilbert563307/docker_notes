import { Firestore } from "firebase/firestore";
import { CollectionRepository } from "../../../firebase_entity_manager/data/CollectionRepository";
import { db } from "../../../database/firebaseConfig";

class AuditRepository extends CollectionRepository {
  /**
   * @param {Firestore} database - The Firestore database instance.
   */
  constructor(database) {
    super("audit", database);
  }
}

const auditRepository = new AuditRepository(db);
export default auditRepository;
