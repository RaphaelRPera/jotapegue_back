import { imageData } from "../data/ImageData";
import { CustomError } from "../error/CustomError";
import { services } from "../services/services";


class ImageBusiness {
    public createImage = async (image: any):Promise<any> => {
        try {
            const {subtitle, author, file, tags, collection} = image

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
                return {id, message:'Image already existis'}
            }
            
        } catch (error) {
            const {statusCode, message} = error
            throw new CustomError(statusCode, message)
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

