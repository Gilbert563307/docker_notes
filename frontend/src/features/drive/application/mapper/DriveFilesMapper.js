import { DriveFile } from "../../domain/DriveFile";
import { DriveFileDto } from "../../domain/dto/DriveFileDto";

export class DriveFilesMapper {
    /**
     * 
     * @param {Array<Object>} arrayList 
     * @returns {Array<DriveFileDto>}
     */
  static arrayToDtoList(arrayList) {
    return arrayList.map((driveFile) => this.toDto(driveFile));
  }

  /**
   * 
   * @param {Object} driveFile 
   * @returns {DriveFileDto}
   */
  static toDto(driveFile) {
    return new DriveFileDto(
      driveFile.id,
      driveFile.name,
      driveFile.folder_id,
      driveFile.user_uid,
      driveFile.size,
      driveFile.type,
      driveFile.archived,
      driveFile.created_at,
      driveFile.updated_at,
    );
  }

}
