import { Response, Request } from 'express'
import { userBusiness } from '../business/UserBusiness'
import { CustomError } from '../error/CustomError'
import { UserInputDTO } from '../model/User'



class UserController {
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const {name, email, nickname, password} = req.body
            const input: UserInputDTO = {   
                name, email, nickname, password
            }

            const token:string = await userBusiness.createUser(input)

            res.status(200).send({message: 'User successfully created', token})
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }
}


export const userController:UserController = new UserController()
