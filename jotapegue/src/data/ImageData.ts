import { CustomError } from '../error/CustomError'
import { BaseDataBase } from './BaseDataBase'


class ImageData extends BaseDataBase {
    public createImage = async (image: any):Promise<void> => {
        try {
            const {id, subtitle, author, date, file, collection} = image
            await this.connection('JPG_IMAGE')
                .insert({
                    id, subtitle, author, date, file, collection
                })
        } catch (error) {
            const {statusCode, code, message, sqlMessage} = error

            switch (error.code) {
                case "ER_DUP_ENTRY":
                    // console.log(`[data]: [createTag]: error`, error.code); break;
                    throw new CustomError(403, 'Image already on the system'); break;
                default:
                    // console.log(`[data]: [createTag]: error`, error.code);
                    throw new CustomError(statusCode || code, sqlMessage || message); break;
                    break;
            }
        }
    }


    public createTag = async (data: any):Promise<any> => {
        try {
            const {id, tag} = data
            await this.connection('JPG_TAG')
                .insert({
                    id, tag
                })
        } catch (error) {
            const {statusCode, code, message, sqlMessage} = error

            switch (error.code) {
                case "ER_DUP_ENTRY":
                    return
                    console.log(`[data]: [createTag]: error`, error.code);
                    // throw new CustomError(403, 'Tag already exists'); break;
                default:
                    // console.log(`[data]: [createTag]: error`, error.code);
                    throw new CustomError(statusCode || code, sqlMessage || message); break;
                    break;
            }
        }
    }


    public createImageTag = async (data: any):Promise<void> => {
        try {
            const {image_id, tag_id} = data
            await this.connection('JPG_IMAGE_TAG')
                .insert({
                    image_id, tag_id
                })
        } catch (error) {
            const {statusCode, code, message, sqlMessage} = error

            switch (error.code) {
                case "ER_DUP_ENTRY":
                    console.log(`[data]: [createImageTag]: error`, error.code); break;
                    // throw new CustomError(403, 'ImageTag already exists'); break;
                default:
                    // console.log(`[data]: [createImageTag]: error`, error.code);
                    throw new CustomError(statusCode || code, sqlMessage || message); break;
                    break;
            }
        }
    }


    public getImageByFile = async (file:string):Promise<any> => {
        try {
            const image = await this.connection('JPG_IMAGE')
                .select('*')
                .where({file})
            return image
        } catch (error) {
            
        }
    }


    public getTagByName = async (name:string):Promise<any> => {
        try {
            const tag = await this.connection('JPG_TAG')
                .select('*')
                .where({tag:name})
            return tag
        } catch (error) {
            const {statusCode, message} = error 
            throw new CustomError(statusCode, message)
        }
    }

    public getImageTag = async (data:any):Promise<any> => {
        try {
            const {image_id, tag_id} = data
            const imageTag = await this.connection('JPG_IMAGE_TAG')
                .select('*')
                .where({image_id})
                .andWhere({tag_id})
            return imageTag
        } catch (error) {
            const {statusCode, message} = error 
            throw new CustomError(statusCode, message)
        }
    }

}


export const imageData:ImageData = new ImageData()
