import 'dotenv/config';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

class dbClient {
    constructor() {
        this.conectarBD();
    }

    async conectarBD() {
        const queryString = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/Permisos?retryWrites=true&w=majority`;
        await mongoose.connect(queryString)
        console.log("Conectado al servidor de base de datos")
    }

    async desconectarBD() {
        try {
            await mongoose.disconnect();
            console.log("Desconectado del servidor de base de datos")
        } catch (error) {
            console.error("Error al desconectar de la base de datos:", error);
        }

    }
}

export default new dbClient;