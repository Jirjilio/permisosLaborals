import permisosModelo from '../models/permisos.js'
import UsuarioModelo from '../models/users.js'

class permisoController {
    constructor() {

    }

    async obtenerUsuarioAutenticado(req) {
        if (!req.emailConectado) {
            return null;
        }

        return await UsuarioModelo.getOne({ email: req.emailConectado });
    }

    //Create
    async create(req, res){
        try {
            const body = req.body ?? {};
            const usuario = await this.obtenerUsuarioAutenticado(req);

            if (!usuario) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const empleatCreadorId = usuario.rol === 'admin'
                ? (body.empleatCreadorId || usuario.id || usuario._id?.toString())
                : (usuario.id || usuario._id?.toString());

            const { dataInici, dataFinal, tipus, descripcio } = body;

            if (!empleatCreadorId || !dataInici || !dataFinal || !tipus || !descripcio) {
                return res.status(400).json({
                    error: 'Falten camps obligatoris',
                    required: ['empleatCreadorId', 'dataInici', 'dataFinal', 'tipus', 'descripcio']
                });
            }

            const data = await permisosModelo.create({
                empleatCreadorId,
                dataCreacio: body.dataCreacio || new Date(),
                dataInici,
                dataFinal,
                tipus,
                descripcio,
                estat: 'pendent',
                empleatTramitadorId: '',
                dataTramitacio: '',
            })
            res.status(201).json(data)
        } catch (error) {
            console.error("Error en el create", error)
            res.status(500).send({error})
        }
    }
    //get todo
    async getAll(req, res){
        try {
            const usuario = await this.obtenerUsuarioAutenticado(req);

            if (!usuario) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const filtros = { ...(req.query ?? {}) };

            if (usuario.rol !== 'admin') {
                filtros.empleatCreadorId = usuario.id || usuario._id?.toString();
                delete filtros.empleatTramitadorId;
                delete filtros.estat;
            }

            const data = await permisosModelo.getAll(filtros)
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
            const usuario = await this.obtenerUsuarioAutenticado(req);
            const data = await permisosModelo.getOne(id)

            if (!usuario) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            if (!data) {
                return res.status(404).json({ error: 'El permiso no existe' });
            }

            if (usuario.rol !== 'admin') {
                const userId = usuario.id || usuario._id?.toString();
                if (String(data.empleatCreadorId) !== String(userId)) {
                    return res.status(403).json({ error: 'No autorizado' });
                }
            }

            res.status(200).json(data)
        } catch (error) {
            console.error("Error en el get one")
            res.status(500).send({error})
        }
    }
    //update
    async update(req, res){
        try {
            const { id } = req.params
            const usuario = await this.obtenerUsuarioAutenticado(req);

            if (!usuario || usuario.rol !== 'admin') {
                return res.status(403).json({ error: 'No autorizado' });
            }

            const permisoActual = await permisosModelo.getOne(id);
            if (!permisoActual) {
                return res.status(404).json({ error: 'El permiso no existe' });
            }

            const body = { ...(req.body ?? {}) };

            if (body.estat === 'aprovat' || body.estat === 'refusat') {
                body.empleatTramitadorId = usuario.id || usuario._id?.toString();
                body.dataTramitacio = new Date();
            }

            if (body.estat === undefined && permisoActual.estat) {
                body.estat = permisoActual.estat;
            }

            const data = await permisosModelo.update(id, body)
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
            const usuario = await this.obtenerUsuarioAutenticado(req);

            if (!usuario || usuario.rol !== 'admin') {
                return res.status(403).json({ error: 'No autorizado' });
            }

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
            const permiso = await permisosModelo.getOne(permisoId);

            if (!permiso) {
                return res.status(404).json({ error: 'El permiso no existe' });
            }

            const data = await permisosModelo.update(permisoId, {
                ...permiso,
                empleatCreadorId: usuarioId,
                estat: 'pendent',
            });

            res.status(201).json(data);
        }catch (error) {
            console.error("Error en buyPermiso:", error);
            res.status(500).json({ mensaje: error.message });
        }    
    }
    
}
export default new permisoController