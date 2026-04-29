import mongoose from 'mongoose';
import usuarios from '../schemas/users.js';

class UsuarioModelo{
    async create(usuario){
        try {
            return await usuarios.create(usuario)
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    }
}
export default new usuariosModelo