import { CustomError } from '../error/CustomError'
import { BaseDataBase } from './BaseDataBase'
import { UserInput } from '../model/User'

class UserData extends BaseDataBase {
    public createUser = async(user:UserInput):Promise<void> => {
        try {
            const {id, name, email, nickname, password, role} = user
            await this.connection('JPG_USER')
                .insert({ id, name, email, nickname, password, role })
        } catch (error) {
            const {statusCode, code, message, sqlMessage} = error

            switch (error.code) {
                case "ER_DUP_ENTRY":
                    throw new CustomError(403, 'User already registered'); break;
                default:
                    throw new CustomError(statusCode || code, sqlMessage || message); break;
                    break;
            }
        }
    }

    public getUserByEmail = async (emailInput: string):Promise<object> => {
        try {
            console.log(`[UserData]: [getUserByEmail]: emailInput`, emailInput)
            const queryResult:any = await this.connection('JPG_USER')
                .select('*')
                .where({email: emailInput})

            if (!queryResult.length) {throw new CustomError(404, 'User not found')}
            
            // console.log(`[UserData]: [getUserByEmail]: queryResult`, queryResult)
            const {id, name, email, nickname, password} = queryResult[0]
            const userData = {id, name, email, nickname, password}
            return userData
        } catch (error) {
            const {statusCode, message} = error
            switch (message) {           
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
            if (!queryResult.length) {throw new CustomError(404, 'User not found')}
            const {id, name, email, nickname, password} = queryResult[0]
            const userData = {id, name, email, nickname, password}
            return userData
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }


    public getUserById = async (id:string):Promise<any> => {
        try {
            const queryResult:any = await this.connection('JPG_USER')
                .select('*')
                .where({id})
            if (!queryResult.length) {throw new CustomError(404, 'User not found')}
            return queryResult[0]
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }
}

export const userData:UserData = new UserData()