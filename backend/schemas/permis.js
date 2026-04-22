import mongoose from "mongoose";

const permisoSchema = new mongoose.Schema(
    {
        empleado: {
            type: String,
            required: true
        },
        creacion: {
            type: Date,
            required: true,
            default: Date.now
        },
        fechaInicio: {
            type: Date,
            required: true,
        },
        fechaFinal: {
            type: Date,
            required: true,
        },
        tipo: {
            type: String,
            required: true,
            enum: ['hospitalitzacio', 'matrimoni', 'trasllat', 'malaltia', 'naixement', 'altres']
            //en futuro quitar enum y dejarlo en tabla propia.
        },
        descripcion: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true,
            enum: ['pendiente', 'aprobado', 'rechazado'],
            default: 'pendiente',
        },
        adminGestor: {
            type: String,
            required: false
        },
        fechaTramitado: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Permiso', permisoSchema);