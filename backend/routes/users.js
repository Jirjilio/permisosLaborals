import express from 'express'
const route = express.Router()
import usuarioController from '../controllers/users.js'
import { verificarToken } from '../helpers/autenticacion.js'


route.post('/crearempleado', usuarioController.crearEmpleado)
route.post('/login', usuarioController.login)
route.get('/todosusuarios', verificarToken, usuarioController.todosUsuarios)
route.get('/:usuario', verificarToken, usuarioController.obtenerEmpleado)
route.delete('/:usuario', verificarToken, usuarioController.deleteEmpleado)

export default route;