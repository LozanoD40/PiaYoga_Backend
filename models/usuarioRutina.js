import mongoose from 'mongoose'

const usuarioRutinaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },

  tipo: {
    type: String,
    enum: ['predefinida', 'personalizada'],
    required: true,
  },

  datosPersonales: {
    peso: Number,
    edad: Number,
    estiloVida: {
      type: String,
      enum: ['sedentario', 'activo', 'deportista', 'atleta'],
    },
    nivel: {
      type: String,
      enum: ['principiante', 'medio', 'estandar', 'experto', 'atleta'],
    },
  },

  posturas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Postura',
    },
  ],

  progresion: [
    {
      semana: Number,
      duracionMinutos: Number,
      intensidad: String,
    },
  ],

  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('UsuarioRutina', usuarioRutinaSchema)
