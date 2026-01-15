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

    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
    
    descripcion: {
      type: String,
      default: '',
    },

    imagen: {
      type: String, // URL o path
      required: true,
    },

    dificultad: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado'],
      required: true,
    },

    tiempoTotal: {
      type: Number, // minutos
      required: true,
    },

    // Posturas con orden y duración
    posturas: [
      {
        postura: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Postura',
          required: true,
        },
        duracion: {
          type: Number, // segundos
          required: true,
        },
        orden: {
          type: Number,
          required: true,
        },
      },
    ],

    // Música relacionada
    musica: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Musica',
      required: false,
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

export default mongoose.model('Rutina', rutinaSchema)
