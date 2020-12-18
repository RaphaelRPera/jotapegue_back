import { Response, Request } from 'express'
import { userBusiness } from '../business/UserBusiness'
import { CustomError } from '../error/CustomError'
import { UserInputDTO } from '../model/User'



class UserController {
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const {name, email, nickname, password, role} = req.body
            const input: UserInputDTO = {   
                name, email, nickname, password, role
            }

            const token:string = await userBusiness.createUser(input)

            res.status(200).send({message: 'User successfully created', token})
        } catch (error) {
            const {statusCode, message} = error
            res.status(statusCode || 400).send({message})
        }
    }


    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const {email, password} = req.body
            const loginData = {email, password}
            const userData = await userBusiness.login(loginData)
            // res.status(200).send({token})
            res.status(200).send(userData)
        } catch (error) {
            const {statusCode, message} = error
            res.status(statusCode || 400).send({message})
        }
    }


    public validateUser = async (req:Request, res:Response):Promise<void> => {
        try {
            const token = req.headers.authorization
            if (!token) {throw new CustomError(401, 'Unauthorized')}
            await userBusiness.validateUser(token)
            res.status(200).send({message: 'Authorized'})
        } catch (error) {
            const {statusCode, message} = error
            res.status(statusCode || 400).send({message})
        }
    }

}


export const userController:UserController = new UserController()
