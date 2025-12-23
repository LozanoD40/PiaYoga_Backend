import mongoose from 'mongoose'

const rutinaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    tipo: {
      type: String,
      enum: ['predefinido', 'personalizado'],
      required: true,
    },

    descripcion: {
      type: String,
      default: '',
    },

    posturas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Postura',
        required: true,
      },
    ],

    energiaTotal: { type: Number, default: 0 },
    tiempoTotal: { type: Number, default: 0 },
    dificultadPromedio: { type: Number, default: 1 },

    estado: {
      type: String,
      enum: ['publicado', 'oculto'],
      default: 'publicado',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Rutina', rutinaSchema)
