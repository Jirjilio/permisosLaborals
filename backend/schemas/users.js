const usuarioSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        apellido1: { type: String, required: true, trim: true },
        apellido2: { type: String, required: false, trim: true },

        email: { type: String, required: true, unique: true, trim: true },
        
        telefono: { type: String, required: false},
        password: { type: String, required: true }
    });

export default mongoose.model('usuarios', usuarioSchema);