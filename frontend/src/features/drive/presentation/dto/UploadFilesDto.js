export class UploadFilesDto {
  #files;
  #folderId;

  /**
   *
   * @param {Array<File>} files
   * @param {string} folderId
   */
  constructor(files, folderId) {
    // this.#validate({ files, folderId });
    this.#files = files;
    this.#folderId = folderId;
  }

//   #validate(data) {
//     const { files, folderId } = data;
//     //JAVASCRIPT ARRAYS ARE OBJECT TYPES
//     if (!files || typeof files !== "object") {
//       throw new Error("The Folder id is missing. Please select a folder");
//     }

//     if (!folderId || typeof folderId !== "string") {
//       throw new Error("The Folder id is missing. Please select a folder");
//     }
//   }

  getFiles() {
    return this.#files;
  }

  getFolderId() {
    return this.#folderId;
  }
}
