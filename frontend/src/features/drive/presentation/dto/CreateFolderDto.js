export class CreateFolderDto {
  #name;
  #color;

  constructor(name, color) {
    this.#name = name;
    this.#name = color;
  }

  getName(){
    return this.#name;
  }

  getColor(){
    return this.#color;
  }
}
