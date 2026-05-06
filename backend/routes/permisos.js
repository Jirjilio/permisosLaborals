import express from 'express'
const route = express.Router()
import permisoController from '../controllers/permisos.js'
import { verificarToken } from '../helpers/autenticacion.js'


route.post('/', permisoController.create)
route.get('/', permisoController.getAll)
route.get('/:id', permisoController.getOne)
route.put('/:id', verificarToken, permisoController.update)
route.delete('/:id', verificarToken, permisoController.delete)
route.post('/:permisoId/solicitar', verificarToken, permisoController.pedirPermiso)
export default route;