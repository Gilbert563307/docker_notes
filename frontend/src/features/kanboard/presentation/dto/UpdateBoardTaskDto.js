export class  UpdateBoardTaskDto{
    #taskDto;
    #boardId;

    constructor(taskDto, boardId){
        this.#taskDto = taskDto;
        this.#boardId = boardId;
    }

    getTaskDto(){
        return this.#taskDto;
    }

    getBoardId(){
        return this.#boardId;
    }
}