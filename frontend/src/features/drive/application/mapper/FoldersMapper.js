import { FolderDto } from "../dto/FolderDto";

export class FoldersMapper {
  /**
   *
   * @param {Array<Object>} arrayList
   * @returns {Array<FolderDto>}
   */
  static arrayToDtoList(arrayList) {
    return arrayList.map((driveFile) => this.toDto(driveFile));
  }

  /**
   *
   * @param {Object} driveFile
   */
  static toDto(driveFile) {
    return new FolderDto(
        driveFile.id,
        driveFile.user_uid,
        driveFile.name,
        driveFile.color,  
        driveFile.archived,
        driveFile.created_at,
        driveFile.created_at,
    );
  }
}
