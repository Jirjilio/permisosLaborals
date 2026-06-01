import express from 'express'
const route = express.Router()
import usuarioController from '../controllers/users.js'
import { verificarAdmin, verificarToken } from '../helpers/autenticacion.js'


route.post('/register', usuarioController.register)
route.post('/login', usuarioController.login)
route.get('/profile', verificarToken, usuarioController.profile)
route.get('/:id/mispermisos', verificarToken, usuarioController.misPermisos)
route.get('/', verificarAdmin, usuarioController.getAll)
route.post('/', verificarAdmin, usuarioController.create)
route.get('/:id', verificarAdmin, usuarioController.getOne)
route.put('/:id', verificarAdmin, usuarioController.update)
route.delete('/:id', verificarAdmin, usuarioController.delete)

export default route;