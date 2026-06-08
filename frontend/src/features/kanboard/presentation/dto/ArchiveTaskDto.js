import { TaskDto } from "../../application/dto/TaskDto";

export class ArchiveTaskDto{
    #taskDto;
    #archived;

    /**
     * 
     * @param {TaskDto} taskDto 
     * @param {boolean} archived 
     */
    constructor(taskDto, archived){
        this.#taskDto = taskDto;
        this.#archived = archived;
    }

    getTaskDto(){
        return this.#taskDto;
    }

    getIsArchived(){
        return this.#archived;
    }
}