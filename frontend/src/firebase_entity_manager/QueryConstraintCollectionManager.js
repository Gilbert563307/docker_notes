import { QueryFieldFilterConstraint, where } from "firebase/firestore";

export class QueryConstraintCollectionManager {
  /**
   *
   * @param {string} fieldName
   * @param {string} searchText
   * @returns {QueryFieldFilterConstraint}
   */
  getSearchQueryBeforeFieldName(fieldName, searchText) {
    if (!fieldName) {
      throw new Error("Field name required");
    }
    const startText = searchText;
    return where(fieldName, ">=", startText);
  }

  /**
   *
   * @param {string} fieldName
   * @param {string} searchText
   * @returns {QueryFieldFilterConstraint}
   */
  getSearchQueryAfterFieldName(fieldName, searchText) {
    if (!fieldName) {
      throw new Error("Field name required");
    }

    const startText = searchText;
    const endText = startText + "\uf8ff";
    return where(fieldName, "<=", endText);
  }
}
