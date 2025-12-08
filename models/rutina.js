import mongoose from 'mongoose'

const usuarioRutinaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },

  // ahora coincide con los tipos reales de Rutina
  tipo: {
    type: String,
    enum: ['predefinido', 'personalizado', 'reto'],
    required: true,
  },

  // si es una rutina existente
  rutina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rutina',
    default: null,
  },

  // solo se usa en rutina personalizada
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

  // lista final de posturas a realizar (derivadas de rutina o generadas)
  posturas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Postura',
    },
  ],

  // progreso del usuario en la rutina
  progresion: [
    {
      semana: Number,
      duracionMinutos: Number,
      intensidad: String,
      completado: { type: Boolean, default: false },
    },
  ],

  completado: {
    type: Boolean,
    default: false,
  },

  totalPuntosGanados: { type: Number, default: 0 },
  totalDineroGanado: { type: Number, default: 0 },

  fechaCreacion: {
    type: Date,
    default: Date.now,
  },

  fechaCompletado: { type: Date, default: null },
})

export default mongoose.model('UsuarioRutina', usuarioRutinaSchema)
