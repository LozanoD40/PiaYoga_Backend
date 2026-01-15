import mongoose from 'mongoose'

const logroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    frase: {
      type: String,
      required: true,
      maxlength: 150,
    },

    imagen: {
      type: String,
      required: true, // URL o path
    },

    tipo: {
      type: String,
      enum: ['constancia', 'rutinas', 'dificultad', 'tiempo', 'especial'],
      default: 'constancia',
    },

    rareza: {
      type: String,
      enum: ['comun', 'raro', 'epico', 'legendario'],
      default: 'comun',
    },

    requisitos: {
      rutinasCompletadas: { type: Number, default: 0 },
      diasConsecutivos: { type: Number, default: 0 },
      tiempoTotalMinutos: { type: Number, default: 0 },
      dificultadMinima: { type: Number, min: 1, max: 5 },
      logroPrevio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Logro',
      },
    },

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

export default mongoose.model('Logro', logroSchema)
