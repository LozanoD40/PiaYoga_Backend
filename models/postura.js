import mongoose from 'mongoose'

const posturaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    imagenPrincipal: {
      type: String, // URL o path
      required: true,
    },

    imagenesAdicionales: {
      type: [String], // opcional
      default: [],
    },

    descripcionCorta: {
      type: String,
      required: true,
      maxlength: 180,
    },

    descripcionLarga: {
      type: String,
      required: true,
    },

    video: {
      type: String, // URL a un video externo o interno
    },

    categoria: {
  type: [String],
  enum: [
    'espalda',
    'lumbar',
    'cuello',
    'hombros',
    'brazos',
    'pecho',
    'core',
    'caderas',
    'piernas',
    'equilibrio',
    'respiración'
  ],
  default: ['otro'],
},

    energiaGastada: { type: Number, required: true, default: 0 },
    tiempoMinutos: { type: Number, required: true, default: 1 },
    dificultad: { type: Number, min: 1, max: 5, default: 1 },
    nivel: {
      type: String,
      enum: ['básico', 'intermedio', 'avanzado'],
      default: 'básico',
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

export default mongoose.model('Postura', posturaSchema)

