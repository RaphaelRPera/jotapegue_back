import { imageData } from "../data/ImageData";
import { userData } from "../data/UserData";
import { CustomError } from "../error/CustomError";
import { services } from "../services/services";
import { userBusiness } from "./UserBusiness";


class ImageBusiness {
    public createImage = async (data: any):Promise<any> => {
        try {
            const token = data.token
            const user = await userBusiness.validateUser(token)

            const {subtitle, author, file, tags, collection} = data.body

            if (!subtitle) {throw new CustomError(400, 'Subtitle is required')}
            if (!author) {throw new CustomError(400, 'Author is required')}
            if (!file) {throw new CustomError(400, 'File is required')}
            if (!collection) {throw new CustomError(400, 'Collection is required')}

            const imageBd = await imageData.getImageByFile(file)
            if (!imageBd.length) {
                const id:string = services.generateId()
                const date:Date = new Date()
    
                const newImage = {id, subtitle, author, date, file, collection}
                await imageData.createImage(newImage)
                return {id, message:'Image successfully created'}
            } else {
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
}

export const imageBusiness:ImageBusiness = new ImageBusiness()

