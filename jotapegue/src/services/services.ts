import * as jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import * as bcrypt from 'bcryptjs'

class Services {
    generateId = ():string => v4()

    generateToken = (payload:{}):string => {      
        return jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
    }

    hash = async (plainText:string): Promise<string> => {
        const rounds = Number(process.env.BCRYPT_COST)
        const salt = await bcrypt.genSalt(rounds)
        return bcrypt.hash(plainText, salt)
    }
}


export const services:Services = new Services()
