import { generarToken } from '../helpers/autenticacion.js';
import usuariosModelo from '../models/users.js';
import bcrypt from 'bcrypt';

class usuarioController {
    constructor() {

    }
    //Registrar usuario
    async register(req, res){
        try {
            const { nombre, apellido1, apellido2, email, usuario, password } = req.body;

            const usuarioExiste = await usuariosModelo.getOne({ usuario });
            if (usuarioExiste) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            const passEncriptada = await bcrypt.hash(password, 10);

            const data = await usuariosModelo.create({
                nombre,
                apellido1,
                apellido2,
                email,
                usuario,
                password: passEncriptada,
                rol: 'user'
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

        const usuarioExiste = await usuariosModelo.getOne({ usuario });
        if (!usuarioExiste) {
            return res.status(400).json({ error: 'El usuario no existe' });
        }

        const passwordValida = await bcrypt.compare(password, usuarioExiste.password);

        if (!passwordValida) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = generarToken(usuario);
        
        res.status(200).json({ message: 'Inicio de sesión exitoso' , token});
        console.log("inicio de sesión exitoso");
    }
    //get id
    async profile(req, res){
        try {
            const data = await usuariosModelo.getOne({ usuario: req.usuarioConectado })
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
            const data = await usuariosModelo.update(id, req.body)
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
            const data = await usuariosModelo.delete(id)
            res.status(206).json({data})
        } catch (error) {
            console.error("Error en el delete")
            res.status(500).send({error})
        }
    }

    async misPermisos(req, res){
        try {
            const {id} = req.params;

            const usuarioExiste = await usuariosModelo.getOne({ _id: id });

            if (!usuarioExiste) {
                return res.status(400).json({ error: 'El usuario no existe' });
            }

            const data = await usuariosModelo.misPermisos(id);
            res.status(200).json(data);
            
        } catch (error) {
            res.status(500).json({ mensaje: error.message })
        }
    }
}
export default new usuarioController