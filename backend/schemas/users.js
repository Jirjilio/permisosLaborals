import mongoose from "mongoose";
import { randomUUID } from 'crypto';

const usuarioSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, default: () => randomUUID() },
        nombre: { type: String, required: true, trim: true },
        apellido1: { type: String, required: false, trim: true, default: '' },
        apellido2: { type: String, required: false, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        usuario: { type: String, required: false, trim: true, default: function () { return this.email?.split('@')[0] || ''; } },
        telefono: { type: String, required: false, trim: true },
        password: { type: String, required: true },
        //imagen: { type: String, required: false },
        rol: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    });

export default mongoose.model('usuarios', usuarioSchema);