import express from 'express'
const route = express.Router()
import permisosController from '../controllers/permisos.js'
import { verificarToken } from '../helpers/autenticacion.js'


route.post('/', permisosController.create)
route.get('/', permisosController.getAll)
route.get('/:id', permisosController.getOne)
route.put('/:id', verificarToken, permisosController.update)
route.delete('/:id', verificarToken, permisosController.delete)
route.post('/:permisoId/solicitar', verificarToken, permisosController.buyPermisos)

export default route;