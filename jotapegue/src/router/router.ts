import express from 'express'
import { imageController } from '../controller/ImageController'
import { userController } from '../controller/UserController'


export const userRouter = express.Router()
userRouter.post('/signup', userController.createUser)   //endpoint para cadastro de usuário
userRouter.post('/login', userController.login)         //endpoint para login de usuário

export const imageRouter = express.Router()
imageRouter.post('/', imageController.createImage)     //endpoint para cadastro de conteúdo
imageRouter.get('/', )      //endpoint para listar todos os itens

imageRouter.post('/tag', imageController.createTag)   //endpoint para consultar/listar item específico

imageRouter.get('/:id', )   //endpoint para consultar/listar item específico

