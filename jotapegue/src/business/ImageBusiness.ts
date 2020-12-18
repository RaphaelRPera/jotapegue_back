import { userController } from "../controller/UserController";
import { imageData } from "../data/ImageData";
import { userData } from "../data/UserData";
import { CustomError } from "../error/CustomError";
import { services } from "../services/services";
import { userBusiness } from "./UserBusiness";
import { UserRole } from '../model/User'


class ImageBusiness {
    public createImage = async (data: any):Promise<any> => {
        console.log(`[userBusiness]: [createImage]:`)
        try {
            const token = data.token
            const user = await userBusiness.validateUser(token)

            const {subtitle, file, tags, collection} = data.body

            if (!subtitle) {throw new CustomError(400, 'Subtitle is required')}
            if (!file) {throw new CustomError(400, 'File is required')}
            if (!collection) {throw new CustomError(400, 'Collection is required')}

            const imageBd = await imageData.getImageByFile(file)
            if (!imageBd.length) {
                const id:string = services.generateId()
                const date:Date = new Date()
                const user_id = user && user.id

                const newImage = {id, subtitle, user_id, date, file, collection}
                await imageData.createImage(newImage)
                return {id, message:'Image successfully created'}
            } else {
                throw new CustomError(409, 'Image already exists')
                const id:string = imageBd[0].id
                return {id, message:'Image already exists'}
            }
            
        } catch (error) {
            const {statusCode, message} = error
            switch (message) {
                case 'invalid signature': throw new CustomError(401, 'Unauthorized'); break;
                default: throw new CustomError(statusCode, message); break;
            }
        }
    }


    public createTag = async (tags: any):Promise<void> => {
        console.log(`[userBusiness]: [createTag]:`)
        if (tags.length) {
            const newTags = tags.map((tag:string) => {
                const id:string = services.generateId()
                return {id, tag}
            })

            try {
                newTags.map(async (item:any) => {
                    await imageData.createTag({id: item.id, tag: item.tag.toLowerCase()})
                })
            } catch (error) {
                const {statusCode, message} = error
                throw new CustomError(statusCode, message)
            }
        }
    }


    public createImageTag = async (data: any):Promise<void> => {
        console.log(`[userBusiness]: [createImageTag]:`)
        const {image_id, tags} = data

        if (tags.length) {
            try {
                tags.map(async (tag:string) => {
                    const tagBd = await imageData.getTagByName(tag)
                    const tag_id:string = tagBd[0].id
                    const newImageTag = {image_id, tag_id}
                    const imageTagBd = await imageData.getImageTag(newImageTag)
                    if (!imageTagBd.length) {
                        await imageData.createImageTag(newImageTag)
                    }
                })
            } catch (error) {
                const {statusCode, message} = error
                throw new CustomError(statusCode, message)
            }
        }
    }


    public getImageById = async (data:any):Promise<any> => {
        try {
            const {id, token} = data

            if (!id) {throw new CustomError(406, 'Image ID is required')}
            if (!token) {throw new CustomError(401, 'Unauthorized')}

            const user = await userBusiness.validateUser(token)
            let image: any
            if (id === 'all') {
                if (user && user.role === UserRole.ADMIN) {
                    image = await imageData.getImageAll(user.id)
                } else {
                    throw new CustomError(401, 'Unauthorized')
                }
            } else {
                image = user && await imageData.getImageById(id, user.id)
            }

            return image
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }

    public getImageAll = async (data:any):Promise<any> => {
        try {
            const {token} = data
            if (!token) {throw new CustomError(401, 'Unauthorized')}

            // const user = await userBusiness.validateUser(token)
            const user = services.getTokenData(token)
            const image = await imageData.getImageAll(user.id)

            // let image: any
            // if (id === 'all') {
            //     if (user && user.role === UserRole.ADMIN) {
            //         image = await imageData.getImageAll(user.id)
            //     } else {
            //         throw new CustomError(401, 'Unauthorized')
            //     }
            // } else {
            //     image = user && await imageData.getImageById(id, user.id)
            // }

            return image
        } catch (error) {
            const {statusCode, message} = error
            let errorMessage = message
            let errorCode = statusCode
            switch (message) {
                case 'jwt malformed': errorCode = 401; errorMessage = 'Unauthorized'; break;
                default: break;
            }
            throw new CustomError(errorCode, errorMessage)
        }
    }


    public deleteImage = async (id:string):Promise<any> => {
        try {
            if (!id) {throw new CustomError(406, 'ID is required')}
            await imageData.deleteImage(id)
            return `[imageBusiness]: [deleteImage]: [RETURN]`
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }

    public deleteImageTag = async (id:string):Promise<any> => {
        try {
            if (!id) {throw new CustomError(406, 'ID is required')}
            await imageData.deleteImageTag(id)
            return `[imageBusiness]: [deleteImageTag]: [RETURN]`
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
        }
    }

}

export const imageBusiness:ImageBusiness = new ImageBusiness()

