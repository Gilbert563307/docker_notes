export class CreateFolderDto {
  #name;
  #color;

  /**
   * 
   * @param {string} name 
   * @param {string} color 
   */
  constructor(name, color) {
    this.#name = name;
    this.#color = color;
  }

  getName(){
    return this.#name;
  }

  getColor(){
    return this.#color;
  }
}
