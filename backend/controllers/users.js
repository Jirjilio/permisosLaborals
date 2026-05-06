import { generarToken } from '../helpers/autenticacion.js';
import UsuarioModelo from '../models/users.js';
import bcrypt from 'bcrypt';

class usuarioController {
    constructor() {

    }
    //Registrar usuario
    async register(req, res){
        try {
            const { nombre, apellido1, apellido2, email, usuario, password } = req.body;

            const usuarioExiste = await UsuarioModelo.getOne({ email });
            if (usuarioExiste) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            const passEncriptada = await bcrypt.hash(password, 10);

            const data = await UsuarioModelo.create({
                nombre,
                apellido1,
                apellido2,
                email,
                usuario,
                password: passEncriptada
            });
            res.status(201).json(data)
        } catch (error) {
            console.error("Error en el Register:", error)
            res.status(500).send({error})
        }
    }
    //get todo
    async login(req, res){
        const { usuario, password } = req.body;
        console.log("Body recibido:", req.body);

        const usuarioExiste = await UsuarioModelo.getOne({ usuario });
        if (!usuarioExiste) {
            return res.status(400).json({ error: 'El usuario no existe' });
        }

        const passwordValida = await bcrypt.compare(password, usuarioExiste.password);

        if (!passwordValida) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = generarToken(usuario);
        
        res.status(200).json({ message: 'Inicio de sesión exitoso' , token});
    }
    //get id
    async profile(req, res){
        try {
            const data = await UsuarioModelo.getOne({ usuario: req.usuarioConectado })
            res.status(201).json(data)
        } catch (error) {
            console.error("Error en el get one")
            res.status(500).send({error})
        }
    }
    //update
    async update(req, res){
        try {
            const { id } = req.params
            const data = await UsuarioModelo.update(id, req.body)
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
            const data = await UsuarioModelo.delete(id)
            res.status(206).json({data})
        } catch (error) {
            console.error("Error en el delete")
            res.status(500).send({error})
        }
    }

    async misPermisos(req, res){
        try {
            const {id} = req.params;

            const usuarioExiste = await UsuarioModelo.getOneByID( id );

            if (!usuarioExiste) {
                return res.status(400).json({ error: 'El usuario no existe' });
            }

            const data = await UsuarioModelo.misPermisos(id);
            res.status(200).json(data);
            
        } catch (error) {
            res.status(500).json({ mensaje: error.message })
        }
    }
}
export default new usuarioController