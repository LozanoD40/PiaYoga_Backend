import mongoose from 'mongoose'

const usuarioRetoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },

    reto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reto',
      required: true,
    },

    // Lista de posturas completadas por el usuario
    posturasCompletadas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Postura',
      },
    ],

    // Estado del reto
    estado: {
      type: String,
      enum: ['pendiente', 'en_progreso', 'completado'],
      default: 'pendiente',
    },

    // Si el usuario ya recibió la recompensa especial del reto
    recompensaRecibida: {
      type: Boolean,
      default: false,
    },

    // Para retos con límite de tiempo
    fechaInicio: { type: Date, default: null },
    fechaFin: { type: Date, default: null },

    tiempoTotalMin: { type: Number, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('UsuarioReto', usuarioRetoSchema)
