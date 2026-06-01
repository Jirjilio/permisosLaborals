import express from 'express'
const route = express.Router()
import permisoController from '../controllers/permisos.js'
import { verificarAdmin, verificarToken } from '../helpers/autenticacion.js'


route.post('/', verificarToken, permisoController.create.bind(permisoController))
route.get('/', verificarToken, permisoController.getAll.bind(permisoController))
route.get('/:id', verificarToken, permisoController.getOne.bind(permisoController))
route.put('/:id', verificarAdmin, permisoController.update.bind(permisoController))
route.delete('/:id', verificarAdmin, permisoController.delete.bind(permisoController))
route.post('/:permisoId/solicitar', verificarToken, permisoController.pedirPermiso.bind(permisoController))
export default route;