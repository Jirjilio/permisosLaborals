import { generarToken } from '../helpers/autenticacion.js';
import usuariosModelo from '../models/users.js';
import bcrypt from 'bcrypt';
/* Controlador para los administradores, revisar si podemos aplicar el mismo controlador para los usuarios normales,
 o si es necesario crear otro controlador para ellos, ya que el admin tiene más permisos que el usuario normal */
class usuarioController {
    constructor() {

    }
    //Crear un nuevo empleado, solo lo puede hacer el admin, el rol se asigna automáticamente a user
    async crearEmpleado(req, res){
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
    //login, servirá para admins y usuarios normales
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
        
        res.status(200).json({  token,user: usuarioExiste.usuario ,rol: usuarioExiste.rol, id: usuarioExiste._id });
        console.log("inicio de sesión exitoso");
    }
    //get id
    async obtenerEmpleado(req, res){
        try {
            const data = await usuariosModelo.getOne({ usuario: req.params.usuario })
            res.status(200).json(data)
        } catch (error) {
            console.error("Error en el get one")
            res.status(500).send({error})
        }
    }
    //update
    async updateEmpleado(req, res){
        try {
            const { usuario } = req.params
            const data = await usuariosModelo.update(usuario, req.body)
            res.status(200).json({data})
        } catch (error) {
            console.error("Error en el update")
            res.status(500).send({error})
        }
    }
    //delete 
    async deleteEmpleado(req, res){
        try {
            const { usuario } = req.params
            const data = await usuariosModelo.delete(usuario)
            res.status(206).json({data})
        } catch (error) {
            console.error("Error en el delete")
            res.status(500).send({error})
        }
    }

    async todosUsuarios(req, res){
        try {
            const data = await usuariosModelo.getAll()
            res.status(200).json({data})
        } catch (error) {
            console.error("Error en el get all")
            res.status(500).send({error})
        }
    }
}
export default new usuarioController