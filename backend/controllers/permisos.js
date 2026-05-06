import permisosModelo from '../models/permisos.js'

class permisoController {
    constructor() {

    }
    //Create
    async create(req, res){
        const {empleado, creacion, fechaInicio, fechaFinal, tipo, descripcion, estado, adminGestor, fechaTramitado} = req.body;
        try {
            const data = await permisosModelo.create({empleado, creacion, fechaInicio, fechaFinal, tipo, descripcion, estado, adminGestor, fechaTramitado})
            res.status(201).json(data)
        } catch (error) {
            console.error("Error en el create", error)
            res.status(500).send({error})
        }
    }
    //get todo
    async getAll(req, res){
        try {
            const data = await permisosModelo.getAll()
            res.status(200).json(data)
        } catch (error) {
            console.error("Error en el get all")
            res.status(500).send({error})
        }
    }
    //get id
    async getOne(req, res){
        try {
            const { id } = req.params
            const data = await permisosModelo.getOne(id)
            res.status(200).json(data)
        } catch (error) {
            console.error("Error en el get one")
            res.status(500).send({error})
        }
    }
    //update
    async update(req, res){
        const {nombre, tipo, precio, lanzado} = req.body;
        try {
            const { id } = req.params
            const data = await permisosModelo.update(id, {nombre, tipo, precio, lanzado})
            res.status(200).json({data})
        } catch (error) {
            console.error("Error en el update")
            res.status(500).send({error})
        }
    }
    //delete 
    async delete(req, res){
        try {
            const { id } = req.params
            const data = await permisosModelo.delete(id)
            res.status(206).json({data})
        } catch (error) {
            console.error("Error en el delete")
            res.status(500).send({error})
        }
    }

    async pedirPermiso(req, res){
        try {
            const { permisoId } = req.params
            const { usuarioId } = req.body

            if (!usuarioId) {
                return res.status(400).json({ error: 'ID de usuario no proporcionado' });
            }
            const data = await permisosModelo.pedirPermiso(permisoId, usuarioId);
            res.status(201).json(data);
        }catch (error) {
            console.error("Error en buyPermiso:", error);
            res.status(500).json({ mensaje: error.message });
        }    
    }
    
}
export default new permisoController