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

    public getUserByEmail = async (emailInput: string):Promise<object> => {
        try {
            console.log(`[UserData]: [getUserByEmail]: emailInput`, emailInput)
            const queryResult:any = await this.connection('JPG_USER')
                .select('*')
                .where({email: emailInput})

            // if (!queryResult.length) {throw new CustomError(401, 'Not found')}
            
            console.log(`[UserData]: [getUserByEmail]: queryResult`, queryResult)
            const {id, name, email, nickname, password} = queryResult[0]
            const userData = {id, name, email, nickname, password}
            return userData
        } catch (error) {
            const {statusCode, message} = error
            console.log(`[UserData]: [getUserByEmail]: error`, error)
            switch (message) {
                case "Cannot destructure property 'id' of 'queryResult[0]' as it is undefined.":
                    throw new CustomError(statusCode, 'Not Found');
                    break;
            
                default: throw new CustomError(statusCode, message);
                    break;
            }
            
        }
    }


    public getUserByNick = async (nickInput: string):Promise<object> => {
        try {
            const queryResult:any = await this.connection('JPG_USER')
                .select('*')
                .where({nickname: nickInput})
            const {id, name, email, nickname, password} = queryResult[0]
            const userData = {id, name, email, nickname, password}
            return userData
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }
}

export const userData:UserData = new UserData()