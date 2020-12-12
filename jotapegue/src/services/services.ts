import * as jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import * as bcrypt from 'bcryptjs'

class Services {
    generateId = ():string => v4()

    generateToken = (payload:object):string => {      
        return jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
    }

    getTokenData = (token:string):object => {
        const result: any = jwt.verify(
            token,
            process.env.JWT_KEY as string
        )
        // return {id: result.id}
        return result
    }

    hash = async (plainText:string): Promise<string> => {
        const rounds = Number(process.env.BCRYPT_COST)
        const salt = await bcrypt.genSalt(rounds)
        return bcrypt.hash(plainText, salt)
    }


    compare = async (plainText: string, cypherText: string):Promise<boolean> => {
        return bcrypt.compare(plainText, cypherText)
    }
}


export const services:Services = new Services()
