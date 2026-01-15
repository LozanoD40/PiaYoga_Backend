import mongoose from 'mongoose'

const usuarioRutinaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },

    rutina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rutina',
      required: true,
    },

    // Historial de sesiones
    progreso: [
      {
        fecha: {
          type: Date,
          default: Date.now,
        },
        completada: {
          type: Boolean,
          default: false,
        },
        duracionRealMinutos: {
          type: Number,
          default: 0,
        },
        puntosGanados: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Totales
    puntosTotales: {
      type: Number,
      default: 0,
    },

    rutinaCompletada: {
      type: Boolean,
      default: false,
    },

    fechaInicio: {
      type: Date,
      default: Date.now,
    },

    fechaFinalizacion: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('UsuarioRutina', usuarioRutinaSchema)
