import { Folder } from "../../domain/Folder";
import { FolderDto } from "../dto/FolderDto";

export class FoldersMapper {

  /**
   * 
   * @param {FolderDto} payload 
   * @returns {Folder}
   */
  static fromDtoToEntity(payload) {
    return new Folder(
        payload.getId(),
        payload.getUserUid(),
        payload.getName(),
        payload.getColor(),  
        payload.getIsArchived(),
        payload.getCreatedAt(),
        payload.getUpdatedAt(),
    );
  }
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
