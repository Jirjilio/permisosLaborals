import mongoose from "mongoose";

const permisoSchema = new mongoose.Schema(
    {
        empleatCreadorId: {
            type: String,
            required: true
        },
        dataCreacio: {
            type: Date,
            required: true,
            default: Date.now
        },
        dataInici: {
            type: Date,
            required: true,
        },
        dataFinal: {
            type: Date,
            required: true,
        },
        tipus: {
            type: String,
            required: true,
            enum: ['hospitalitzacio', 'matrimoni', 'trasllat', 'malaltia', 'naixement', 'altres']
        },
        descripcio: {
            type: String,
            required: true
        },
        estat: {
            type: String,
            required: true,
            enum: ['pendent', 'aprovat', 'refusat'],
            default: 'pendent',
        },
        empleatTramitadorId: {
            type: String,
            required: false
        },
        dataTramitacio: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Permiso', permisoSchema);