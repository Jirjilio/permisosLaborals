import express from 'express'
const route = express.Router()
import usuarioController from '../controllers/users.js'
import { verificarToken } from '../helpers/autenticacion.js'


route.post('/register', usuarioController.register)
route.post('/login', usuarioController.login)
route.get('/profile', verificarToken, usuarioController.profile)
route.get('/:id/mispermisos', verificarToken, usuarioController.misPermisos)
// route.get('/', usuarioController.login)
// route.get('/:id', usuarioController.getOne)
// route.put('/:id', usuarioController.update)
// route.delete('/:id', usuarioController.delete)

export default route;