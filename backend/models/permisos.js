//import ObjectID from "mongodb"
//import dbClient from "../config/dbClient.js";
import mongoose from "mongoose";
import Permiso from "../schemas/permisos.js";

class permisosModelo {

    async create(permiso){
        try {
            return await Permiso.create(permiso);
        } catch (error) {
            console.error("Error al crear el permiso:", error);
        }
    }

    async getAll(filtros = {}){
        try {
            const query = {};

            if (filtros.estat) {
                query.estat = filtros.estat;
            }

            if (filtros.empleatCreadorId) {
                query.empleatCreadorId = filtros.empleatCreadorId;
            }

            if (filtros.empleatTramitadorId) {
                query.empleatTramitadorId = filtros.empleatTramitadorId;
            }

            return await Permiso.find(query);
        } catch (error) {
            console.error("Error al obtener todos los permisos:", error);
        }
    }

    async getOne(id){
        try {
            return await Permiso.findById({ _id: new mongoose.Types.ObjectId(id) });
        } catch (error) {
            console.error("Error al buscar el permiso por ID:", error);
        }
        
    }

    async update(id, permiso){
        try {
            return await Permiso.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, permiso, { new: true });
        } catch (error) {
            console.error("Error al actualizar el permiso:", error);
        }
    }

    async delete(id){
        try {
            return await Permiso.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
        } catch (error) {
            console.error("Error al eliminar el permiso:", error);
        }
    }
}

export default new permisosModelo