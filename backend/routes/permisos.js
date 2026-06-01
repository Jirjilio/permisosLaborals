import express from 'express'
const route = express.Router()
import permisoController from '../controllers/permisos.js'
import { verificarAdmin, verificarToken } from '../helpers/autenticacion.js'


route.post('/', verificarToken, permisoController.create)
route.get('/', verificarToken, permisoController.getAll)
route.get('/:id', verificarToken, permisoController.getOne)
route.put('/:id', verificarAdmin, permisoController.update)
route.delete('/:id', verificarAdmin, permisoController.delete)
route.post('/:permisoId/solicitar', verificarToken, permisoController.pedirPermiso)
export default route;