import mongoose from 'mongoose';
import usuarios from '../schemas/users.js';
import Permiso from '../schemas/permisos.js';

class usuariosModelo {
    async create(usuario) {
        try {
            return await usuarios.create(usuario);
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await usuarios.find();
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    }

    async getOne(query) {
        try {
            return await usuarios.findOne(query);
        } catch (error) {
            console.error('Error al buscar el usuario:', error);
            throw error;
        }
    }

    async getOneByID(id) {
        try {
            if (!mongoose.isValidObjectId(id)) {
                return null;
            }

            return await usuarios.findById(id);
        } catch (error) {
            console.error('Error al buscar el usuario por ID:', error);
            throw error;
        }
    }

    async update(id, usuario) {
        try {
            return await usuarios.findByIdAndUpdate(id, usuario, { new: true });
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            return await usuarios.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            throw error;
        }
    }

    async misPermisos(id) {
        try {
            const usuario = await this.getOneByID(id);

            if (!usuario) {
                return [];
            }

            return await Permiso.find({
                $or: [
                    { empleado: id },
                    { empleado: usuario.email },
                    { empleado: usuario.usuario },
                ],
            });
        } catch (error) {
            console.error('Error al obtener los permisos del usuario:', error);
            throw error;
        }
    }
}

export default new usuariosModelo();
