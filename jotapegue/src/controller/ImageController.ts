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

    // public createTag = async (req: Request, res: Response):Promise<void> => {
    //     try {
    //         const tags = req.body.tags
    //         await imageBusiness.createTag(tags)

    //         res.status(200).send({message: 'Tag successfully created'})
    //     } catch (error) {
    //         const {statusCode, message} = error
    //         console.log(`[controller]: error:`, statusCode, message)
    //         res.status(statusCode || 400).send({message})
    //     }
    // }
}


export const imageController:ImageController = new ImageController()
