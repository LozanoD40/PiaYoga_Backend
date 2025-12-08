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
      type: String,
      enum: ['espalda', 'cuello', 'brazos', 'piernas', 'respiración', 'otro'],
      default: 'otro',
    },
    
    energiaGastada: { type: Number, default: 0 }, // para calcular puntos
    dificultad: { type: Number, min: 1, max: 5, default: 1 },
    tiempoMinutos: { type: Number, default: 0 },
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

export default mongoose.models.Postura || mongoose.model('Postura', posturaSchema)

