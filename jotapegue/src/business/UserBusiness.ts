import { userData } from "../data/UserData";
import { CustomError } from "../error/CustomError";
import { UserInput, UserInputDTO } from "../model/User";
import { services } from "../services/services";


class UserBusiness {
    public createUser = async (user: UserInputDTO):Promise<string> => {
        try {
            const {name, email, nickname, password} = user

            if (!name) {throw new CustomError(400, 'User name is required')}
            if (!email) {throw new CustomError(400, 'User email is required')}
            if (!nickname) {throw new CustomError(400, 'User nickname is required')}
            if (!password || password.length < 6) {throw new CustomError(400, 'A password with at least 6 digits is required')}


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


    public login = async (loginData: any):Promise<string> => {
        try {
            const loginEmail:string = loginData.email
            const loginPassword:string = loginData.password

            if (!loginEmail) {throw new CustomError(400, 'Email or nickname is required')}
            if (!loginPassword) {throw new CustomError(400, 'Password is required')}

            const user: any = loginEmail.includes('@') ?
                await userData.getUserByEmail(loginEmail) :
                await userData.getUserByNick(loginEmail)

            const passwordIsCorrect:boolean = await services.compare(loginPassword, user.password)
            if (!passwordIsCorrect) {throw new CustomError(400, 'Invalid email or password')}

            const token:string = services.generateToken({id: user.id})
            return token
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }
}


export const userBusiness:UserBusiness = new UserBusiness()
