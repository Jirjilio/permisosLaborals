import mongoose from 'mongoose';
import usuarios from '../schemas/users.js';

class usuariosModelo{
    async create(usuario){
        try {
            return await usuarios.create(usuario)
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    }

    async login(usuario){
        try {
            return await usuarios.findOne({ usuario })
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        }
    }

    async getOne(filtro){
        try {
            return await usuarios.findOne(filtro);
        } catch (error) {
            console.error("Error al buscar el usuario por ID:", error);
        }
        
    }

    async getAll(){
        try {
            return await usuarios.find();
        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error);
    }
    }
}
export default new usuariosModelo