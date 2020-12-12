import express from 'express'
import { userController } from '../controller/UserController'


export const userRouter = express.Router()
userRouter.post('/signup', userController.createUser)    //endpoint para cadastro de usuário
userRouter.post('/login', )     //endpoint para login de usuário

export const imageRouter = express.Router()
imageRouter.post('/', )     //endpoint para cadastro de conteúdo
imageRouter.get('/', )      //endpoint para listar todos os itens
imageRouter.get('/:id', )   //endpoint para consultar/listar item específico
