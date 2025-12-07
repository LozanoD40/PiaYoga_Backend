import mongoose from 'mongoose'

const musicaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    artista: {
      type: String,
      default: 'Desconocido',
    },
    portada: {
      type: String, // URL de la imagen opcional
    },
    archivoAudio: {
      type: String, // URL del audio
      required: true,
    },
    duracion: {
      type: Number, // segundos
    },
    premium: {
      type: Boolean,
      default: false,
    },
    estado: {
      type: Boolean,
      default: true, // activo o desactivado
    },
    descripcion: {
      type: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Musica', musicaSchema)
