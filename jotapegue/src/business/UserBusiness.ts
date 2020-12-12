import { userData } from "../data/UserData";
import { CustomError } from "../error/CustomError";
import { UserInput, UserInputDTO } from "../model/User";
import { services } from "../services/services";


class UserBusiness {
    public createUser = async (user: UserInputDTO):Promise<any> => {
        try {
            const {name, email, nickname, password} = user

            if (!name) {throw new CustomError(400, 'User name is required')}
            if (!email) {throw new CustomError(400, 'User email is required')}
            if (!nickname) {throw new CustomError(400, 'User nickname is required')}
            if (!password) {throw new CustomError(400, 'User password is required')}

            const id:string = services.generateId()
            const cypherPassword = await services.hash(password)

            const input: UserInput = {
                id, name, email, nickname, password: cypherPassword
            }

            await userData.createUser(input)

            const token:string = services.generateToken({id})

            return token
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }
}


export const userBusiness:UserBusiness = new UserBusiness()
