import { generarToken } from '../helpers/autenticacion.js';
import UsuarioModelo from '../models/users.js';
import bcrypt from 'bcrypt';

class usuarioController {
    constructor() {

    }

    sanitizarUsuario(usuario) {
        if (!usuario) {
            return usuario;
        }

        const plain = typeof usuario.toObject === 'function' ? usuario.toObject() : { ...usuario };
        const { password, ...safeUser } = plain;
        return safeUser;
    }

    async prepararUsuarioParaGuardado(datos = {}, rolPorDefecto = 'basic') {
        const {
            email,
            nombre,
            apellido1,
            apellido2 = '',
            usuario,
            password,
            telefono = '',
            imagen = '',
            rol = rolPorDefecto,
        } = datos;

        if (!email || !nombre || !apellido1 || !password) {
            return null;
        }

        const usuarioFinal = String(usuario || email.split('@')[0]).trim();
        const passEncriptada = await bcrypt.hash(password, 10);

        return {
            email: String(email).trim(),
            nombre: String(nombre).trim(),
            apellido1: String(apellido1).trim(),
            apellido2: String(apellido2 || '').trim(),
            usuario: usuarioFinal,
            telefono: String(telefono || '').trim(),
            imagen: String(imagen || '').trim(),
            password: passEncriptada,
            rol: rol === 'admin' ? 'admin' : 'basic',
        };
    }

    //Registrar usuario
    async register(req, res){
        try {
            const payload = await this.prepararUsuarioParaGuardado(req.body ?? {}, 'basic');

            if (!payload) {
                return res.status(400).json({
                    error: 'Falten camps obligatoris',
                    required: ['email', 'nombre', 'apellido1', 'password']
                });
            }

            const usuarioExiste = await UsuarioModelo.getOne({
                $or: [{ email: payload.email }, { usuario: payload.usuario }]
            });
            if (usuarioExiste) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            const data = await UsuarioModelo.create({
                ...payload,
            });
            res.status(201).json(this.sanitizarUsuario(data))
        } catch (error) {
            console.error("Error en el Register:", error)
            res.status(500).send({ error: error.message || String(error) })
        }
    }

    async create(req, res) {
        try {
            const payload = await this.prepararUsuarioParaGuardado(req.body ?? {}, 'basic');

            if (!payload) {
                return res.status(400).json({
                    error: 'Falten camps obligatoris',
                    required: ['email', 'nombre', 'apellido1', 'password']
                });
            }

            const usuarioExiste = await UsuarioModelo.getOne({
                $or: [{ email: payload.email }, { usuario: payload.usuario }]
            });

            if (usuarioExiste) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            const data = await UsuarioModelo.create(payload);
            res.status(201).json(this.sanitizarUsuario(data))
        } catch (error) {
            console.error("Error en el Create:", error)
            res.status(500).send({ error: error.message || String(error) })
        }
    }
    //get todo
    async getAll(req, res) {
        try {
            const data = await UsuarioModelo.getAll();
            res.status(200).json(data.map((item) => this.sanitizarUsuario(item)));
        } catch (error) {
            console.error("Error en el get all")
            res.status(500).send({error})
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const data = await UsuarioModelo.getOneByID(id);

            if (!data) {
                return res.status(404).json({ error: 'El usuario no existe' });
            }

            res.status(200).json(this.sanitizarUsuario(data))
        } catch (error) {
            console.error("Error en el get one")
            res.status(500).send({error})
        }
    }

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
            res.status(200).json(this.sanitizarUsuario(data))
        } catch (error) {
            console.error("Error en el get one")
            res.status(500).send({error})
        }
    }
    //update
    async update(req, res){
        try {
            const { id } = req.params
            const usuarioActual = await UsuarioModelo.getOneByID(id)

            if (!usuarioActual) {
                return res.status(404).json({ error: 'El usuario no existe' });
            }

            const body = { ...(req.body ?? {}) };

            if (body.password) {
                body.password = await bcrypt.hash(body.password, 10);
            }

            if (body.rol) {
                body.rol = body.rol === 'admin' ? 'admin' : 'basic';
            }

            if (body.usuario === undefined && body.email) {
                body.usuario = String(body.email).split('@')[0];
            }

            const data = await UsuarioModelo.update(id, body)
            res.status(200).json(this.sanitizarUsuario(data))
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
            res.status(200).json({data: this.sanitizarUsuario(data)})
        } catch (error) {
            console.error("Error en el delete")
            res.status(500).send({error})
        }
    }

    async misPermisos(req, res){
        try {
            const {id} = req.params;
            const usuarioConectado = await UsuarioModelo.getOne({ email: req.emailConectado });

            if (!usuarioConectado) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            if (usuarioConectado.rol !== 'admin') {
                const userId = String(usuarioConectado.id || usuarioConectado._id?.toString() || '');
                if (String(id) !== userId) {
                    return res.status(403).json({ error: 'No autorizado' });
                }
            }

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