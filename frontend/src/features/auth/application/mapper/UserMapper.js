import { User } from "../../domain/User";
import { UserDto } from "../dto/UserDto";

export class UserMapper{
    
    /**
     * 
     * @param {User} user 
     * @returns {UserDto}
     */
    static toDto(user){
        return new UserDto(
            user.getUid(),
            user.getDisplayName(),
            user.getEmail(),
            user.getPhotoURL(),
            user.getToken()
        );
    }
}