import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
    {   
        
        nombre: { type: String, required: true, trim: true },
        apellido1: { type: String, required: true, trim: true },
        apellido2: { type: String, required: false, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        usuario: { type: String, required: true},
        password: { type: String, required: true },
        //imagen: { type: String, required: false },
        rol: { type: String, required: true, enum: ['admin', 'user'] },
    });

export default mongoose.model('usuarios', usuarioSchema);