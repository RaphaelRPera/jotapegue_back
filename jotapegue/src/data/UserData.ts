import { CustomError } from '../error/CustomError'
import { BaseDataBase } from './BaseDataBase'
import { UserInput } from '../model/User'

class UserData extends BaseDataBase {
    public createUser = async(user:UserInput):Promise<void> => {
        try {
            const {id, name, email, nickname, password} = user
            await this.connection('JPG_USER')
                .insert({ id, name, email, nickname, password })
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }
}

export const userData:UserData = new UserData()