import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UsuarioModelo from '../schemas/users.js';

class dbClient {
    constructor() {
        this.conectarBD().catch((error) => {
            console.error('No se pudo conectar a MongoDB:', error.message || error);
        });
    }

    async conectarBD() {
        const directUri = process.env.MONGODB_URI?.trim();
        const atlasReady = process.env.USER_DB && process.env.PASS_DB && process.env.SERVER_DB;

        const queryString = directUri
            || (atlasReady
                ? `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/clusterPermisos?retryWrites=true&w=majority`
                : 'mongodb://127.0.0.1:27017/clusterPermisos');

        if (!directUri && !atlasReady) {
            console.warn('DB: usando MongoDB local por defecto. Si quieres Atlas, define MONGODB_URI o USER_DB/PASS_DB/SERVER_DB.');
        }

        await mongoose.connect(queryString)
        console.log("Conectado al servidor de base de datos")
        await this.sembrarUsuariosPrueba();
    }

    async sembrarUsuariosPrueba() {
        const totalUsuarios = await UsuarioModelo.countDocuments();

        if (totalUsuarios > 0) {
            return;
        }

        const passwordAdmin = await bcrypt.hash('Admin1234!', 10);
        const passwordBasic = await bcrypt.hash('Basic1234!', 10);

        await UsuarioModelo.insertMany([
            {
                nombre: 'Admin',
                apellido1: 'Demo',
                apellido2: '',
                email: 'admin@test.com',
                usuario: 'admin',
                telefono: '',
                imagen: '',
                password: passwordAdmin,
                rol: 'admin',
            },
            {
                nombre: 'Basic',
                apellido1: 'Demo',
                apellido2: '',
                email: 'basic@test.com',
                usuario: 'basic',
                telefono: '',
                imagen: '',
                password: passwordBasic,
                rol: 'basic',
            },
        ]);

        console.log('Usuarios de prueba sembrados: admin@test.com / admin, basic@test.com / basic');
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