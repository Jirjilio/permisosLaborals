import express from 'express'
const route = express.Router()
import usuarioController from '../controllers/users.js'
import { verificarToken } from '../helpers/autenticacion.js'


route.post('/crearempleado', usuarioController.crearEmpleado)
route.post('/login', usuarioController.login)
route.get('/todosempleados', verificarToken, usuarioController.todosEmpleados)
route.get('/:usuario', verificarToken, usuarioController.obtenerEmpleado)
route.delete('/:usuario', verificarToken, usuarioController.deleteEmpleado)

export default route;