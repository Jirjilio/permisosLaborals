import express from 'express'
const route = express.Router()
import usuarioController from '../controllers/users.js'
import { verificarAdmin, verificarToken } from '../helpers/autenticacion.js'


route.post('/register', usuarioController.register.bind(usuarioController))
route.post('/login', usuarioController.login.bind(usuarioController))
route.get('/profile', verificarToken, usuarioController.profile.bind(usuarioController))
route.get('/:id/mispermisos', verificarToken, usuarioController.misPermisos.bind(usuarioController))
route.get('/', verificarAdmin, usuarioController.getAll.bind(usuarioController))
route.post('/', verificarAdmin, usuarioController.create.bind(usuarioController))
route.get('/:id', verificarAdmin, usuarioController.getOne.bind(usuarioController))
route.put('/:id', verificarAdmin, usuarioController.update.bind(usuarioController))
route.delete('/:id', verificarAdmin, usuarioController.delete.bind(usuarioController))

export default route;