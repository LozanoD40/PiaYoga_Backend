// models/reto.js
import mongoose from 'mongoose'

const retoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, default: '' },
    imagen: { type: String },

    dificultad: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },

    // Lista de posturas que forman el reto
    posturas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Postura',
        required: true,
      },
    ],

    // Indica si deben hacerse en el orden definido
    enOrden: { type: Boolean, default: false },

    // Recompensas especiales por completar el reto
    recompensaEspecial: {
      dineroExtra: { type: Number, default: 0 },
      puntosExtra: { type: Number, default: 0 },
      accesorioEspecial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accesorio',
        default: null,
      },
    },

    // Opcional: retos por tiempo
    tiempoLimiteMin: { type: Number, default: null },

    fechaInicio: { type: Date, default: null },
    fechaFin: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Reto', retoSchema)
