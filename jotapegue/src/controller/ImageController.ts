import { Response, Request } from 'express'
import { imageBusiness } from '../business/ImageBusiness'


class ImageController {
    public createImage = async (req: Request, res: Response):Promise<void> => {
        try {
            const token = req.headers.authorization
            const imageResult =  await imageBusiness.createImage({token, body: req.body})

            await imageBusiness.createTag(req.body.tags)

            const newImageTag = {image_id: imageResult.id, tags: req.body.tags}
            await imageBusiness.createImageTag(newImageTag)
            
            res.status(200).send(imageResult)
        } catch (error) {
            const {statusCode, message} = error
            // console.log(`[imageController]: [createImage]: [error]`, error)
            switch (message) {
                case "Cannot read property 'id' of undefined":
                    res.status(statusCode || 500).send({message: 'Internal Server Error'})
                    break;
            
                default:
                    res.status(statusCode || 400).send({message})
                    break;
            }
        }
    }


    public getImageById = async (req: Request, res: Response):Promise<any> => {
        try {
            const id = req.params.id
            const token = req.headers.authorization
            const image = await imageBusiness.getImageById({id, token})
            res.status(200).send(image)
        } catch (error) {
            const {statusCode, message} = error
            res.status(statusCode || 400).send({message})
        }
    }


    public deleteImage = async (req:Request, res: Response):Promise<void> => {
        try {
            const id = req.params.id
            await imageBusiness.deleteImageTag(id)
            await imageBusiness.deleteImage(id)
            res.status(200).send({message: `Image successfully deleted`})
        } catch (error) {
            const {statusCode, message} = error
            res.status(statusCode || 400).send({message})
        }
    }

}


export const imageController:ImageController = new ImageController()
