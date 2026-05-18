import { generarToken } from '../helpers/autenticacion.js';
import UsuarioModelo from '../models/users.js';
import bcrypt from 'bcrypt';

class usuarioController {
    constructor() {

    }
    //Registrar usuario
    async register(req, res){
        try {
            const { email, nombre, telefono = '', password } = req.body ?? {};

            if (!email || !nombre || !password) {
                return res.status(400).json({
                    error: 'Falten camps obligatoris',
                    required: ['email', 'nombre', 'password']
                });
            }

            const usuarioExiste = await UsuarioModelo.getOne({ email });
            if (usuarioExiste) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            const passEncriptada = await bcrypt.hash(password, 10);
            const usuario = email.split('@')[0];

            const data = await UsuarioModelo.create({
                email,
                nombre,
                telefono,
                password: passEncriptada,
                usuario,
                apellido1: '',
                rol: 'user'
            });
            res.status(201).json(data)
        } catch (error) {
            console.error("Error en el Register:", error)
            res.status(500).send({ error: error.message || String(error) })
        }
    }
    //get todo
    async login(req, res){
        const { email, usuario, usuari, password } = req.body ?? {};
        const identificador = String(email || usuario || usuari || '').trim();

        if (!identificador || !password) {
            return res.status(400).json({ error: 'Falten camps obligatoris', required: ['email o usuario', 'password'] });
        }

        console.log("Body recibido:", req.body);

        const usuarioExiste = await UsuarioModelo.getOne(
            identificador.includes('@')
                ? { email: identificador }
                : { $or: [{ usuario: identificador }, { email: identificador }] }
        );
        if (!usuarioExiste) {
            return res.status(400).json({ error: 'El usuario no existe' });
        }

        const passwordValida = await bcrypt.compare(password, usuarioExiste.password);

        if (!passwordValida) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = generarToken(usuarioExiste.email);
        
        res.status(200).json({ message: 'Inicio de sesión exitoso' , token});
    }
    //get id
    async profile(req, res){
        try {
            const data = await UsuarioModelo.getOne({ email: req.emailConectado })
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